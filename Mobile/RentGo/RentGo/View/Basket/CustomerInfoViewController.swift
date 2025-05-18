//
//  CustomerInfoViewController.swift
//  RentGo
//
//  Created by Eray İnal on 18.05.2025.
//

import UIKit

class CustomerInfoViewController: UIViewController, UITextFieldDelegate {
    
    @IBOutlet weak var nameLabel: UITextField!
    @IBOutlet weak var phoneLabel: UITextField!
    @IBOutlet weak var addressLabel: UITextField!
    

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        phoneLabel.delegate = self
    }
    
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "toPaymentPageFromCustInfo",
           let destinationVC = segue.destination as? paymentPageViewController {
            
            let subtotal = BasketManager.shared.basketProducts.reduce(0) { $0 + $1.totalPrice }
            let shipping = 0.00
            let total = subtotal + shipping
            
            destinationVC.totalAmount = String(format: "$%.2f", total)
        }
    }
    
    
    @IBAction func continueTapped(_ sender: Any) {
        // Alanların boş olup olmadığını kontrol et
        guard let name = nameLabel.text, !name.isEmpty,
              let phone = phoneLabel.text, !phone.isEmpty,
              let address = addressLabel.text, !address.isEmpty else {
            
            let alert = UIAlertController(title: "Missing Information",
                                          message: "Please fill in all the fields before continuing.",
                                          preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default))
            present(alert, animated: true)
            return
        }
        
        // Verileri UserDefaults ile sakla
        UserDefaults.standard.set(name, forKey: "receiverName")
        UserDefaults.standard.set(phone, forKey: "receiverPhone")
        UserDefaults.standard.set(address, forKey: "receiverAddress")
        
        performSegue(withIdentifier: "toPaymentPageFromCustInfo", sender: nil)
    }
    
    
    
    
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        
        guard textField == phoneLabel else { return true }
        if let text = textField.text, range.location == 0 && text.hasPrefix("+") && string.isEmpty {
            return false
        }
        let currentText = textField.text ?? ""
        let newText = (currentText as NSString).replacingCharacters(in: range, with: string)
        let digits = newText.replacingOccurrences(of: "\\D", with: "", options: .regularExpression)
        
        if digits.count > 12 {
            return false
        }
        
        var formatted = "+"
        for (index, char) in digits.enumerated() {
            switch index {
            case 0...1:
                formatted += String(char)
            case 2:
                formatted += " (" + String(char)
            case 3, 4:
                formatted += String(char)
            case 5:
                formatted += ") " + String(char)
            case 6, 7:
                formatted += String(char)
            case 8:
                formatted += " " + String(char)
            case 9, 10, 11:
                formatted += String(char)
            default:
                break
            }
        }
        textField.text = formatted
        return false
    }
    
    
}
