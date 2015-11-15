//
//  MarketDataStore.m
//  
//
//  Created by Emiliano Bivachi on 14/11/15.
//
//

#import "MarketDataStore.h"
#import "InstrumentsResponse.h"
#import "MarketDataResponse.h"

NSString *const MarketDataEndpoint = @"http://demo-api.primary.com.ar:8081/pbcp/";

@implementation MarketDataStore

- (instancetype)init {
    self = [super init];
    if (self) {
        AFSecurityPolicy *policy = [AFSecurityPolicy policyWithPinningMode:AFSSLPinningModeNone];
        policy.allowInvalidCertificates = YES;
        policy.validatesDomainName = NO;
        self.sessionManager.securityPolicy = policy;
    }
    return self;
}

+ (MarketDataStore *) sharedInstance {
    static dispatch_once_t once;
    static id _sharedInstance;
    dispatch_once(&once, ^{
        _sharedInstance = [[self alloc] init];
    });
    return _sharedInstance;
}

- (NSURLRequest *)requestWithPath:(NSString *)path
                       parameters:(NSDictionary *)parameters
                           method:(NSString *)method
                          headers:(NSDictionary*)headers {
    return [self requestWithBaseUrl:MarketDataEndpoint
                               path:path
                         parameters:parameters
                             method:method
                            headers:headers];
}

+ (BOOL)isLoggedIn {
    return ([[NSHTTPCookieStorage sharedHTTPCookieStorage] cookies].count > 0);
}

- (void)logInWithUser:(NSString *)user
          andPassword:(NSString *)password
  withCompletionBlock:(void (^)(NSError *))completionBlock {
    NSString *path = @"http://demo-api.primary.com.ar:8081/pbcp/j_spring_security_check";
    NSDictionary *params = @{ @"j_username": user,
                              @"j_password": password };
    NSURLRequest *request = [self requestWithBaseUrl:path path:@"" parameters:params method:@"POST" headers:nil];
    NSURLSessionDataTask *task = [self.sessionManager dataTaskWithRequest:request completionHandler:^(NSURLResponse *response, id responseObject, NSError *error) {
        NSLog(@"%@",[[NSHTTPCookieStorage sharedHTTPCookieStorage] cookies]);
        completionBlock(error);
    }];
    [task resume];
}

- (void)getAllTradableInstrumentsWithCompletionBlock:(void (^)(Response *, NSError *))completionBlock {
    NSString *path = @"rest/instruments/all";
    if ([MarketDataStore isLoggedIn]) {
        NSURLRequest *request = [self requestWithPath:path parameters:nil method:@"GET" headers:nil];
        [self executeRequest:request withReturnClass:InstrumentsResponse.class withCompletioBlock:completionBlock];
    } else {
        [self logInWithUser:kUser andPassword:kPassword withCompletionBlock:^(NSError *error) {
            NSURLRequest *request = [self requestWithPath:path parameters:nil method:@"GET" headers:nil];
            [self executeRequest:request withReturnClass:InstrumentsResponse.class withCompletioBlock:completionBlock];
        }];
    }
    
}

- (void)getMarketDataForInstrument:(Instrument *)instrument withCompletionBlock:(void (^)(Response *, NSError *))completionBlock {
    NSString *path = @"rest/marketdata/get";
    NSDictionary *params = @{ @"marketId": instrument.marketId,
                              @"symbol": instrument.symbol,
                              @"entries": @"BI,OF,LA,OP,CL,SE,OI" };
    if ([MarketDataStore isLoggedIn]) {
        NSURLRequest *request = [self requestWithPath:path parameters:params method:@"GET" headers:nil];
        [self executeRequest:request withReturnClass:MarketDataResponse.class withCompletioBlock:completionBlock];
    } else {
        [self logInWithUser:kUser andPassword:kPassword withCompletionBlock:^(NSError *error) {
            NSURLRequest *request = [self requestWithPath:path parameters:params method:@"GET" headers:nil];
            [self executeRequest:request withReturnClass:MarketDataResponse.class withCompletioBlock:completionBlock];
        }];
    }
    
    
}

@end
