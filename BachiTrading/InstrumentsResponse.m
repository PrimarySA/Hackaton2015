//
//  InstrumentsResponse.m
//  
//
//  Created by Emiliano Bivachi on 14/11/15.
//
//

#import "InstrumentsResponse.h"

@implementation InstrumentsResponse

+(JSONKeyMapper*)keyMapper {
    return [[JSONKeyMapper alloc] initWithDictionary:@{ @"order_id": @"id",
                                                        @"instruments.instrumentId": @"instruments" }];
}

@end
