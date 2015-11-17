//
//  Instrument.h
//  
//
//  Created by Emiliano Bivachi on 14/11/15.
//
//

#import "Model.h"
#import "MarketData.h"

@protocol Instrument

@end

@interface Instrument : Model

@property (nonatomic, strong, nonnull) NSString *marketId;
@property (nonatomic, strong, nonnull) NSString *symbol;

@property (nonatomic, strong, nullable) MarketData<Optional> *marketData;
@property (nonatomic, strong, nullable) NSArray<Optional> *todayReturnsData;
@property (nonatomic, strong, nullable) NSArray<Optional> *todayData;

@end
