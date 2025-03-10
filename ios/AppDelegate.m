#import "AppDelegate.h"
#import <React/RCTBridgeModule.h>
#import "BluetoothManagerBridge.h"

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {

  // Initialize BluetoothManager
  [BluetoothManagerBridge new];

  return YES;
}

@end