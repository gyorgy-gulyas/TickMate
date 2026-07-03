import Foundation
import AVFoundation
import React

/// Read-only Bluetooth status — the iOS counterpart of the Android
/// `TmBluetooth` module. iOS gives us the active audio route without extra
/// permissions, so we report the earpiece (a connected BT audio output). The
/// button (HID) and watch aren't inspectable the same way here, so they report
/// not-paired for now; the JS layer degrades gracefully either way.
///
/// NOTE: if a first cloud build errors inside this file (e.g. `import React`
/// promise types), it can be deleted together with TmBluetooth.m — audio still
/// works and the app just shows every device as "not paired" on iOS.
@objc(TmBluetooth)
class TmBluetooth: NSObject {
  @objc(getStatus:rejecter:)
  func getStatus(_ resolve: @escaping RCTPromiseResolveBlock,
                 rejecter reject: @escaping RCTPromiseRejectBlock) {
    let none: [String: Any] = ["paired": false, "name": NSNull()]
    var earpiece = none
    for output in AVAudioSession.sharedInstance().currentRoute.outputs {
      switch output.portType {
      case .bluetoothA2DP, .bluetoothHFP, .bluetoothLE:
        earpiece = ["paired": true, "name": output.portName]
      default:
        break
      }
    }
    resolve(["earpiece": earpiece, "button": none, "watch": none])
  }

  @objc static func requiresMainQueueSetup() -> Bool { false }
}
