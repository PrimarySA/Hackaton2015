//
//  MakeOrderViewController.swift
//  
//
//  Created by Emiliano Bivachi on 14/11/15.
//
//

import UIKit

class MakeOrderViewController: UIViewController {

    @IBOutlet weak var quantityLabel: UILabel!
    @IBOutlet weak var symbolLabel: UILabel!
    @IBOutlet weak var firstQtyButton: UIButton!
    @IBOutlet weak var secondQtyButton: UIButton!
    @IBOutlet weak var thirdQtyButton: UIButton!
    @IBOutlet weak var otherQtyButton: UIButton!
    @IBOutlet weak var firstPriceButton: UIButton!
    @IBOutlet weak var secondPriceButton: UIButton!
    @IBOutlet weak var thirdPriceButton: UIButton!
    @IBOutlet weak var otherPriceButton: UIButton!
    @IBOutlet weak var cancelButton: UIButton!
    @IBOutlet weak var orderButton: UIButton!
    
    private let instrument: Instrument
    private let side: String
    
    private weak var priceSelectedButton: UIButton? {
        didSet {
            priceSelectedButton?.selected = true
            priceSelectedButton?.backgroundColor = Styler.Color.blueColor
            oldValue?.selected = false
            oldValue?.backgroundColor = UIColor.clearColor()
        }
    }
    
    private weak var qtySelectedButton: UIButton? {
        didSet {
            qtySelectedButton?.selected = true
            qtySelectedButton?.backgroundColor = Styler.Color.blueColor
            oldValue?.selected = false
            oldValue?.backgroundColor = UIColor.clearColor()
        }
    }
    private var suggestedPrice: [CGFloat]
    private var suggestedQty: [Int]
    
    init(instrument: Instrument, side: String) {
        self.instrument = instrument
        self.side = side
        let lastPrice: CGFloat = 2//instrument.marketData!.last.price
        self.suggestedPrice = [lastPrice * 0.995, lastPrice, lastPrice * 1.005]
        self.suggestedQty = [10, 100, 1000]
        super.init(nibName: "MakeOrderViewController", bundle: nil)
    }

    required init(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
                
        if side == "SELL" {
            orderButton.setTitle("Vender", forState: .Normal)
            quantityLabel.text = "Cuantas acciones desea vender?"
        }
        symbolLabel.text = instrument.symbol
        
        priceSelectedButton = firstPriceButton
        qtySelectedButton = firstQtyButton
        
        setupColors(Styler.Color.blueColor)
        
        firstPriceButton.setTitle(String(format: "%.2f", arguments: [suggestedPrice[0]]), forState: .Normal)
        secondPriceButton.setTitle(String(format: "%.2f", arguments: [suggestedPrice[1]]), forState: .Normal)
        thirdPriceButton.setTitle(String(format: "%.2f", arguments: [suggestedPrice[2]]), forState: .Normal)
        
        firstQtyButton.setTitle(String(format: "%i", arguments: [suggestedQty[0]]), forState: .Normal)
        secondQtyButton.setTitle(String(format: "%i", arguments: [suggestedQty[1]]), forState: .Normal)
        thirdQtyButton.setTitle(String(format: "%i", arguments: [suggestedQty[2]]), forState: .Normal)
    }
    
    func setupColors(selectedColor: UIColor) {
        firstQtyButton.setTitleColor(UIColor.whiteColor(), forState: .Selected)
        secondQtyButton.setTitleColor(UIColor.whiteColor(), forState: .Selected)
        thirdQtyButton.setTitleColor(UIColor.whiteColor(), forState: .Selected)
        otherQtyButton.setTitleColor(UIColor.whiteColor(), forState: .Selected)
        firstPriceButton.setTitleColor(UIColor.whiteColor(), forState: .Selected)
        secondPriceButton.setTitleColor(UIColor.whiteColor(), forState: .Selected)
        thirdPriceButton.setTitleColor(UIColor.whiteColor(), forState: .Selected)
        otherPriceButton.setTitleColor(UIColor.whiteColor(), forState: .Selected)
        
        firstQtyButton.setTitleColor(selectedColor, forState: .Normal)
        secondQtyButton.setTitleColor(selectedColor, forState: .Normal)
        thirdQtyButton.setTitleColor(selectedColor, forState: .Normal)
        otherQtyButton.setTitleColor(selectedColor, forState: .Normal)
        firstPriceButton.setTitleColor(selectedColor, forState: .Normal)
        secondPriceButton.setTitleColor(selectedColor, forState: .Normal)
        thirdPriceButton.setTitleColor(selectedColor, forState: .Normal)
        otherPriceButton.setTitleColor(selectedColor, forState: .Normal)
        
        cancelButton.backgroundColor = Styler.Color.grayColor
        orderButton.backgroundColor = Styler.Color.blueColor
    }
    
    @IBAction func qtyButtonTapped(sender: UIButton) {
        if qtySelectedButton != sender {
            qtySelectedButton = sender
        }
    }
    
    @IBAction func priceButtonTapped(sender: UIButton) {
        if priceSelectedButton != sender {
            priceSelectedButton = sender
        }
    }
    
    @IBAction func cancelButtonTapped(sender: UIButton) {
        navigationController?.popViewControllerAnimated(true)
    }
    
    @IBAction func orderButtonTapped(sender: UIButton) {
        let order = Order()
        order.price = suggestedPrice[priceSelectedButton!.tag]
        order.orderQty = suggestedQty[qtySelectedButton!.tag]
        order.instrument = instrument
        order.side = side
        order.timeInForce = "DAY"
        order.ordType = "LIMIT"
        order.accountId = "20"
        MMProgressHUD.showWithTitle("Cargando orden...")
        OrderStore.sharedInstance().creatNewSingleOrder(order, withCompletionBlock: { [weak self] (orderResponse, error) -> Void in
            MMProgressHUD.dismissWithSuccess("La orden se ha cargado con éxito")
            self?.navigationController?.popViewControllerAnimated(true)
        })
    }
}
