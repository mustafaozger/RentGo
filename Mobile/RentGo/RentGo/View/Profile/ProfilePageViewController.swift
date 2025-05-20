//
//  ProfilePageViewController.swift
//  RentGo
//
//  Created by Eray İnal on 24.04.2025.
//

import UIKit

struct ProfileOption {
    let title: String
    let iconName: String
}


/*
struct CustomerDetailResponse: Codable {
    let id: String
    let name: String
    let userName: String
    let email: String
}
 */



class ProfilePageViewController: UIViewController {
    
    @IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var customerNameLabel: UILabel!
    
    let options: [ProfileOption] = [
        ProfileOption(title: "My Rentals", iconName: "doc.text"), // Kiraladıklarım
        ProfileOption(title: "Profile Information", iconName: "person.text.rectangle"),
        ProfileOption(title: "Change Password", iconName: "lock"),
        ProfileOption(title: "Log Out", iconName: "arrow.right.square")
    ]
    
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view.
        
        tableView.dataSource = self
        tableView.delegate = self
        
        tableView.tableFooterView = UIView()
        
        loadCustomerName()
    }
    
    
    private func loadCustomerName() {
        guard let userId = AuthService.shared.currentAuthResponse?.id else {
            print("❌ Kullanıcı ID'si bulunamadı.")
            return
        }

        guard let url = URL(string: "https://localhost:9001/api/Account/GetCustomerDetail?id=\(userId)") else {
            print("❌ URL oluşturulamadı.")
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")

        let session = URLSession(configuration: .default, delegate: AuthService.shared, delegateQueue: nil)

        session.dataTask(with: request) { data, response, error in
            if let error = error {
                print("❌ API hatası: \(error.localizedDescription)")
                return
            }

            guard let data = data else {
                print("❌ Veri gelmedi.")
                return
            }

            do {
                let customer = try JSONDecoder().decode(CustomerDetailResponse.self, from: data)
                DispatchQueue.main.async {
                    self.customerNameLabel.text = customer.name
                }
            } catch {
                print("❌ Decode hatası: \(error.localizedDescription)")
            }

        }.resume()
    }
    
    private func navigateToLogin() {
        let storyboard = UIStoryboard(name: "Main", bundle: nil)
        let loginVC = storyboard.instantiateViewController(withIdentifier: "toSignInPageFromProfile")
        
        if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
           let sceneDelegate = windowScene.delegate as? SceneDelegate,
           let window = sceneDelegate.window {
            
            window.rootViewController = loginVC
            window.makeKeyAndVisible()
        }
    }
    
    
}


extension ProfilePageViewController: UITableViewDataSource, UITableViewDelegate {
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return options.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let cell = tableView.dequeueReusableCell(withIdentifier: "ProfilePageTableViewCell", for: indexPath) as? ProfilePageTableViewCell else {
            return UITableViewCell()
        }
        
        let option = options[indexPath.row]
        cell.optionsNameLabel.text = option.title
        cell.optionsImageView.image = UIImage(systemName: option.iconName)
        
        // Log Out hücresi için kırmızı ve bold yapalım:
        if option.title == "Log Out" {
            cell.optionsNameLabel.textColor = .systemRed
            cell.optionsNameLabel.font = UIFont.boldSystemFont(ofSize: 17)
        } else {
            // Diğerleri normal görünsün
            cell.optionsNameLabel.textColor = .label
            cell.optionsNameLabel.font = UIFont.systemFont(ofSize: 16)
        }
        
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        
        let selectedOption = options[indexPath.row].title
        
        switch selectedOption {
        case "Log Out":
            navigateToLogin()
        case "My Rentals":
            performSegue(withIdentifier: "toMyRentalsFromProfile", sender: nil)
        case "Change Password":
            performSegue(withIdentifier: "toChangePasswordFromProfile", sender: nil)
        case "Profile Information":
            performSegue(withIdentifier: "toCustomerInformationFromProfile", sender: nil)
        default:
            break
        }
    }
}

