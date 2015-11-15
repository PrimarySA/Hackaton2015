//
//  MiscUtils.h
//  
//
//  Created by Emiliano Bivachi on 15/11/15.
//
//

#import <UIKit/UIKit.h>

@interface MiscUtils : NSObject

+ (void) addConstraintsToMatchItsSuperView:(UIView *)view;
+ (void) addConstraintsToMatchItsSuperView:(UIView *)view withInsets:(UIEdgeInsets)insets;
+ (NSArray *) constraintsToMatchSizeOfView: (UIView *) view intoView: (UIView *) superview;

@end
