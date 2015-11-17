//
//  HistoricalDataStore.m
//  
//
//  Created by Emiliano Bivachi on 14/11/15.
//
//

#import "HistoricalDataStore.h"
#import "InstrumentsResponse.h"
#import "HistoricalMarketDataResponse.h"
#import "DateUtils.h"

NSString *const HistoricalDataEndpoint = @"http://h-api.primary.com.ar/MHD/";

@implementation HistoricalDataStore

+ (HistoricalDataStore *) sharedInstance {
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
    return [self requestWithBaseUrl:HistoricalDataEndpoint
                               path:path
                         parameters:parameters
                             method:method
                            headers:headers];
}

- (void)getAllHistoricalInstrumentsWithCompletionBlock:(void (^)(Response *, NSError *))completionBlock {
    NSString *path = @"instruments/all";
    NSURLRequest *request = [self requestWithPath:path parameters:nil method:@"GET" headers:nil];
    [self executeRequest:request withReturnClass:InstrumentsResponse.class withCompletioBlock:completionBlock];
}

- (void)getHistoricalMarketDataForInstrument:(Instrument *)instrument
                                     between:(NSDate *)startDate
                                         and:(NSDate *)endDate
                         withCompletionBlock:(void (^)(Response *, NSError *))completionBlock {
    NSDateFormatter *formatter = [[DateUtils sharedInstance] shortDateFormatter];
    
    NSString *startDateStr = [formatter stringFromDate:startDate];
    NSString *endDateStr = [formatter stringFromDate:endDate];
    
    NSString *path = [NSString stringWithFormat:@"Trades/%@/%@/%@", instrument.symbol, startDateStr, endDateStr];
    NSURLRequest *request = [self requestWithPath:path parameters:nil method:@"GET" headers:nil];
    [self executeRequest:request withReturnClass:HistoricalMarketDataResponse.class withCompletioBlock:completionBlock];
}

- (void)getHistoricalMarketDataForInstrument:(Instrument *)instrument
                                     forDate:(NSDate *)date
                         withCompletionBlock:(void (^)(Response *, NSError *))completionBlock {
    NSDateFormatter *formatter = [[DateUtils sharedInstance] shortDateFormatter];
    
    NSString *dateStr = [formatter stringFromDate:date];
    
    NSString *path = [NSString stringWithFormat:@"Trades/%@/%@", instrument.symbol, dateStr];
    NSURLRequest *request = [self requestWithPath:path parameters:nil method:@"GET" headers:nil];
    [self executeRequest:request withReturnClass:HistoricalMarketDataResponse.class withCompletioBlock:completionBlock];
}


@end
