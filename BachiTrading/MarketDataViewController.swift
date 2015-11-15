//
//  MarketDataViewController.swift
//  BachiTrading
//
//  Created by Emiliano Bivachi on 14/11/15.
//  Copyright (c) 2015 Emiliano Bivachi. All rights reserved.
//

import UIKit

class MarketDataViewController: UIViewController {
    
    private var instruments: [Instrument]? {
        didSet {
            tableView.reloadData()
        }
    }
    
    @IBOutlet private weak var tableView: UITableView!
    
    init() {
        super.init(nibName: "MarketDataViewController", bundle: nil)
    }

    required init(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func viewDidLoad() {
        
        super.viewDidLoad()
        tableView.registerClass(InstrumentCell().classForCoder, forCellReuseIdentifier: InstrumentCell.identifier())
        tableView.registerNib(InstrumentCell.cellNib(), forCellReuseIdentifier: InstrumentCell.identifier())
        title = "Stocker"
        
        navigationItem.rightBarButtonItem = UIBarButtonItem(barButtonSystemItem: UIBarButtonSystemItem.Bookmarks, target: self, action: "openOrders")
        navigationItem.rightBarButtonItem?.tintColor = Styler.Color.greenColor
        
        HistoricalDataStore.sharedInstance().getAllHistoricalInstrumentsWithCompletionBlock { [weak self] (instrumentsResponse, error) in
            if let instrumentsResponse = instrumentsResponse as? InstrumentsResponse,
                let instruments = instrumentsResponse.instruments as? [Instrument], let weakSelf = self {
                    weakSelf.instruments = instruments.filter { element in
                        return !(element.symbol.componentsSeparatedByString(" ").count > 1) && element.symbol.rangeOfString("15", options: NSStringCompareOptions.LiteralSearch) == .None
                    }
            } else {
                // Handle error
            }
        }
    }
    
    override func viewWillAppear(animated: Bool) {
        navigationController?.setNavigationBarHidden(false, animated: true)
    }
    
    func openOrders() {
        let vc = OrdersViewController()
        navigationController?.pushViewController(vc, animated: true)
    }
}

extension MarketDataViewController: UITableViewDelegate, UITableViewDataSource {
    
    //TableView Delegate and Datasource
    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {
        tableView.deselectRowAtIndexPath(indexPath, animated: true)
        if let instruments = self.instruments {
            let instrumentVC = InstrumentDataViewController(instrument: instruments[indexPath.row])
            navigationController?.pushViewController(instrumentVC, animated: true)
        }
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return instruments?.count ?? 0
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier(InstrumentCell.identifier(), forIndexPath: indexPath) as! InstrumentCell
        if let instruments = self.instruments {
            cell.instrument = instruments[indexPath.row]
        }
        return cell
    }
    
    func tableView(tableView: UITableView, heightForRowAtIndexPath indexPath: NSIndexPath) -> CGFloat {
        return InstrumentCell.cellHeight()
    }
    
    func tableView(tableView: UITableView, heightForFooterInSection section: Int) -> CGFloat {
        return 0.01
    }

}

