//
//  HistoricalOffer.h
//  
//
//  Created by Emiliano Bivachi on 14/11/15.
//
//

#import "Offer.h"

@protocol HistoricalOffer

@end

@interface HistoricalOffer : Offer

@property (nonatomic) NSDate *datetime;

@end
