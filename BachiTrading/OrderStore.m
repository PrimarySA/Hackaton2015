//
//  OrderStore.m
//  
//
//  Created by Emiliano Bivachi on 14/11/15.
//
//

#import "OrderStore.h"
#import "OrderResponse.h"
#import "ListOfOrdersResponse.h"
#import "MarketDataStore.h"

@implementation OrderStore

+ (OrderStore *) sharedInstance {
    static dispatch_once_t once;
    static id _sharedInstance;
    dispatch_once(&once, ^{
        _sharedInstance = [[self alloc] init];
    });
    return _sharedInstance;
}

- (void)creatNewSingleOrder:(Order *)order withCompletionBlock:(void (^)(Response *, NSError *))completionBlock {
    NSString *path = @"rest/order/newSingleOrder";
    NSDictionary *params = @{ @"marketId": order.instrument.marketId,
                              @"symbol": order.instrument.symbol,
                              @"price": @(order.price),
                              @"orderQty": @(order.orderQty),
                              @"ordType": order.ordType,
                              @"side": order.side,
                              @"timeInForce": order.timeInForce,
                              @"account": order.accountId };

    if ([MarketDataStore isLoggedIn]) {
        NSURLRequest *request = [self requestWithPath:path parameters:params method:@"GET" headers:nil];
        [self executeRequest:request withReturnClass:OrderResponse.class withCompletioBlock:^(Response *response, NSError *error) {
            if ([response isKindOfClass:[OrderResponse class]]) {
                NSString *clientId = ((OrderResponse *)response).clientId;
                [self getStatusForClientId:clientId withCompletionBlock:completionBlock];
            }
         }];
    } else {
        [self logInWithUser:kUser andPassword:kPassword withCompletionBlock:^(NSError *error) {
            NSURLRequest *request = [self requestWithPath:path parameters:params method:@"GET" headers:nil];
            [self executeRequest:request withReturnClass:OrderResponse.class withCompletioBlock:^(Response *response, NSError *error) {
                if ([response isKindOfClass:[OrderResponse class]]) {
                    NSString *clientId = ((OrderResponse *)response).clientId;
                    [self getStatusForClientId:clientId withCompletionBlock:completionBlock];
                }
            }];
        }];
    }
}

- (void)cancelOrder:(Order *)order withCompletionBlock:(void (^)(Response *, NSError *))completionBlock {
    NSString *path = @"rest/order/cancelById";
    NSDictionary *params = @{ @"clOrdId": order.clOrdId,
                              @"proprietary": @"api" };
    
    if ([MarketDataStore isLoggedIn]) {
        NSURLRequest *request = [self requestWithPath:path parameters:params method:@"GET" headers:nil];
        [self executeRequest:request withReturnClass:OrderResponse.class withCompletioBlock:completionBlock];
    } else {
        [self logInWithUser:kUser andPassword:kPassword withCompletionBlock:^(NSError *error) {
            NSURLRequest *request = [self requestWithPath:path parameters:params method:@"GET" headers:nil];
            [self executeRequest:request withReturnClass:OrderResponse.class withCompletioBlock:completionBlock];
        }];
    }
}

- (void)getStatusForClientId:(NSString *)clientId withCompletionBlock:(void (^)(Response *, NSError *))completionBlock {
    NSString *path = @"rest/order/allById";
    NSDictionary *params = @{ @"clOrdId": clientId,
                              @"proprietary": @"api" };
    if ([MarketDataStore isLoggedIn]) {
        NSURLRequest *request = [self requestWithPath:path parameters:params method:@"GET" headers:nil];
        [self executeRequest:request withReturnClass:ListOfOrdersResponse.class withCompletioBlock:completionBlock];
    } else {
        [self logInWithUser:kUser andPassword:kPassword withCompletionBlock:^(NSError *error) {
            NSURLRequest *request = [self requestWithPath:path parameters:params method:@"GET" headers:nil];
            [self executeRequest:request withReturnClass:ListOfOrdersResponse.class withCompletioBlock:completionBlock];
        }];
    }
}

- (void)getOrdersForAccountId:(NSString *)accountId withCompletionBlock:(void (^)(Response *, NSError *))completionBlock {
    NSString *path = @"rest/order/all";
    NSDictionary *params = @{ @"accountId": accountId };
    if ([MarketDataStore isLoggedIn]) {
        NSURLRequest *request = [self requestWithPath:path parameters:params method:@"GET" headers:nil];
        [self executeRequest:request withReturnClass:ListOfOrdersResponse.class withCompletioBlock:completionBlock];
    } else {
        [self logInWithUser:kUser andPassword:kPassword withCompletionBlock:^(NSError *error) {
            NSURLRequest *request = [self requestWithPath:path parameters:params method:@"GET" headers:nil];
            [self executeRequest:request withReturnClass:ListOfOrdersResponse.class withCompletioBlock:completionBlock];
        }];
    }
}

@end
