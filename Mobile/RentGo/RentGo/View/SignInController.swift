//
//  SignInController.swift
//  RentGo
//
//  Created by Eray İnal on 25.03.2025.
//

import UIKit

class SignInController: UIViewController {
    
    @IBOutlet weak var emailTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!
    
    @IBOutlet weak var signUpLabel: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(signUpLabelTapped))
        signUpLabel.addGestureRecognizer(tapGesture)
        signUpLabel.isUserInteractionEnabled = true
        
    }
    
    @IBAction func signInTapped(_ sender: Any) {
        if(emailTextField.text != "" && passwordTextField.text != ""){
            performSegue(withIdentifier: "fromSignInToHomeVC", sender: nil)
            
        } else{
            makeAlert(title: "ERROR", message: "Fill every field!")
        }
    }
    
    
    @objc func signUpLabelTapped() {
        performSegue(withIdentifier: "toSignUpPage", sender: nil)
    }
    
    
    

}
