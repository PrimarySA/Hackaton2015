//
//  Order.m
//  
//
//  Created by Emiliano Bivachi on 14/11/15.
//
//

#import "Order.h"

@implementation Order

- (instancetype)initWithData:(NSData *)data error:(NSError *__autoreleasing *)error {
    self = [super initWithData:data error:error];
    if (self) {
        self.proprietary = @"api";
        self.accountId = @"20";
    }
    return self;
}

+(JSONKeyMapper*)keyMapper {
    return [[JSONKeyMapper alloc] initWithDictionary:@{ @"accountId.id": @"accountId",
                                                        @"instrumentId": @"instrument" }];
}

@end
