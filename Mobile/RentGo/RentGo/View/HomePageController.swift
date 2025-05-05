//
//  HomePageController.swift
//  RentGo
//
//  Created by Eray İnal on 26.03.2025.
//

import UIKit

class HomePageController: UIViewController {
    
    @IBOutlet weak var seeAll1Label: UILabel!
    

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        let tapGestureSeeAll = UITapGestureRecognizer(target: self, action: #selector(seeAllLabelTapped))
        seeAll1Label.addGestureRecognizer(tapGestureSeeAll)
        seeAll1Label.isUserInteractionEnabled = true
    }
    
    @objc func seeAllLabelTapped() {
        performSegue(withIdentifier: "toAllProductsPageFromHome", sender: nil)
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "toAllProductsPageFromHome" {
            segue.destination.hidesBottomBarWhenPushed = false
        }
    }
    
    
    
    
    

}
