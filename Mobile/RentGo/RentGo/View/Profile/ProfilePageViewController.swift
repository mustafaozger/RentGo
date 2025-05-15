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

class ProfilePageViewController: UIViewController {
    
    @IBOutlet weak var tableView: UITableView!
    
    let options: [ProfileOption] = [
        ProfileOption(title: "My Rentals", iconName: "doc.text"),      // Kiraladıklarım
        ProfileOption(title: "Change Password", iconName: "lock"),     // Şifre Değiştirme
        ProfileOption(title: "My Campaigns", iconName: "tag"),         // Kampanyalarım
        ProfileOption(title: "Log Out", iconName: "arrow.right.square") // Çıkış Yap
    ]
    
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view.
        
        tableView.dataSource = self
        tableView.delegate = self
        
        tableView.tableFooterView = UIView()  // Extra boşlukları kapatır
    }
    
    
    /*
    @IBAction func signOutTapped(_ sender: Any) {
        // Storyboard'dan giriş ekranını (SignInViewController) oluştur
        let storyboard = UIStoryboard(name: "Main", bundle: nil)
        let loginVC = storyboard.instantiateViewController(withIdentifier: "toSignInPageFromProfile")
        
        if let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
           let sceneDelegate = windowScene.delegate as? SceneDelegate,
           let window = sceneDelegate.window {
            
            window.rootViewController = loginVC
            window.makeKeyAndVisible()
        }
    }
    */
    
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
        case "My Campaigns":
            print("Navigate to Campaigns")
        default:
            break
        }
    }
}

