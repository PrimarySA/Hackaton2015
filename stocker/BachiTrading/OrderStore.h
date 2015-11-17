//
//  OrderStore.h
//  
//
//  Created by Emiliano Bivachi on 14/11/15.
//
//

#import "MarketDataStore.h"
#import "Order.h"
#import "Response.h"

@interface OrderStore : MarketDataStore

+ (OrderStore *) sharedInstance;

- (void)creatNewSingleOrder:(Order *)order withCompletionBlock:(void (^)(Response *, NSError *))completionBlock;
- (void)cancelOrder:(Order *)order withCompletionBlock:(void (^)(Response *, NSError *))completionBlock;
- (void)getStatusForClientId:(NSString *)clientId withCompletionBlock:(void (^)(Response *, NSError *))completionBlock;
- (void)getOrdersForAccountId:(NSString *)accountId withCompletionBlock:(void (^)(Response *, NSError *))completionBlock;

@end
