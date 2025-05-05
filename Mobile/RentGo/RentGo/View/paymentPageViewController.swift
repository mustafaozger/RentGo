//
//  paymentPageViewController.swift
//  RentGo
//
//  Created by Eray İnal on 24.04.2025.
//

import UIKit

class paymentPageViewController: UIViewController {
    
    
    @IBOutlet weak var totalAmountLabel: UILabel!
    @IBOutlet weak var nameSurnameTextField: UITextField!
    @IBOutlet weak var cardNumberTextField: UITextField!
    @IBOutlet weak var expiryDateTextField: UITextField!
    @IBOutlet weak var cvvTextField: UITextField!
    
    var totalAmount: String?
    

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        totalAmountLabel.text = totalAmount ?? "$0.00"
    }
    
    @IBAction func payNowTapped(_ sender: Any) {
        
    }
    
    
    

}
