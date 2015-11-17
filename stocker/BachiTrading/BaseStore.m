//
//  BaseStore.m
//  
//
//  Created by Emiliano Bivachi on 14/11/15.
//
//

#import "BaseStore.h"
#import "Model.h"

static dispatch_queue_t _networkQueue;

@implementation BaseStore

- (instancetype) init {
    self = [super init];
    if (self) {
        if (!_networkQueue) {
            static dispatch_once_t onceToken;
            dispatch_once(&onceToken, ^{
                _networkQueue = dispatch_queue_create("com.bachi.trading.NetworkingCompletionQueue", NULL);
            });
        }
        self.sessionManager = [AFHTTPSessionManager manager];
        self.sessionManager.requestSerializer = [AFHTTPRequestSerializer serializer];
        self.sessionManager.requestSerializer.HTTPShouldHandleCookies = YES;
        self.sessionManager.responseSerializer = [AFHTTPResponseSerializer serializer];
        self.sessionManager.completionQueue = _networkQueue;
    }
    return self;
}

- (NSURLRequest *)requestWithBaseUrl:(NSString *)baseURL
                                path:(NSString *)path
                          parameters:(NSDictionary *)parameters
                              method:(NSString *)method
                             headers:(NSDictionary*)headers {
    
    NSString *url = [[baseURL stringByAppendingString:path] stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    NSMutableURLRequest *request = [self.sessionManager.requestSerializer
                                    requestWithMethod:method
                                    URLString:url
                                    parameters:parameters
                                    error:nil];
    NSDictionary *cookies = [NSHTTPCookie requestHeaderFieldsWithCookies: [[NSHTTPCookieStorage sharedHTTPCookieStorage] cookies]];
    
    [request setAllHTTPHeaderFields:cookies];

    for (NSString *key in [self.defaultHeaders allKeys]) {
        [request setValue: [self.defaultHeaders valueForKey:key] forHTTPHeaderField: key];
    }
    
    NSLog(@"Request URL: %@", request.URL);
    NSLog(@"Request allHTTPHeaderFields: %@", request.allHTTPHeaderFields);
    
    return request;
}

- (void)executeRequest:(NSURLRequest *)request withReturnClass:(Class)klazz withCompletioBlock:(void (^)(Response *, NSError *))completionBlock {

    NSURLSessionDataTask *task = [self.sessionManager dataTaskWithRequest:request completionHandler:^(NSURLResponse *response, id responseObject, NSError *error) {
        Response *object = [[klazz alloc] initWithData:responseObject error:&error];
        if (error) {
            
        }
        dispatch_async(dispatch_get_main_queue(), ^{
            completionBlock(object, error);
        });
    }];
    [task resume];
}

@end
