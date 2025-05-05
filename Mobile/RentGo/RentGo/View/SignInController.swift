//
//  SignInController.swift
//  RentGo
//
//  Created by Eray İnal on 25.03.2025.
//

import UIKit

class SignInController: UIViewController {
    
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
                        print("Token: \(response.token)")
                        UserDefaults.standard.set(response.token, forKey: "accessToken")
                        self.performSegue(withIdentifier: "fromSignInToHomeVC", sender: nil)
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
    
    
    

}
