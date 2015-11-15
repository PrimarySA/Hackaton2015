//
//  InstrumentDataViewController.swift
//  
//
//  Created by Emiliano Bivachi on 14/11/15.
//
//

import UIKit

class InstrumentDataViewController: UIViewController {
    
    private let instrument: Instrument

    @IBOutlet private weak var sellButton: UIButton!
    @IBOutlet private weak var buyButton: UIButton!
    @IBOutlet private weak var oneWeekButton: UIButton!
    @IBOutlet private weak var oneMonthButton: UIButton!
    @IBOutlet private weak var sixMonthButton: UIButton!
    @IBOutlet private weak var oneYearButton: UIButton!
    @IBOutlet private weak var graphView: GraphView!
    @IBOutlet private weak var priceLabel: UILabel!
    @IBOutlet private weak var symbolLabel: UILabel!
    @IBOutlet private weak var returnLabel: UILabel!
    @IBOutlet private weak var backButton: UIButton!
    
    private weak var selectedButton: UIButton! {
        didSet {
            selectedButton.selected = true
            selectedButton.backgroundColor = color
            oldValue?.selected = false
            oldValue?.backgroundColor = UIColor.clearColor()
            instrument.getDataSince(Double(selectedButton.tag), completionBlock: { [weak self] instrument, data in
                if let color = self?.priceColor(data) {
                    self?.setupColors(color)
                }
                if let returns = self?.returnFromData(data) {
                    self?.returnLabel.text = String(format: "%.2f%%", arguments: [returns])
                } else {
                    self?.returnLabel.text = ""
                }
                self?.graphView.data = data
                })
        }
    }
    
    init(instrument: Instrument) {
        self.instrument = instrument
        super.init(nibName: "InstrumentDataViewController", bundle: nil)
    }

    required init(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    var color: UIColor = Styler.Color.greenColor
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        symbolLabel.text = instrument.symbol
        
        graphView.shouldShowNoDataLabel = true
        setupColors(Styler.Color.greenColor)
        
        priceLabel.text = instrument.lastPriceText()
        
        sellButton.backgroundColor = Styler.Color.redColor
        buyButton.backgroundColor = Styler.Color.greenColor
        
        selectedButton = oneWeekButton
        
        edgesForExtendedLayout = .None
        
        navigationController?.setNavigationBarHidden(true, animated: true)
    }
    
    func setupColors(selectedColor: UIColor) {
        oneWeekButton.setTitleColor(UIColor.whiteColor(), forState: .Selected)
        oneMonthButton.setTitleColor(UIColor.whiteColor(), forState: .Selected)
        oneYearButton.setTitleColor(UIColor.whiteColor(), forState: .Selected)
        sixMonthButton.setTitleColor(UIColor.whiteColor(), forState: .Selected)
        
        oneWeekButton.setTitleColor(selectedColor, forState: .Normal)
        oneMonthButton.setTitleColor(selectedColor, forState: .Normal)
        oneYearButton.setTitleColor(selectedColor, forState: .Normal)
        sixMonthButton.setTitleColor(selectedColor, forState: .Normal)
        
        backButton.setTitleColor(UIColor.whiteColor(), forState: .Normal)
        backButton.backgroundColor = selectedColor
        
        selectedButton?.backgroundColor = selectedColor
        
        returnLabel.textColor = selectedColor
        
        graphView.color = selectedColor
        
        color = selectedColor
    }
    
    func returnFromData(data: [CGFloat]) -> CGFloat? {
        var last = data.first
        var open = data.last
        if let last = last, open = open {
            return 100 * (last-open)/open
        } else {
            return .None
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
    
    @IBAction func backButtonTapped(sender: UIButton) {
        navigationController?.popViewControllerAnimated(true)
    }
    
    @IBAction func buyButtonTapped(sender: UIButton) {
        navigationController?.pushViewController(MakeOrderViewController(instrument: instrument, side: "BUY"), animated: true)        
    }
    
    @IBAction func sellButtonTapped(sender: UIButton) {
        navigationController?.pushViewController(MakeOrderViewController(instrument: instrument, side: "SELL"), animated: true)
    }
    
    @IBAction func periodButtonTapped(sender: UIButton) {
        if selectedButton != sender {
            selectedButton = sender
        }
    }
}
