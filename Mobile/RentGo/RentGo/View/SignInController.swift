//
//  SignInController.swift
//  RentGo
//
//  Created by Eray İnal on 25.03.2025.
//

import UIKit

class SignInController: UIViewController, URLSessionDelegate {
    
    @IBOutlet weak var logoImageView: UIImageView!
    @IBOutlet weak var emailTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!
    
    
    @IBOutlet weak var forgotPasswordLabel: UILabel!
    @IBOutlet weak var signUpLabel: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        logoImageView.layer.cornerRadius = 20
        
        let tapGestureSignUp = UITapGestureRecognizer(target: self, action: #selector(signUpLabelTapped))
        signUpLabel.addGestureRecognizer(tapGestureSignUp)
        signUpLabel.isUserInteractionEnabled = true
        
        let tapGestureForgotPassword = UITapGestureRecognizer(target: self, action: #selector(forgotPasswordTapped))
        forgotPasswordLabel.addGestureRecognizer(tapGestureForgotPassword)
        forgotPasswordLabel.isUserInteractionEnabled = true
        
        
    }
    
    @IBAction func signInTapped(_ sender: Any) {
        
        guard let email = emailTextField.text, let password = passwordTextField.text,
              !email.isEmpty, !password.isEmpty else {
            makeAlert(title: "ERROR", message: "Please complete all fields!")
            return
        }
        
        if !email.contains("@") {
            makeAlert(title: "ERROR", message: "Invalid email format!")
            return
        }
        
        let loginRequest = LoginRequest(email: email, password: password)
        
        AuthService.shared.signIn(request: loginRequest) { result in
            DispatchQueue.main.async {
                switch result {
                case .success(let response):
                    
                    // ✅ E-posta onaylı değilse kullanıcıyı uyar
                    if !response.isVerified {
                        let confirmationMessage = """
                        Your email address is not verified.
                        
                        Please open the following confirmation link in Safari and confirm your account:
                        
                        https://localhost:9001/api/account/confirm-email
                        """
                        
                        let alert = UIAlertController(
                            title: "Email Confirmation Required",
                            message: confirmationMessage,
                            preferredStyle: .alert
                        )
                        
                        alert.addAction(UIAlertAction(title: "Open Link in Safari", style: .default, handler: { _ in
                            if let url = URL(string: "https://localhost:9001/api/account/confirm-email") {
                                UIApplication.shared.open(url)
                            }
                        }))
                        
                        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel))
                        
                        self.present(alert, animated: true)
                        return
                    }
                    
                    // ✅ Onaylıysa işlemlere devam et
                    print("Token: \(response.jwToken)")
                    print("UserId: \(response.id)")
                    print("CartId: \(response.cartId)")
                    print("Admin ID: \(UserDefaults.standard.string(forKey: "adminId") ?? "nil")")
                    
                    UserDefaults.standard.set(response.jwToken, forKey: "accessToken")
                    UserDefaults.standard.set(response.id, forKey: "userId")        // ✅ userId kaydet
                    UserDefaults.standard.set(response.cartId, forKey: "cartId")    // ✅ cartId kaydet
                    
                    if response.roles.contains("Admin") {
                        UserDefaults.standard.set(response.id, forKey: "adminId")
                        self.performSegue(withIdentifier: "toAdminPageFromSignIn", sender: nil)
                    } else {
                        self.performSegue(withIdentifier: "fromSignInToHomeVC", sender: nil)
                    }
                    
                case .failure(let error):
                    self.makeAlert(title: "Login Failed", message: error.localizedDescription)
                }
            }
        }
    }
    
    
    @objc func forgotPasswordTapped() {
        //performSegue(withIdentifier: "", sender: nil)
    }
    @objc func signUpLabelTapped() {
        performSegue(withIdentifier: "toSignUpPage", sender: nil)
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
