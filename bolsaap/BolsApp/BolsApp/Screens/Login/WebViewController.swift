

import UIKit

class WebViewController: UIViewController {
    
    @IBOutlet var webView: UIWebView!
    @IBOutlet var doneButton: UIButton!
    
    var url: NSURL!
    
    init(urlString: String!) {
        self.url = NSURL(string: urlString)
        super.init(nibName: "WebViewController", bundle: nil)
        if let navController = navigationController {
            self.edgesForExtendedLayout = .None
            navController.navigationBar.translucent = true
        }

    }

    required init?(coder aDecoder: NSCoder) {
        fatalError("init(coder:) has not been implemented")
    
    }
    
    override func viewDidLoad() {
        super.viewDidLoad()
        let request = NSURLRequest(URL: url!)
        webView.loadRequest(request)

    }
        
    override func viewWillAppear(animated: Bool) {
        super.viewWillAppear(animated)

    }
    
    @IBAction func closeTapped() {
        dismissViewControllerAnimated(true, completion: nil)
        presentViewController(AllStocksController(), animated: true, completion: nil)
    }
    
}

extension WebViewController: UIWebViewDelegate {
    
    func webViewDidStartLoad(webView: UIWebView) {
    }

    func webViewDidFinishLoad(webView: UIWebView) {
    }
    
}

