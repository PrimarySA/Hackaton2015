//
//  OrderResponse.m
//  
//
//  Created by Emiliano Bivachi on 14/11/15.
//
//

#import "OrderResponse.h"

@implementation OrderResponse

+(JSONKeyMapper*)keyMapper {
    return [[JSONKeyMapper alloc] initWithDictionary:@{ @"order.clientId": @"clientId" }];
}


@end
