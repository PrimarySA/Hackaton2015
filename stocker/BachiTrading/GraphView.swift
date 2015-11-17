//
//  GraphView.swift
//  BachiTrading
//
//  Created by Emiliano Bivachi on 14/11/15.
//  Copyright (c) 2015 Emiliano Bivachi. All rights reserved.
//

import UIKit

class GraphView: FSLineChart {
    
    var data: [CGFloat]? {
        didSet {
            clearChartData()
            if let data = self.data where data.count > 0 {
                noDataLabel.hidden = true
                calcExtremePoints(data)
                setChartData(data)
            } else if data?.count == 0 && shouldShowNoDataLabel {
                noDataLabel.hidden = false
            }
        }
    }
    var shouldShowNoDataLabel = false
    private var maxPoint: CGFloat = 1
    private var minPoint: CGFloat = -1
    private var noDataLabel = UILabel()
    override var color: UIColor? {
        didSet {
            noDataLabel.textColor = color
        }
    }
    
    override func awakeFromNib() {
        gridStep = 1
        drawInnerGrid = false
        axisLineWidth = 0
        displayDataPoint = false
        animationDuration = 0.0
        fillColor = UIColor.clearColor()
        clipsToBounds = true
        configNoDataLabel()
    }
    
    private func configNoDataLabel() {
        noDataLabel.text = "No hay datos"
        noDataLabel.backgroundColor = UIColor.whiteColor()
        self.addSubview(noDataLabel)
        MiscUtils.addConstraintsToMatchItsSuperView(noDataLabel)
        layoutIfNeeded()
        noDataLabel.hidden = true
    }
    
    private func calcExtremePoints(data: [CGFloat]) {
        var maxPoint = data.first!
        var minPoint = data.first!
        for point in data {
            maxPoint = (point > maxPoint) ? point : maxPoint
            minPoint = (point < minPoint) ? point : minPoint
        }
        if self.maxPoint != 0 && self.minPoint != 0 {
            self.maxPoint = maxPoint
            self.minPoint = minPoint
        } else {
            self.maxPoint = 1.0
            self.minPoint = (-1.0)
        }
    }
    
    func maxVerticalBound() -> CGFloat {
        let delta = abs(maxPoint) - abs(minPoint)
        let point = maxPoint + delta * 0.04
        return (point != 0) ? point : 0.01
    }
    
    func minVerticalBound() -> CGFloat {
        let delta = abs(maxPoint) - abs(minPoint)
        let point = minPoint - delta * 0.05
        return (point != 0) ? point : -0.01
    }
}
