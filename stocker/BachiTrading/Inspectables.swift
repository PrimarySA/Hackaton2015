//
//  Inspectables.swift
//  BachiTrading
//
//  Created by Emiliano Bivachi on 14/11/15.
//  Copyright (c) 2015 Emiliano Bivachi. All rights reserved.
//

import Foundation

extension UIView {
    @IBInspectable var cornerRadius: CGFloat {
        get {
            return layer.cornerRadius
        }
        set {
            layer.cornerRadius = newValue
            layer.masksToBounds = newValue > 0
        }
    }
    
    @IBInspectable var borderColor: UIColor {
        get {
            return UIColor(CGColor: layer.borderColor!)!
        }
        set {
            layer.borderColor = newValue.CGColor
        }
    }
    
    @IBInspectable var borderWidth: CGFloat {
        get {
            return layer.borderWidth
        }
        set {
            layer.borderWidth = newValue
        }
    }
    
    @IBInspectable var shadowColor: UIColor {
        get {
            return UIColor(CGColor: layer.shadowColor!)!
        }
        set {
            layer.shadowColor = newValue.CGColor
        }
    }
    
    @IBInspectable var shadowOpacity: Float {
        get {
            return layer.shadowOpacity
        }
        set {
            layer.shadowOpacity = newValue
        }
    }
    
    @IBInspectable var shadowRadius: CGFloat {
        get {
            return layer.shadowRadius
        }
        set {
            layer.shadowRadius = newValue
        }
    }
    
    @IBInspectable var shadowWidthOffset: CGFloat {
        get {
            return layer.shadowOffset.width
        }
        set {
            layer.shadowOffset.width = newValue
        }
    }
    
    @IBInspectable var shadowHeightOffset: CGFloat {
        get {
            return layer.shadowOffset.height
        }
        set {
            layer.shadowOffset.height = newValue
        }
    }
    
}

extension UILabel {
    @IBInspectable var localizedText: String? {
        set {
            if newValue != nil && newValue != "" {
                text = NSLocalizedString(newValue!, comment: "")
            }
        }
        get {
            return text
        }
    }
}

extension UIButton {
    @IBInspectable var localizedTitle: String? {
        set {
            if newValue != nil && newValue != "" {
                setTitle(NSLocalizedString(newValue!, comment: ""), forState: .Normal)
            }
        }
        get {
            return titleForState(.Normal)
        }
    }
}

extension UITextField {
    @IBInspectable var localizedTitle: String? {
        set {
            if newValue != nil && newValue != "" {
                placeholder = NSLocalizedString(newValue!, comment: "")
            }
        }
        get {
            return placeholder
        }
    }
}
