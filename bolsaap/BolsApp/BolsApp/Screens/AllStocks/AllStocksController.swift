//
//  AllStocksController.swift
//  BolsApp
//
//  Created by Christopher Amato on 11/14/15.
//  Copyright © 2015 Christopher Amato. All rights reserved.
//

import UIKit

class AllStocksController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    
    @IBOutlet var stocksTableView: UITableView!
    
    let stocksURL = "http://demo-api.primary.com.ar:8081/pbcp/rest/instruments/all/"
    
    var stocks = [Stock]()
    
    init() {
        super.init(nibName: "AllStocksController", bundle: nil)
        DataManager.getTopAppsDataFromItunesWithSuccess(stocksURL, success: { (urlData) -> Void in
            let json = JSON(data: urlData)
            
            for instrument in json["instruments"].arrayValue {
                self.stocks.append(Stock(json: instrument))
            }
            
            self.stocksTableView.reloadData()
        })
    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        stocksTableView.registerNib(UINib(nibName: "StockCell", bundle: nil), forCellReuseIdentifier: "StockCellID")
    }
    
    func numberOfSectionsInTableView(tableView: UITableView) -> Int {
        return 1
    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        print(stocks.count)
        return stocks.count
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier("StockCellID") as! StockCell
        
        cell.setStock(stocks[indexPath.item])
        
        return cell
    }

    
}
