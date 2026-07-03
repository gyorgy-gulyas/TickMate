#import <React/RCTBridgeModule.h>

// Bridges the Swift `TmBluetooth` class to React Native.
@interface RCT_EXTERN_MODULE(TmBluetooth, NSObject)

RCT_EXTERN_METHOD(getStatus:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)

@end
