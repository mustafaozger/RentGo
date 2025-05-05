//
//  SignUpController.swift
//  RentGo
//
//  Created by Eray İnal on 25.03.2025.
//

import UIKit

class SignUpController: UIViewController, UITextFieldDelegate, URLSessionDelegate {
    
    
    
    @IBOutlet weak var logoImageView: UIImageView!
    @IBOutlet weak var nameTextField: UITextField!
    @IBOutlet weak var surnameTextField: UITextField!
    @IBOutlet weak var usernameTextField: UITextField!
    @IBOutlet weak var phoneNumberTextField: UITextField!
    @IBOutlet weak var emailTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!
    @IBOutlet weak var passwordAgainTextField: UITextField!
    
    @IBOutlet weak var signInLabel: UILabel!
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        logoImageView.layer.cornerRadius = 20
        
        let session = URLSession(configuration: .default, delegate: self, delegateQueue: nil)
        
        phoneNumberTextField.delegate = self
        phoneNumberTextField.keyboardType = .numberPad

        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(signInLabelTapped))
        signInLabel.addGestureRecognizer(tapGesture)
        signInLabel.isUserInteractionEnabled = true
        
    }
    
    
    @IBAction func signUpTapped(_ sender: Any) {
        guard let name = nameTextField.text,
                  let surname = surnameTextField.text,
                  let email = emailTextField.text,
                  let password = passwordTextField.text,
                  let confirmPassword = passwordAgainTextField.text,
                  let phone = phoneNumberTextField.text,
                  !name.isEmpty, !surname.isEmpty, !email.isEmpty,
                  !password.isEmpty, !confirmPassword.isEmpty, !phone.isEmpty else {
                makeAlert(title: "ERROR", message: "Please complete all fields!")
                return
            }

            if password != confirmPassword {
                makeAlert(title: "ERROR", message: "Passwords don't match")
                return
            }

            let req = RegisterRequest(
                firstName: name,
                lastName: surname,
                email: email,
                userName: email,
                password: password,
                confirmPassword: confirmPassword
            )

            AuthService.shared.signUp(request: req) { result in
                DispatchQueue.main.async {
                    switch result {
                    case .success:
                        self.performSegue(withIdentifier: "fromSignupToHomeVC", sender: nil)
                    case .failure(let error):
                        self.makeAlert(title: "Sign Up Failed", message: error.localizedDescription)
                    }
                }
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


    
    // Sertifika doğrulamasını geçici olarak devre dışı bırakma
    func urlSession(_ session: URLSession, didReceive challenge: URLAuthenticationChallenge, completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void) {
        let trust = challenge.protectionSpace.serverTrust!
        let credential = URLCredential(trust: trust)
        completionHandler(.useCredential, credential)
    }
    
    

}
