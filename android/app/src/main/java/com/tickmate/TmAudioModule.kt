package com.tickmate

import android.media.AudioAttributes
import android.media.AudioFormat
import android.media.AudioTrack
import android.os.Build
import android.util.Base64
import android.util.Log
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.nio.ByteBuffer
import java.nio.ByteOrder

/**
 * Low-latency PCM playback for the audio engine.
 *
 * The whole task is pre-rendered in JS into one mono Float32 buffer with
 * sample-accurate inter-click timing; here we only stream it out with
 * AudioTrack in low-latency mode, so START has minimal, predictable latency
 * (this is what the BT-button offset will later compensate). One sound at a
 * time: a new play() supersedes the previous one, mirroring the web player.
 *
 * PCM crosses the bridge as base64 (little-endian float32 bytes) to avoid
 * marshalling a huge JS number array.
 */
class TmAudioModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  @Volatile private var track: AudioTrack? = null
  private var writer: Thread? = null

  override fun getName() = "TmAudio"

  @ReactMethod
  fun play(base64Pcm: String, sampleRate: Int) {
    stopInternal()

    val bytes = Base64.decode(base64Pcm, Base64.DEFAULT)
    val floats = FloatArray(bytes.size / 4)
    ByteBuffer.wrap(bytes).order(ByteOrder.LITTLE_ENDIAN).asFloatBuffer().get(floats)
    if (floats.isEmpty()) return

    val minBuf = AudioTrack.getMinBufferSize(
      sampleRate,
      AudioFormat.CHANNEL_OUT_MONO,
      AudioFormat.ENCODING_PCM_FLOAT,
    ).coerceAtLeast(4)

    val builder = AudioTrack.Builder()
      .setAudioAttributes(
        AudioAttributes.Builder()
          .setUsage(AudioAttributes.USAGE_MEDIA)
          .setContentType(AudioAttributes.CONTENT_TYPE_SONIFICATION)
          .build(),
      )
      .setAudioFormat(
        AudioFormat.Builder()
          .setEncoding(AudioFormat.ENCODING_PCM_FLOAT)
          .setSampleRate(sampleRate)
          .setChannelMask(AudioFormat.CHANNEL_OUT_MONO)
          .build(),
      )
      .setBufferSizeInBytes(minBuf)
      .setTransferMode(AudioTrack.MODE_STREAM)
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      builder.setPerformanceMode(AudioTrack.PERFORMANCE_MODE_LOW_LATENCY)
    }

    val t = builder.build()
    track = t
    t.play()
    Log.d("TmAudio", "play ${floats.size} samples @ ${sampleRate}Hz (minBuf=$minBuf)")

    val thread = Thread {
      try {
        var offset = 0
        while (offset < floats.size && track === t) {
          val n = t.write(floats, offset, floats.size - offset, AudioTrack.WRITE_BLOCKING)
          if (n < 0) break
          offset += n
        }
        if (track === t) {
          // Stream mode: stop() lets the already-queued tail play out. Linger
          // for the residual buffer (a few tens of ms) before releasing.
          try { t.stop() } catch (_: Exception) {}
          Thread.sleep((minBuf / 4) * 1000L / sampleRate + 60)
        }
      } catch (_: InterruptedException) {
        // superseded by a new play()/stop() — teardown handled there
      } catch (e: Exception) {
        Log.w("TmAudio", "writer error", e)
      } finally {
        if (track === t) {
          track = null
          try { t.release() } catch (_: Exception) {}
        }
      }
    }
    writer = thread
    thread.isDaemon = true
    thread.start()
  }

  @ReactMethod
  fun stop() {
    stopInternal()
  }

  private fun stopInternal() {
    val t = track
    track = null
    if (t != null) {
      try { t.pause(); t.flush() } catch (_: Exception) {}
      try { t.stop() } catch (_: Exception) {}
      try { t.release() } catch (_: Exception) {}
    }
    writer?.interrupt()
    writer = null
  }

  // Present so JS-side NativeEventEmitter usage never warns; harmless no-ops.
  @ReactMethod fun addListener(eventName: String) {}

  @ReactMethod fun removeListeners(count: Int) {}

  override fun invalidate() {
    stopInternal()
    super.invalidate()
  }
}
