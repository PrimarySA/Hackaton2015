//
//  MarketData.h
//  
//
//  Created by Emiliano Bivachi on 14/11/15.
//
//

#import "Model.h"
#import "Offer.h"

@interface MarketData : Model


@property (nonatomic, strong, nonnull) Offer *last;
@property (nonatomic, strong, nonnull) NSArray<Offer, Optional> *bid;
@property (nonatomic, strong, nonnull) NSArray<Offer, Optional> *offer;
@property (nonatomic, strong, nullable) Offer<Optional> *close;
//@property (nonatomic, strong, nullable) NSString<Optional> *settlement;
@property (nonatomic) CGFloat openPrice;
//@property (nonatomic, strong, nullable) NSString<Optional> *openInterest;


@end
