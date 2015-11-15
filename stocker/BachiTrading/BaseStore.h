//
//  BaseStore.h
//  
//
//  Created by Emiliano Bivachi on 14/11/15.
//
//

#import <Foundation/Foundation.h>
#import <AFNetworking/AFNetworking.h>
#import "Response.h"

@interface BaseStore : NSObject

@property (nonatomic, strong) AFHTTPSessionManager *sessionManager;
@property (nonatomic, strong) NSDictionary *defaultHeaders;

- (NSURLRequest *)requestWithBaseUrl:(NSString *)baseURL
                                path:(NSString *)path
                          parameters:(NSDictionary *)parameters
                              method:(NSString *)method
                             headers:(NSDictionary*)headers;

- (void)executeRequest:(NSURLRequest *)request withReturnClass:(Class)klazz withCompletioBlock:(void (^)(Response *, NSError *))completionBlock;

@end
