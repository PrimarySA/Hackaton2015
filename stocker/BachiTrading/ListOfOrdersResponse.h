//
//  ListOfOrdersResponse.h
//  
//
//  Created by Emiliano Bivachi on 15/11/15.
//
//

#import "Response.h"
#import "Order.h"

@interface ListOfOrdersResponse : Response

@property (nonatomic, strong, nonnull) NSArray<Order> *orders;

@end
