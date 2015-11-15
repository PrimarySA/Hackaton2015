//
//  InstrumentsResponse.h
//  
//
//  Created by Emiliano Bivachi on 14/11/15.
//
//

#import "Response.h"
#import "Instrument.h"

@interface InstrumentsResponse : Response

@property (nonatomic, strong, nonnull) NSArray<Instrument> *instruments;

@end
