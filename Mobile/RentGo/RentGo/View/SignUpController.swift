//
//  SignUpController.swift
//  RentGo
//
//  Created by Eray İnal on 25.03.2025.
//

import UIKit

class SignUpController: UIViewController, UITextFieldDelegate {
    
    
    @IBOutlet weak var nameTextField: UITextField!
    @IBOutlet weak var surnameTextField: UITextField!
    @IBOutlet weak var phoneNumberTextField: UITextField!
    @IBOutlet weak var emailTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!
    @IBOutlet weak var passwordAgainTextField: UITextField!
    
    @IBOutlet weak var signInLabel: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        phoneNumberTextField.delegate = self
        phoneNumberTextField.keyboardType = .numberPad

        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(signInLabelTapped))
        signInLabel.addGestureRecognizer(tapGesture)
        signInLabel.isUserInteractionEnabled = true
        
    }
    
    
    @IBAction func signUpTapped(_ sender: Any) {
        if(nameTextField.text != "" && surnameTextField.text != "" && phoneNumberTextField.text != "" && emailTextField.text != "" && passwordTextField.text != "" && passwordAgainTextField.text != ""){
            
            if let email = emailTextField.text, email.contains("@") {
                if phoneNumberTextField.text?.count ?? 0 < 18 {
                    makeAlert(title: "ERROR", message: "Please enter a valid phone number!")
                    return
                } else{
                    if(passwordTextField.text == passwordAgainTextField.text){
                        performSegue(withIdentifier: "fromSignupToHomeVC", sender: nil)
                    }else{
                        makeAlert(title: "ERROR", message: "Passwords don't match")
                    }
                }
                
            } else {
                makeAlert(title: "ERROR", message: "Invalid email format!")
            }
            
        } else{
            makeAlert(title: "ERROR", message: "Please complete all fields!")
        }
    }
    
    @objc func signInLabelTapped(){
        performSegue(withIdentifier: "toLoginPageFromSignup", sender: nil)
    }
    
    
    
    func textField(_ textField: UITextField, shouldChangeCharactersIn range: NSRange, replacementString string: String) -> Bool {
        
        guard textField == phoneNumberTextField else { return true }

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
