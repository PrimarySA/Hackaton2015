//
//  MarketDataStore.h
//  
//
//  Created by Emiliano Bivachi on 14/11/15.
//
//

#import "BaseStore.h"
#import "Response.h"
#import "Instrument.h"
#define kUser @"user2"
#define kPassword @"password"

@interface MarketDataStore : BaseStore

+ (MarketDataStore *) sharedInstance;

+ (BOOL)isLoggedIn;

- (NSURLRequest *)requestWithPath:(NSString *)path
                       parameters:(NSDictionary *)parameters
                           method:(NSString *)method
                          headers:(NSDictionary*)headers;

- (void)logInWithUser:(NSString *)user
          andPassword:(NSString *)password
  withCompletionBlock:(void (^)(NSError *))completionBlock;
- (void)getAllTradableInstrumentsWithCompletionBlock:(void (^)(Response *, NSError *))completionBlock;
- (void)getMarketDataForInstrument:(Instrument *)instrument withCompletionBlock:(void (^)(Response *, NSError *))completionBlock;


@end
