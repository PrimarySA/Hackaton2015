//
//  AppDelegate.m
//  BachiTrading
//
//  Created by Emiliano Bivachi on 14/11/15.
//  Copyright (c) 2015 Emiliano Bivachi. All rights reserved.
//

#import "AppDelegate.h"
#import "BachiTrading-Swift.h"


#import "HistoricalDataStore.h"
#import "Response.h"
#import "InstrumentsResponse.h"
#import "DateUtils.h"
#import "MarketDataStore.h"
#import "MarketDataResponse.h"
#import "MMProgressHUD.h"


@interface AppDelegate ()

@end

@implementation AppDelegate


- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
    
    [MMProgressHUD setPresentationStyle:MMProgressHUDPresentationStyleExpand];
    self.window = [[UIWindow alloc] initWithFrame: [UIScreen mainScreen].bounds];
    UINavigationController *navController = [[UINavigationController alloc]initWithRootViewController: [[MarketDataViewController alloc] init]];
    [navController.navigationBar setBarTintColor:[UIColor colorWithRed:63/255.0 green:180/255.0 blue:152/255.0 alpha:1]];
    [navController.navigationBar setBarTintColor:[UIColor whiteColor]];

    self.window.rootViewController = navController;
    [self.window makeKeyAndVisible];
    
    return YES;
}

- (void)applicationWillResignActive:(UIApplication *)application {
    // Sent when the application is about to move from active to inactive state. This can occur for certain types of temporary interruptions (such as an incoming phone call or SMS message) or when the user quits the application and it begins the transition to the background state.
    // Use this method to pause ongoing tasks, disable timers, and throttle down OpenGL ES frame rates. Games should use this method to pause the game.
}

- (void)applicationDidEnterBackground:(UIApplication *)application {
    // Use this method to release shared resources, save user data, invalidate timers, and store enough application state information to restore your application to its current state in case it is terminated later.
    // If your application supports background execution, this method is called instead of applicationWillTerminate: when the user quits.
}

- (void)applicationWillEnterForeground:(UIApplication *)application {
    // Called as part of the transition from the background to the inactive state; here you can undo many of the changes made on entering the background.
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
    // Restart any tasks that were paused (or not yet started) while the application was inactive. If the application was previously in the background, optionally refresh the user interface.
}

- (void)applicationWillTerminate:(UIApplication *)application {
    // Called when the application is about to terminate. Save data if appropriate. See also applicationDidEnterBackground:.
}

@end
