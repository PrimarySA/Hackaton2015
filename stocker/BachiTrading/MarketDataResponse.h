//
//  MarketDataResponse.h
//  
//
//  Created by Emiliano Bivachi on 14/11/15.
//
//

#import "Response.h"
#import "MarketData.h"

@interface MarketDataResponse : Response

@property (nonatomic, strong, nonnull) MarketData *marketData;

@end
