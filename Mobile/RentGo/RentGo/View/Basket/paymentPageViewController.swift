//
//  paymentPageViewController.swift
//  RentGo
//
//  Created by Eray İnal on 24.04.2025.
//

import UIKit

class paymentPageViewController: UIViewController, UITextFieldDelegate {
    
    
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
        
        nameSurnameTextField.delegate = self
        cardNumberTextField.delegate = self
        expiryDateTextField.delegate = self
        cvvTextField.delegate = self
        
        cardNumberTextField.keyboardType = .numberPad
        expiryDateTextField.keyboardType = .numberPad
        cvvTextField.keyboardType = .numberPad
    }
    
    
    
    func submitOrder() {
        guard let cartId = AuthService.shared.currentAuthResponse?.cartId else {
            print("❌ Cart ID not found")
            return
        }

        // CustomerInfoViewController’dan verileri al
        guard let receiverName = UserDefaults.standard.string(forKey: "receiverName"),
              let receiverPhone = UserDefaults.standard.string(forKey: "receiverPhone"),
              let receiverAddress = UserDefaults.standard.string(forKey: "receiverAddress") else {
            print("❌ Customer info eksik")
            return
        }

        let body: [String: Any] = [
            "cartId": cartId,
            "reciverName": receiverName,
            "reciverPhone": receiverPhone,
            "reciverAddress": receiverAddress
        ]

        guard let url = URL(string: "https://localhost:9001/api/v1/Order/confirm"),
              let httpBody = try? JSONSerialization.data(withJSONObject: body, options: []) else {
            print("❌ URL veya body oluşturulamadı")
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = httpBody

        let session = BasketNetworkManager.shared.createSecureSession()

        session.dataTask(with: request) { data, response, error in
            if let error = error {
                print("❌ Order API hatası: \(error.localizedDescription)")
                return
            }

            print("✅ Sipariş başarıyla iletildi.")
            BasketManager.shared.clear()

            DispatchQueue.main.async {
                self.performSegue(withIdentifier: "toDonePageFromPayment", sender: nil)
            }
        }.resume()
    }
    
    
        

    
    @IBAction func payNowTapped(_ sender: Any) {
        guard let name = nameSurnameTextField.text, !name.isEmpty,
              let cardNumber = cardNumberTextField.text?.replacingOccurrences(of: " ", with: ""), cardNumber.count == 16,
              let expiryDate = expiryDateTextField.text, expiryDate.count == 5, expiryDate.contains("/"),
              let cvv = cvvTextField.text, cvv.count == 3 else {
            
            let alert = UIAlertController(title: "Invalid Payment Details",
                                          message: "Please make sure all fields are correctly filled.",
                                          preferredStyle: .alert)
            alert.addAction(UIAlertAction(title: "OK", style: .default))
            present(alert, animated: true)
            return
        }
        
        submitOrder()
    }
    
    
    
    
    
    
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        
        let currentText = textField.text ?? ""
        guard let stringRange = Range(range, in: currentText) else { return false }
        let updatedText = currentText.replacingCharacters(in: stringRange, with: string)
        
        switch textField {
        case nameSurnameTextField:
            let allowedCharacters = CharacterSet.letters.union(.whitespaces)
            return string.rangeOfCharacter(from: allowedCharacters.inverted) == nil
            
            
        case cardNumberTextField:
            let cleaned = updatedText.replacingOccurrences(of: " ", with: "")
            if cleaned.count > 16 || string.rangeOfCharacter(from: CharacterSet.decimalDigits.inverted) != nil {
                return false
            }
            
            let formatted = formatCardNumber(cleaned)
            textField.text = formatted
            return false
            
            
        case expiryDateTextField:
            if string.rangeOfCharacter(from: CharacterSet.decimalDigits.inverted) != nil {
                return false
            }
            
            var cleaned = updatedText.replacingOccurrences(of: "/", with: "")
            if cleaned.count > 4 { return false }
            
            if cleaned.count == 2 {
                if let month = Int(cleaned), month > 12 {
                    cleaned = "12"
                }
            }
            
            var result = ""
            for (index, char) in cleaned.enumerated() {
                if index == 2 {
                    result += "/"
                }
                result.append(char)
            }
            
            textField.text = result
            return false
            
            
        case cvvTextField:
            return updatedText.count <= 3 && string.rangeOfCharacter(from: CharacterSet.decimalDigits.inverted) == nil
            
            
        default:
            return true
        }
    }
    private func formatCardNumber(_ number: String) -> String {
        var result = ""
        for (index, char) in number.enumerated() {
            if index != 0 && index % 4 == 0 {
                result += " "
            }
            result.append(char)
        }
        return result
    }

}
