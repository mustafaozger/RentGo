//
//  HomePageController.swift
//  RentGo
//
//  Created by Eray İnal on 26.03.2025.
//

import UIKit

class HomePageController: UIViewController {

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
    }
    

    @IBAction func signOutTapped(_ sender: Any) {
        performSegue(withIdentifier: "toSignInPageFromMain", sender: nil)
    }
    

}
