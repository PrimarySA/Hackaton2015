//
//  Instruments+DataGetters.swift
//  BachiTrading
//
//  Created by Emiliano Bivachi on 15/11/15.
//  Copyright (c) 2015 Emiliano Bivachi. All rights reserved.
//

import Foundation

extension Instrument {
    
    func lastPriceText() -> String {
        if let marketData = self.marketData {
            return "$ \(marketData.last.price)"
        } else {
            return "--"
        }
    }
    
    func priceColor() -> UIColor {
        var color = Styler.Color.greenColor
        var last = marketData?.last.price
        var open = marketData?.openPrice
        if let last = last, open = open where (last-open)/open < 0 {
            color = Styler.Color.redColor
        }
        return color
    }
    
    func getMarketDataWithCompletionBlock(completionBlock: (Instrument, NSError?)->()) {
        MarketDataStore.sharedInstance().getMarketDataForInstrument(self, withCompletionBlock: { [weak self] (marketDataResponse, error) in
            if let weakSelf = self {
                if let marketDataResponse = marketDataResponse as? MarketDataResponse {
                    weakSelf.marketData = marketDataResponse.marketData
                }
                completionBlock(weakSelf, error)
            }
        })
    }
    
    func getDataSince(daysAgo: Double, completionBlock: (Instrument, [CGFloat])->()) {
        HistoricalDataStore().getHistoricalMarketDataForInstrument(self,
            between: NSDate(timeIntervalSinceNow: -daysAgo*24*60*60),
            and: NSDate(timeIntervalSinceNow: -24*60*60),
            withCompletionBlock: { [weak self] (historicalPriceResponse, error) -> Void in
                if let historicalPriceResponse = historicalPriceResponse as? HistoricalMarketDataResponse,
                    let weakSelf = self {
                        let data = historicalPriceResponse.marketDataH.map { $0 as? Offer }.map { $0!.price }
                        completionBlock(weakSelf, data)
                }
            })
    }
}