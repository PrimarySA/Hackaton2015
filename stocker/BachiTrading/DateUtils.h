//
//  DateUtils.h
//  
//
//  Created by Emiliano Bivachi on 14/11/15.
//
//

#import <Foundation/Foundation.h>

#define kShortDateFormat @"yyyy-MM-dd"
#define kLongDateFormat @"yyyy-mm-dd HH:mm:ss"
#define kTimeFormat @"HH:mm:ss"

@interface DateUtils : NSObject

+ (DateUtils *) sharedInstance;

- (NSDateFormatter *)longDateFormatter;
- (NSDateFormatter *)shortDateFormatter;
- (NSDateFormatter *)timeDateFormatter;

@end
