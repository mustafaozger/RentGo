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

        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(signUpLAbelTapped))
        signUpLabel.addGestureRecognizer(tapGesture)
        signUpLabel.isUserInteractionEnabled = true
        
        
    }
    
    @IBAction func signInTapped(_ sender: Any) {
    }
    
    
    @objc func signUpLAbelTapped() {
        performSegue(withIdentifier: "toSignUpPage", sender: nil)
    }
    
    
    

}
