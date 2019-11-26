/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#import "AppDelegate.h"

#import <Foundation/Foundation.h>

#import <React/RCTRootView.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTLog.h>

#import "StorageDocument.h"

#import <Firebase.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [FIRApp configure];
  NSURL *jsCodeLocation;
  #ifdef DEBUG
    jsCodeLocation = [NSURL URLWithString:@"http://localhost:8081/index.ios.bundle?platform=ios&dev=true"];
  #else
    jsCodeLocation = [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
  #endif
  //jsCodeLocation = [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];

  self.rootView = [[RCTRootView alloc] initWithBundleURL:jsCodeLocation
                                              moduleName:@"StockDown"
                                       initialProperties:nil
                                           launchOptions:launchOptions];
  self.rootView.backgroundColor = [UIColor blackColor];

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = self.rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];
  return YES;
}

- (BOOL)application:(UIApplication *)app openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  StorageDocument *file = [[StorageDocument alloc] initWithFileURL: url];
   NSURL *dest = [[[[NSFileManager defaultManager] URLsForDirectory:NSDocumentDirectory inDomains:NSUserDomainMask] objectAtIndex:0] URLByAppendingPathComponent:@"storage.db"];
  [file openWithCompletionHandler:^(BOOL openSuccess)
   {
    [file saveToURL:dest forSaveOperation:UIDocumentSaveForOverwriting completionHandler:^(BOOL saveSuccess)
     {
      [file closeWithCompletionHandler:^(BOOL closeSuccess)
       {
        if (saveSuccess) {
          RCTLog(@"File saved successfully");
        }
      }];
    }];
  }];
  self.rootView.appProperties = @{@"rerender": @YES};
  self.rootView.appProperties = @{@"rerender": @NO};
  
   
   return YES;
}
   
@end
