package com.tickmate

import android.Manifest
import android.bluetooth.BluetoothAdapter
import android.bluetooth.BluetoothClass
import android.bluetooth.BluetoothManager
import android.content.Context
import android.content.pm.PackageManager
import android.media.AudioDeviceInfo
import android.media.AudioManager
import android.os.Build
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.WritableMap

/**
 * Read-only Bluetooth status for the device settings screens.
 *
 * The app never pairs — the OS owns pairing. Here we only report what is
 * already there, so the screens can show a truthful paired/connected state
 * instead of a mock:
 *   - earpiece: an active BT audio output (AudioManager; needs no permission)
 *   - button:   a bonded HID/peripheral device (the BT START button)
 *   - watch:    a bonded wearable
 *
 * Bonded-device enumeration (button/watch) needs BLUETOOTH_CONNECT on API 31+;
 * without it — or with no BT adapter (e.g. emulator) — we report not-paired
 * rather than crash. Each entry is `{ paired: Boolean, name: String? }`.
 */
class TmBluetoothModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName() = "TmBluetooth"

  @ReactMethod
  fun getStatus(promise: Promise) {
    try {
      val out = Arguments.createMap()
      out.putMap("earpiece", earpieceStatus())
      val (button, watch) = bondedStatuses()
      out.putMap("button", button)
      out.putMap("watch", watch)
      promise.resolve(out)
    } catch (e: Exception) {
      promise.reject("bt_status_error", e)
    }
  }

  private fun status(name: String?): WritableMap {
    val m = Arguments.createMap()
    val clean = name?.takeIf { it.isNotBlank() }
    m.putBoolean("paired", name != null)
    if (clean != null) m.putString("name", clean) else m.putNull("name")
    return m
  }

  private fun notPaired(): WritableMap = Arguments.createMap().apply {
    putBoolean("paired", false)
    putNull("name")
  }

  /** Active BT audio output device, if any. Needs no Bluetooth permission. */
  private fun earpieceStatus(): WritableMap {
    val am = reactApplicationContext.getSystemService(Context.AUDIO_SERVICE) as? AudioManager
      ?: return notPaired()
    for (d in am.getDevices(AudioManager.GET_DEVICES_OUTPUTS)) {
      if (isBtOutput(d.type)) return status(d.productName?.toString() ?: "")
    }
    return notPaired()
  }

  private fun isBtOutput(type: Int): Boolean = when (type) {
    AudioDeviceInfo.TYPE_BLUETOOTH_A2DP,
    AudioDeviceInfo.TYPE_BLUETOOTH_SCO,
    AudioDeviceInfo.TYPE_BLE_HEADSET,
    AudioDeviceInfo.TYPE_HEARING_AID -> true
    else -> false
  }

  /** Bonded button (HID/peripheral) + watch (wearable), if BLUETOOTH_CONNECT is
   *  granted and an adapter exists. First match of each class wins. */
  private fun bondedStatuses(): Pair<WritableMap, WritableMap> {
    var buttonName: String? = null
    var watchName: String? = null
    if (hasBtConnectPermission()) {
      val adapter = bluetoothAdapter()
      val bonded = try { adapter?.bondedDevices } catch (_: SecurityException) { null }
      if (bonded != null) {
        for (d in bonded) {
          val cls = d.bluetoothClass ?: continue
          val name = try { d.name } catch (_: SecurityException) { null } ?: ""
          if (watchName == null && isWatch(cls)) {
            watchName = name
          } else if (buttonName == null && isHidButton(cls)) {
            buttonName = name
          }
        }
      }
    }
    return Pair(status(buttonName), status(watchName))
  }

  private fun isWatch(cls: BluetoothClass): Boolean =
    cls.deviceClass == BluetoothClass.Device.WEARABLE_WRIST_WATCH ||
      cls.majorDeviceClass == BluetoothClass.Device.Major.WEARABLE

  /** HID buttons/remotes present as the PERIPHERAL major class. */
  private fun isHidButton(cls: BluetoothClass): Boolean =
    cls.majorDeviceClass == BluetoothClass.Device.Major.PERIPHERAL

  private fun hasBtConnectPermission(): Boolean {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.S) return true
    return reactApplicationContext.checkSelfPermission(Manifest.permission.BLUETOOTH_CONNECT) ==
      PackageManager.PERMISSION_GRANTED
  }

  private fun bluetoothAdapter(): BluetoothAdapter? {
    val mgr = reactApplicationContext.getSystemService(Context.BLUETOOTH_SERVICE) as? BluetoothManager
    return mgr?.adapter
  }
}
