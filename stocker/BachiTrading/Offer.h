//
//  Offer.h
//  
//
//  Created by Emiliano Bivachi on 14/11/15.
//
//

#import "Model.h"

@protocol Offer

@end

@interface Offer : Model

@property (nonatomic) CGFloat price;
@property (nonatomic) CGFloat size;

@end
