//
//  OrderCell.swift
//  
//
//  Created by Emiliano Bivachi on 14/11/15.
//
//

import UIKit

class OrderCell: UITableViewCell {
    
    class func identifier() -> String {
        return "OrderCell"
    }
    
    class func cellNib() -> UINib {
        return UINib(nibName: identifier(), bundle: nil)
    }
    
    class func cellHeight() -> CGFloat {
        return 80
    }
    
    @IBOutlet weak var statusLabel: UILabel!
    @IBOutlet weak var quantityLabel: UILabel!
    @IBOutlet weak var priceLabel: UILabel!
    @IBOutlet weak var symbolLabel: UILabel!
    var order: Order? {
        didSet {
            if let order = self.order {
                symbolLabel.text = order.instrument.symbol
                statusLabel.text = order.status
                quantityLabel.text = "\(order.orderQty)"
                priceLabel.text = String(format: "$%.2f", arguments: [order.price])
            }
        }
    }
}
