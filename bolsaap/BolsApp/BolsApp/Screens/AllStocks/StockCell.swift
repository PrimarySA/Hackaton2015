//
//  StockCell.swift
//  BolsApp
//
//  Created by Christopher Amato on 11/15/15.
//  Copyright © 2015 Christopher Amato. All rights reserved.
//

import UIKit


class Stock {
    
    var cficode = ""
    var marketId = ""
    var symbol = ""
    
    init(json:JSON) {
        cficode = json["cficode"].stringValue
        let instrumentId = json["instrumentId"]
        marketId = instrumentId["marketId"].stringValue
        symbol = instrumentId["symbol"].stringValue
    }
    
}

class StockCell: UITableViewCell {
    
    var stock: Stock!
    
    @IBOutlet var name: UILabel!
    
    func setStock(stock: Stock) {
        self.stock = stock
        name.text = stock.symbol
    }
    
}