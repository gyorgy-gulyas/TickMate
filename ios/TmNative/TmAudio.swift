import Foundation
import AVFoundation

/// Low-latency PCM playback — the iOS counterpart of the Android `TmAudio`
/// Kotlin module. The whole task is pre-rendered in JS into one mono Float32
/// buffer; here we only stream it out with AVAudioEngine so START has minimal,
/// predictable latency. One sound at a time: a new `play()` supersedes the
/// previous. PCM crosses the bridge as base64 (little-endian float32 bytes),
/// matching the Android module and the JS `player` interface (unchanged).
@objc(TmAudio)
class TmAudio: NSObject {
  private let engine = AVAudioEngine()
  private let player = AVAudioPlayerNode()
  private var attached = false
  private var connectedSampleRate: Double = 0

  @objc(play:sampleRate:)
  func play(_ base64Pcm: String, sampleRate: NSNumber) {
    let sr = sampleRate.doubleValue
    guard sr > 0,
          let data = Data(base64Encoded: base64Pcm),
          data.count >= 4 else { return }

    let frameCount = data.count / 4
    var samples = [Float](repeating: 0, count: frameCount)
    samples.withUnsafeMutableBytes { raw in
      data.copyBytes(to: raw.bindMemory(to: UInt8.self))
    }

    configureSession(sampleRate: sr)

    guard let format = AVAudioFormat(commonFormat: .pcmFormatFloat32,
                                     sampleRate: sr,
                                     channels: 1,
                                     interleaved: false) else { return }

    if !attached {
      engine.attach(player)
      attached = true
    }
    if connectedSampleRate != sr {
      engine.connect(player, to: engine.mainMixerNode, format: format)
      connectedSampleRate = sr
    }

    guard let buffer = AVAudioPCMBuffer(pcmFormat: format,
                                        frameCapacity: AVAudioFrameCount(frameCount)),
          let channel = buffer.floatChannelData?[0] else { return }
    buffer.frameLength = AVAudioFrameCount(frameCount)
    samples.withUnsafeBufferPointer { src in
      if let base = src.baseAddress {
        channel.update(from: base, count: frameCount)
      }
    }

    // Supersede any current sound (mirrors the Android AudioTrack behaviour).
    player.stop()
    if !engine.isRunning {
      engine.prepare()
      try? engine.start()
    }
    player.scheduleBuffer(buffer, at: nil, options: .interrupts, completionHandler: nil)
    player.play()
  }

  @objc func stop() {
    player.stop()
  }

  // Parity with the Android module so a JS NativeEventEmitter never warns.
  @objc func addListener(_ eventName: String) {}
  @objc func removeListeners(_ count: NSNumber) {}

  private func configureSession(sampleRate: Double) {
    let session = AVAudioSession.sharedInstance()
    try? session.setCategory(.playback, mode: .default, options: [])
    try? session.setPreferredSampleRate(sampleRate)
    try? session.setPreferredIOBufferDuration(0.005) // ~5 ms, low latency
    try? session.setActive(true)
  }

  @objc static func requiresMainQueueSetup() -> Bool { false }
}
