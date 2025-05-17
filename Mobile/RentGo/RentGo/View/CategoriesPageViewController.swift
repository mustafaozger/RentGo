//
//  CategoriesPageViewController.swift
//  RentGo
//
//  Created by Eray İnal on 8.05.2025.
//

import UIKit

class CategoriesPageViewController: UIViewController {
    
    @IBOutlet weak var categoriesTableView: UITableView!
    
    var categories: [Category] = [
        Category(name: "Personal Care", imageName: "personal_care"),
        Category(name: "Hobbies & Games", imageName: "hobbies_games"),
        Category(name: "Smart Home", imageName: "smart_home"),
        Category(name: "Baby & Kids", imageName: "baby_kids"),
        Category(name: "Phones", imageName: "phones")
    ]
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view.
        
        
        
        categoriesTableView.delegate = self
        categoriesTableView.dataSource = self
        categoriesTableView.tableFooterView = UIView() //boş hücreleri gizleme
        
    }
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "toCategorizedProductsFromCategory" {
            if let destinationVC = segue.destination as? CategorizedProductsPageViewController,
               let selectedCategory = sender as? Category {
                destinationVC.selectedCategory = selectedCategory
            }
        }
    }
    
    
}



extension CategoriesPageViewController: UITableViewDelegate, UITableViewDataSource {

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return categories.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let cell = tableView.dequeueReusableCell(withIdentifier: "CategoriesPageTableViewCell", for: indexPath) as? CategoriesPageTableViewCell else {
            return UITableViewCell()
        }

        let category = categories[indexPath.row]
        cell.categoryNameLabel.text = category.name
        cell.categoryImageView.image = UIImage(named: category.imageName)

        return cell
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let selectedCategory = categories[indexPath.row]
        performSegue(withIdentifier: "toCategorizedProductsFromCategory", sender: selectedCategory)
    }
    
    
}
