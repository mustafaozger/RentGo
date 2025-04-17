//
//  BasketPageViewController.swift
//  RentGo
//
//  Created by Eray İnal on 15.04.2025.
//

import UIKit

class BasketPageViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    
    @IBOutlet weak var productsTableView: UITableView!
    @IBOutlet weak var summaryImageView: UIImageView!
    @IBOutlet weak var subtotalLabel: UILabel!
    @IBOutlet weak var totalLabel: UILabel!
    
    
    
    
    var basketProducts: [BasketProduct] = [
        BasketProduct(id: UUID(), name: "Bycycle", imageName: "bycycle_image", weeklyPrice: 14.99, monthlyPrice: 44.99, deliveryType:.weekly),
        BasketProduct(id: UUID(), name: "Headphones", imageName: "head_image", weeklyPrice: 12.99, monthlyPrice: 39.99, deliveryType:.monthly),
        BasketProduct(id: UUID(), name: "Chair", imageName: "chair_image", weeklyPrice: 29.99, monthlyPrice: 89.99, deliveryType:.monthly),
        BasketProduct(id: UUID(), name: "Playstation 5", imageName: "playstation_image", weeklyPrice: 49.99, monthlyPrice: 179.99, deliveryType:.monthly),
        BasketProduct(id: UUID(), name: "Ski Equipment", imageName: "ski_equipment", weeklyPrice: 9.99, monthlyPrice: 24.99, deliveryType:.weekly),
        
    ]
    
    override func viewDidLoad() {
        super.viewDidLoad()

        productsTableView.delegate = self
        productsTableView.dataSource = self
        
        productsTableView.reloadData()
        calculateTotal()
        
        summaryImageView.layer.cornerRadius = 12
        //summaryImageView.clipsToBounds = true
        
    }
    
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return basketProducts.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        guard let cell = tableView.dequeueReusableCell(withIdentifier: "BasketProductCell", for: indexPath) as? BasketProductsTableViewCell else {
            return UITableViewCell()
        }

        let product = basketProducts[indexPath.row]
        cell.configure(with: product)
                
                // Silme, arttırma vb. işlemler için closure gönder
        cell.onDelete = { [weak self] in
            self?.basketProducts.remove(at: indexPath.row)
            self?.productsTableView.reloadData()
        }

        cell.onCountChanged = { [weak self] newCount in
            self?.basketProducts[indexPath.row].count = newCount
            self?.productsTableView.reloadData()
            self?.calculateTotal()
        }

        cell.onDeliveryChanged = { [weak self] newType in
            self?.basketProducts[indexPath.row].deliveryType = newType
            self?.productsTableView.reloadData()
            self?.calculateTotal()
        }

        return cell
    }
    
    func tableView(_ tableView: UITableView,
                   trailingSwipeActionsConfigurationForRowAt indexPath: IndexPath)
    -> UISwipeActionsConfiguration? {
        
        let deleteAction = UIContextualAction(style:.destructive, title: "Remove") { [weak self] (action, view, completionHandler) in
            self?.basketProducts.remove(at: indexPath.row)
            self?.productsTableView.deleteRows(at: [indexPath], with: .automatic)
            self?.calculateTotal()
            completionHandler(true)
        }

        deleteAction.backgroundColor = .systemRed
        let configuration = UISwipeActionsConfiguration(actions: [deleteAction])
        return configuration
    }
    
    
    func calculateTotal() {
        let subtotal = basketProducts.reduce(0) { $0 + $1.totalPrice }
        let shipping = 4.99
        let total = subtotal + shipping

        
        subtotalLabel.text = String(format: "$%.2f", subtotal)
        totalLabel.text = String(format: "$%.2f", total)
    }
    
    
    
    
    

    

}
