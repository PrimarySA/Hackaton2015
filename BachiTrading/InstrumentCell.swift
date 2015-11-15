//
//  InstrumentCell.swift
//  BachiTrading
//
//  Created by Emiliano Bivachi on 14/11/15.
//  Copyright (c) 2015 Emiliano Bivachi. All rights reserved.
//

import UIKit

class InstrumentCell: UITableViewCell {
    
    class func identifier() -> String {
        return "InstrumentCell"
    }
    
    class func cellNib() -> UINib {
        return UINib(nibName: identifier(), bundle: nil)
    }
    
    class func cellHeight() -> CGFloat {
        return 80
    }
    
    @IBOutlet weak var symbolLabel: UILabel!
    @IBOutlet weak var priceLabel: UILabel!
    @IBOutlet weak var graphView: GraphView!
    
    var instrument: Instrument? {
        didSet {
            if let instrument = self.instrument {
                updateColors(Styler.Color.greenColor)
                priceLabel.text = instrument.lastPriceText()
                symbolLabel.text = instrument.symbol
                if let todayData = instrument.todayReturnsData as? [CGFloat] {
                    graphView.data = todayData
                } else {
                    instrument.getDataSince(30, completionBlock: { [weak self] instrument, data in
                        if instrument == self?.instrument, let weakSelf = self { 
                            weakSelf.updateColors(weakSelf.priceColor(data))
                            weakSelf.graphView.data = data
                        }
                        })
                }
            }
        }
    }
    
    func priceColor(data: [CGFloat]) -> UIColor {
        var color = Styler.Color.greenColor
        var last = data.last
        var open = data.first
        if let last = last, open = open where (last-open)/open < 0 {
            color = Styler.Color.redColor
        }
        return color
    }
    
    func updateColors(color: UIColor) {
        symbolLabel.textColor = color
        graphView.color = color
        priceLabel.backgroundColor = color
        priceLabel.textColor = UIColor.whiteColor()
    }
}
