//
//  DateUtils.m
//  
//
//  Created by Emiliano Bivachi on 14/11/15.
//
//

#import "DateUtils.h"


@interface DateUtils()
@property (nonatomic, strong) NSMutableDictionary *formattersMap;
@end

@implementation DateUtils

+ (DateUtils *) sharedInstance {
    static dispatch_once_t once;
    static id _sharedInstance;
    dispatch_once(&once, ^{
        _sharedInstance = [[self alloc] init];
    });
    return _sharedInstance;
}

- (NSDateFormatter *) dateFormatterWithPattern: (NSString *) pattern
{
    NSDateFormatter *formatter = [self.formattersMap objectForKey:pattern];
    if (formatter) return formatter;
    
    @synchronized(self) {
        formatter = [[NSDateFormatter alloc] init];
        [formatter setDateFormat: pattern];
        [self.formattersMap setObject:formatter forKey:pattern];
        return formatter;
    }
}

- (NSDateFormatter *)longDateFormatter {
    return [self dateFormatterWithPattern: kLongDateFormat];
}

- (NSDateFormatter *)shortDateFormatter {
    return [self dateFormatterWithPattern: kShortDateFormat];
}

- (NSDateFormatter *)timeDateFormatter {
    return [self dateFormatterWithPattern: kTimeFormat];
}

@end
