//
//  OrdersViewController.swift
//  BachiTrading
//
//  Created by Emiliano Bivachi on 15/11/15.
//  Copyright (c) 2015 Emiliano Bivachi. All rights reserved.
//

import UIKit

class OrdersViewController: UIViewController {
    
    private var orders: [Order]? {
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
        tableView.registerNib(OrderCell.cellNib(), forCellReuseIdentifier: OrderCell.identifier())
        title = "Ordenes"
    
        navigationItem.leftBarButtonItem?.tintColor = Styler.Color.greenColor
        OrderStore.sharedInstance().getOrdersForAccountId("20", withCompletionBlock: { [weak self] (ordersResponse, error) -> Void in
            if let ordersResponse = ordersResponse as? ListOfOrdersResponse,
                let orders = ordersResponse.orders as? [Order],
                let weakSelf = self {
                weakSelf.orders = orders
            }
        })

    }
}

extension OrdersViewController: UITableViewDelegate, UITableViewDataSource {
    
    //TableView Delegate and Datasource
    func tableView(tableView: UITableView, didSelectRowAtIndexPath indexPath: NSIndexPath) {

    }
    
    func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return orders?.count ?? 0
    }
    
    func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCellWithIdentifier(OrderCell.identifier(), forIndexPath: indexPath) as! OrderCell
        if let orders = self.orders {
            cell.order = orders[indexPath.row]
        }
        return cell
    }
    
    func tableView(tableView: UITableView, heightForRowAtIndexPath indexPath: NSIndexPath) -> CGFloat {
        return OrderCell.cellHeight()
    }
    
    func tableView(tableView: UITableView, heightForFooterInSection section: Int) -> CGFloat {
        return 0.01
    }
    
}
