//
//  AdminProfileViewController.swift
//  RentGo
//
//  Created by Eray İnal on 8.05.2025.
//

import UIKit

struct AdminProfileOption {
    let title: String
    let iconName: String
}

class AdminProfileViewController: UIViewController {
    
    @IBOutlet weak var tableView: UITableView!
    
    let options: [AdminProfileOption] = [
            AdminProfileOption(title: "Change Password", iconName: "lock"),
            AdminProfileOption(title: "Log Out", iconName: "arrow.right.square")
        ]
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        tableView.dataSource = self
        tableView.delegate = self
        tableView.tableFooterView = UIView() // Extra boşlukları kapatır
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









extension AdminProfileViewController: UITableViewDataSource, UITableViewDelegate {
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return options.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let cell = tableView.dequeueReusableCell(withIdentifier: "AdminProfileTableViewCell", for: indexPath) as? AdminProfileTableViewCell else {
            return UITableViewCell()
        }
        
        let option = options[indexPath.row]
        cell.optionsNameLabel.text = option.title
        cell.optionsImageView.image = UIImage(systemName: option.iconName)
        
        // Log Out için kırmızı
        if option.title == "Log Out" {
            cell.optionsNameLabel.textColor = .systemRed
            cell.optionsNameLabel.font = UIFont.boldSystemFont(ofSize: 17)
        } else {
            cell.optionsNameLabel.textColor = .label
            cell.optionsNameLabel.font = UIFont.systemFont(ofSize: 16)
        }
        
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        tableView.deselectRow(at: indexPath, animated: true)
        
        let selected = options[indexPath.row].title
        
        switch selected {
        case "Log Out":
            navigateToLogin()
        case "Change Password":
            performSegue(withIdentifier: "toAdminChangePasswordFromProfile", sender: nil)
        case "Orders":
            // Henüz eklenmedi ama log atalım
            print()
        default:
            break
        }
    }
}
