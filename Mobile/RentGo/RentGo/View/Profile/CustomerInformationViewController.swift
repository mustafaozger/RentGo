//
//  CustomerInformationViewController.swift
//  RentGo
//
//  Created by Eray İnal on 18.05.2025.
//

import UIKit

/*
struct CustomerDetailResponse: Codable {
    let id: String
    let name: String
    let userName: String
    let email: String
}
 */

class CustomerInformationViewController: UIViewController, UITextFieldDelegate {
    
    @IBOutlet weak var emailTextField: UITextField!
    @IBOutlet weak var nameTextField: UITextField!
    @IBOutlet weak var usernameTextField: UITextField!
    @IBOutlet weak var saveChangesButton: UIButton!
    
    var userId: String?
    var originalEmail: String = ""
    var originalName: String = ""
    var originalUsername: String = ""
    
    var emailSuccess = false
    var nameSuccess = false
    var usernameSuccess = false
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view.
        print("CustomerInformationViewController loaded")
        configureUI()
        loadCustomerDetails()
    }
    
    private func configureUI() {
        saveChangesButton.isEnabled = false
        saveChangesButton.backgroundColor = .systemGray4
        saveChangesButton.layer.cornerRadius = 8
        
        emailTextField.delegate = self
        nameTextField.delegate = self
        usernameTextField.delegate = self
        
        emailTextField.addTarget(self, action: #selector(textFieldChanged), for: .editingChanged)
        nameTextField.addTarget(self, action: #selector(textFieldChanged), for: .editingChanged)
        usernameTextField.addTarget(self, action: #selector(textFieldChanged), for: .editingChanged)
    }
    
    private func loadCustomerDetails() {
        guard let id = AuthService.shared.currentAuthResponse?.id else { return }
        self.userId = id
        
        guard let url = URL(string: "https://localhost:9001/api/Account/GetCustomerDetail?id=\(id)") else { return }
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        
        let session = URLSession(configuration: .default, delegate: AuthService.shared, delegateQueue: nil)
        
        session.dataTask(with: request) { data, response, error in
            if let error = error {
                print("API error: \(error.localizedDescription)")
                return
            }
            
            guard let data = data else {
                print("No data received.")
                return
            }
            
            do {
                let customer = try JSONDecoder().decode(CustomerDetailResponse.self, from: data)
                DispatchQueue.main.async {
                    self.originalEmail = customer.email
                    self.originalName = customer.name
                    self.originalUsername = customer.userName
                    
                    self.emailTextField.text = customer.email
                    self.nameTextField.text = customer.name
                    self.usernameTextField.text = customer.userName
                }
            } catch {
                print("Decode error: \(error.localizedDescription)")
            }
            
        }.resume()
    }
    
    @objc private func textFieldChanged() {
        let emailChanged = emailTextField.text != originalEmail
        let nameChanged = nameTextField.text != originalName
        let usernameChanged = usernameTextField.text != originalUsername
        
        if emailChanged || nameChanged || usernameChanged {
            saveChangesButton.isEnabled = true
            saveChangesButton.backgroundColor = .systemPurple
        } else {
            saveChangesButton.isEnabled = false
            saveChangesButton.backgroundColor = .systemGray4
        }
    }
    
    @IBAction func saveChangesTapped(_ sender: Any) {
        guard let id = userId else { return }
        
        let nameParts = nameTextField.text?.split(separator: " ", maxSplits: 1).map(String.init) ?? ["", ""]
        let firstName = nameParts.first ?? ""
        let lastName = nameParts.count > 1 ? nameParts[1] : ""
        
        var emailSuccess = true
        var nameSuccess = true
        var usernameSuccess = true
        
        let group = DispatchGroup()
        
        // Email
        if emailTextField.text != originalEmail {
            let emailPayload = [
                "userId": id,
                "newEmail": emailTextField.text ?? ""
            ]
            group.enter()
            sendPUTRequest(endpoint: "update-email", body: emailPayload) { success in
                emailSuccess = success
                group.leave()
            }
        }
        
        // Name
        if nameTextField.text != originalName {
            let namePayload = [
                "userId": id,
                "newFirstName": firstName,
                "newLastName": lastName
            ]
            group.enter()
            sendPUTRequest(endpoint: "update-name", body: namePayload) { success in
                nameSuccess = success
                group.leave()
            }
        }
        
        // Username
        if usernameTextField.text != originalUsername {
            let usernamePayload = [
                "userId": id,
                "newUsername": usernameTextField.text ?? ""
            ]
            group.enter()
            sendPUTRequest(endpoint: "update-username", body: usernamePayload) { success in
                usernameSuccess = success
                group.leave()
            }
        }
        
        group.notify(queue: .main) {
            var errorMessages: [String] = []
            if !emailSuccess { errorMessages.append("Email could not be updated.") }
            if !nameSuccess { errorMessages.append("Name could not be updated.") }
            if !usernameSuccess { errorMessages.append("Username update failed.") }
            
            if errorMessages.isEmpty {
                let alert = UIAlertController(title: "Success", message: "Your information has been updated.", preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .default, handler: { _ in
                    self.navigationController?.popViewController(animated: true)
                }))
                self.present(alert, animated: true)
                
                self.saveChangesButton.isEnabled = false
                self.saveChangesButton.backgroundColor = .systemGray4
                self.originalEmail = self.emailTextField.text ?? ""
                self.originalName = self.nameTextField.text ?? ""
                self.originalUsername = self.usernameTextField.text ?? ""
            } else {
                self.showAlert(title: "Error", message: errorMessages.joined(separator: "\n"))
            }
        }
    }
    
    
    private func sendPUTRequest(endpoint: String, body: [String: String], completion: @escaping (Bool) -> Void) {
        guard let url = URL(string: "https://localhost:9001/api/Account/\(endpoint)") else {
            print("[ERROR] Invalid URL for endpoint: \(endpoint)")
            completion(false)
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "PUT"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue("application/json", forHTTPHeaderField: "Accept")
        
        if let token = UserDefaults.standard.string(forKey: "accessToken") {
            request.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        } else {
            //print("Token bulunamadı.")
            completion(false)
            return
        }
        
        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: body, options: [])
        } catch {
            //print("[ERROR] JSON encoding failed for endpoint: \(endpoint)")
            completion(false)
            return
        }
        
        let session = URLSession(configuration: .default, delegate: AuthService.shared, delegateQueue: nil)
        
        session.dataTask(with: request) { data, response, error in
            if let error = error {
                //print("[❌ ERROR] \(endpoint): \(error.localizedDescription)")
                completion(false)
                return
            }
            
            guard let data = data,
                  let responseStr = String(data: data, encoding: .utf8) else {
                //print("[❌ ERROR] \(endpoint): No response data")
                completion(false)
                return
            }
            
            //print("✅ \(endpoint) response: \(responseStr)")
            
            if let httpResponse = response as? HTTPURLResponse,
               (200...299).contains(httpResponse.statusCode),
               responseStr.lowercased().contains("success") {
                completion(true)
            } else {
                completion(false)
            }
        }.resume()
    }
    
    
    private func showAlert(title: String, message: String) {
        let alert = UIAlertController(title: title, message: message, preferredStyle: .alert)
        alert.addAction(UIAlertAction(title: "OK", style: .default))
        present(alert, animated: true)
    }
    
    
}
