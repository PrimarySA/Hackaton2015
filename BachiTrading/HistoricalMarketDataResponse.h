//
//  HistoricalMarketDataResponse.h
//  
//
//  Created by Emiliano Bivachi on 14/11/15.
//
//

#import "Response.h"
#import "HistoricalOffer.h"

@interface HistoricalMarketDataResponse : Response

@property (nonatomic, strong, nonnull) NSString<Optional> *security;
@property (nonatomic, strong, nonnull) NSArray<HistoricalOffer, Optional> *marketDataH;
@property (nonatomic, strong, nonnull) NSString<Optional> *min;
@property (nonatomic, strong, nonnull) NSString<Optional> *max;
@property (nonatomic, strong, nonnull) NSString<Optional> *open;
@property (nonatomic, strong, nonnull) NSString<Optional> *close;

@end
