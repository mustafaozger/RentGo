//
//  SignUpController.swift
//  RentGo
//
//  Created by Eray İnal on 25.03.2025.
//

import UIKit

class SignUpController: UIViewController {
    
    @IBOutlet weak var nameTextField: UITextField!
    @IBOutlet weak var emailTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!
    @IBOutlet weak var passwordAgainTextField: UITextField!
    
    @IBOutlet weak var signInLabel: UILabel!
    
    override func viewDidLoad() {
        super.viewDidLoad()

        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(signInLabelTapped))
        signInLabel.addGestureRecognizer(tapGesture)
        signInLabel.isUserInteractionEnabled = true
        
    }
    
    @IBAction func signUpTapped(_ sender: Any) {
        if(nameTextField.text != "" && emailTextField.text != "" && passwordTextField.text != "" && passwordAgainTextField.text != ""){
            performSegue(withIdentifier: "fromSignupToHomeVC", sender: nil)
            
        } else{
            makeAlert(title: "ERROR", message: "Fill every field!")
        }
    }
    
    @objc func signInLabelTapped(){
        performSegue(withIdentifier: "toLoginPageFromSignup", sender: nil)
    }
    
    
    

}
