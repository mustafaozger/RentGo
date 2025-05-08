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
        
        // Admin kullanıcı için sign up kapatma
        if emailTextField.text == "admin@example.com" {
            makeAlert(title: "Error", message: "Admin cannot register.")
        }
        
    }
    
    
    @IBAction func signUpTapped(_ sender: Any) {
        guard let name = nameTextField.text,
              let surname = surnameTextField.text,
              let email = emailTextField.text,
              let password = passwordTextField.text,
              let confirmPassword = passwordAgainTextField.text,
              !name.isEmpty, !surname.isEmpty, !email.isEmpty, !password.isEmpty, !confirmPassword.isEmpty else {
            makeAlert(title: "Error", message: "Please fill all fields")
            return
        }
        
        if password != confirmPassword {
            makeAlert(title: "Error", message: "Passwords do not match")
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
                case .success(let responseString):
                    self.showConfirmationLinkAlert(with: responseString)
                case .failure(let error):
                    self.makeAlert(title: "Sign Up Failed", message: error.localizedDescription)
                }
            }
        }
    }
    
    
    func showConfirmationLinkAlert(with message: String) {
        print("Gelen response: \(message)") // ✅ 1. Response logla
        
        let regex = try! NSRegularExpression(pattern: "https?://[\\w\\-._~:/?#\\[\\]@!$&'()*+,;=%]+") // ✅ 2. Daha güçlü regex
        let range = NSRange(location: 0, length: message.utf16.count)
        let match = regex.firstMatch(in: message, options: [], range: range)
        var link = "Check email for link."

        if let matchRange = match?.range,
           let swiftRange = Range(matchRange, in: message) {
            link = String(message[swiftRange])
        } else {
            print("⚠️ Uyarı: Regex eşleşmedi, link bulunamadı.")
        }

        let alert = UIAlertController(
            title: "Confirm Your Account",
            message: "Please confirm your account using the following link:\n\n\(link)",
            preferredStyle: .alert
        )

        alert.addAction(UIAlertAction(title: "Copy Link", style: .default, handler: { _ in
            UIPasteboard.general.string = link
            print("📋 Kopyalanan link: \(link)")
        }))

        alert.addAction(UIAlertAction(title: "Open Link", style: .default, handler: { _ in
            if let url = URL(string: link), link != "Check email for link." {
                UIApplication.shared.open(url)
            }
        }))

        alert.addAction(UIAlertAction(title: "Done", style: .cancel, handler: {
            _ in self.performSegue(withIdentifier: "fromSignupToHomeVC", sender: nil)
        }))

        self.present(alert, animated: true)
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
    func urlSession(_ session: URLSession, didReceive challenge: URLAuthenticationChallenge,
                    completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void) {
        guard let trust = challenge.protectionSpace.serverTrust else {
            completionHandler(.cancelAuthenticationChallenge, nil)
            return
        }
        let credential = URLCredential(trust: trust)
        completionHandler(.useCredential, credential)
    }
    
    
    
}
