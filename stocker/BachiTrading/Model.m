//
//  Model.m
//  
//
//  Created by Emiliano Bivachi on 14/11/15.
//
//

#import "Model.h"
#import "DateUtils.h"

@implementation Model

@end

@implementation JSONValueTransformer (CustomTransformer)

- (NSDate *)NSDateFromNSString:(NSString*)string {
    NSArray *array = [string componentsSeparatedByString:@"."];
    NSDateFormatter *formatter = [[DateUtils sharedInstance] longDateFormatter];
    return [formatter dateFromString:array[0]];
}

@end
