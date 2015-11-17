//
//  HistoricalDataStore.h
//  
//
//  Created by Emiliano Bivachi on 14/11/15.
//
//

#import "BaseStore.h"
#import "Response.h"
#import "Instrument.h"

@interface HistoricalDataStore : BaseStore

+ (HistoricalDataStore *) sharedInstance;

- (void)getAllHistoricalInstrumentsWithCompletionBlock:(void (^)(Response *, NSError *))completionBlock;
- (void)getHistoricalMarketDataForInstrument:(Instrument *)instrument
                                     between:(NSDate *)startDate
                                         and:(NSDate *)endDate
                         withCompletionBlock:(void (^)(Response *, NSError *))completionBlock;
- (void)getHistoricalMarketDataForInstrument:(Instrument *)instrument
                                     forDate:(NSDate *)date
                         withCompletionBlock:(void (^)(Response *, NSError *))completionBlock;

@end
