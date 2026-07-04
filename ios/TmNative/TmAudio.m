#import <React/RCTBridgeModule.h>

// Bridges the Swift `TmAudio` class to React Native's legacy module system
// (works under the New Architecture via the interop layer, like on Android).
@interface RCT_EXTERN_MODULE(TmAudio, NSObject)

RCT_EXTERN_METHOD(play:(NSString *)base64Pcm sampleRate:(nonnull NSNumber *)sampleRate)
RCT_EXTERN_METHOD(stop)
RCT_EXTERN_METHOD(getOutputLatency:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject)
RCT_EXTERN_METHOD(addListener:(NSString *)eventName)
RCT_EXTERN_METHOD(removeListeners:(nonnull NSNumber *)count)

@end
