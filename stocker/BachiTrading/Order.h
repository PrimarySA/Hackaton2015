//
//  Order.h
//  
//
//  Created by Emiliano Bivachi on 14/11/15.
//
//

#import "Model.h"
#import "Instrument.h"

@protocol Order

@end

@interface Order : Model

@property (nonatomic, strong, nonnull) NSString *clOrdId;
@property (nonatomic, strong, nonnull) NSString *accountId;
@property (nonatomic, strong, nonnull) NSString *proprietary;
@property (nonatomic, strong, nonnull) Instrument *instrument;
@property (nonatomic) CGFloat price;
@property (nonatomic) NSInteger orderQty;
//@property (nonatomic) NSInteger leavesQty;
@property (nonatomic, strong, nonnull) NSString <Optional> *ordType;
@property (nonatomic, strong, nonnull) NSString *side;
@property (nonatomic, strong, nonnull) NSString *timeInForce;
@property (nonatomic, strong, nonnull) NSString <Optional> *transactTime;
@property (nonatomic, strong, nonnull) NSString <Optional> *status;
@property (nonatomic, strong, nonnull) NSString <Optional> *text;
@property (nonatomic, strong, nonnull) NSString <Optional> *clientId;

@end
