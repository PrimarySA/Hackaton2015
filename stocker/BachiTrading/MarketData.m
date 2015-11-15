//
//  MarketData.m
//  
//
//  Created by Emiliano Bivachi on 14/11/15.
//
//

#import "MarketData.h"

@implementation MarketData

+(JSONKeyMapper*)keyMapper {
    return [[JSONKeyMapper alloc] initWithDictionary:@{ @"LA": @"last",
                                                        @"BI": @"bid",
                                                        @"OF": @"offer",
                                                        @"OI": @"openInterest",
                                                        @"OP": @"openPrice",
                                                        @"SE": @"settlement",
                                                        @"CL": @"close" }];
}

@end