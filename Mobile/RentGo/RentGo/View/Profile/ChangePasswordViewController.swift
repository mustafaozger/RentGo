//
//  ChangePasswordViewController.swift
//  RentGo
//
//  Created by Eray İnal on 13.05.2025.
//

import UIKit


struct ChangePasswordRequest: Codable {
    let userId: String
    let currentPassword: String
    let newPassword: String
}

class ChangePasswordViewController: UIViewController {
    
    @IBOutlet weak var currentPasswordTextField: UITextField!
    @IBOutlet weak var newPasswordTextField: UITextField!
    @IBOutlet weak var newPasswordAgainTextField: UITextField!
    

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }
    
    @IBAction func changePasswordTapped(_ sender: Any) {
        
        guard let current = currentPasswordTextField.text, !current.isEmpty,
              let newPass = newPasswordTextField.text, !newPass.isEmpty,
              let confirmPass = newPasswordAgainTextField.text, !confirmPass.isEmpty else {
            showAlert(title: "Error", message: "Please fill in all fields.")
            return
        }
        
        guard newPass == confirmPass else {
            showAlert(title: "Error", message: "New passwords do not match.")
            return
        }
        
        guard let userId = UserDefaults.standard.string(forKey: "userId") else {
            showAlert(title: "Error", message: "User ID not found. Please login again.")
            return
        }
        
        let request = ChangePasswordRequest(userId: userId, currentPassword: current, newPassword: newPass)
        
        ChangePasswordService.shared.changePassword(request: request) { result in
            DispatchQueue.main.async {
                switch result {
                case .success(let message):
                    // ✅ Şifre başarıyla değiştiğinde Profile sayfasına geri dön
                    self.showAlert(title: "Success", message: message) {
                        self.navigationController?.popViewController(animated: true)
                    }
                    
                case .failure(let error):
                    self.showAlert(title: "Failed", message: error.localizedDescription)
                }
            }
        }
    }
    
    
    private func showAlert(title: String, message: String, completion: (() -> Void)? = nil) {
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default, handler: { _ in
            completion?()
        }))
        present(alert, animated: true)
    }
    
    

}
