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
    
    
    
    
    
    
    override func viewDidLoad() {
        super.viewDidLoad()

        productsTableView.delegate = self
        productsTableView.dataSource = self
        
        productsTableView.reloadData()
        calculateTotal()
        
        summaryImageView.layer.cornerRadius = 12
        //summaryImageView.clipsToBounds = true
        
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        productsTableView.reloadData()
        calculateTotal()
    }
    
    
    @IBAction func continueTapped(_ sender: Any) {
        performSegue(withIdentifier: "showPaymentPage", sender: nil)
    }
    
    
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return BasketManager.shared.basketProducts.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        
        guard let cell = tableView.dequeueReusableCell(withIdentifier: "BasketProductCell", for: indexPath) as? BasketProductsTableViewCell else {
            return UITableViewCell()
        }
        
        let product = BasketManager.shared.basketProducts[indexPath.row]
        cell.configure(with: product)
        
        cell.onDelete = { [weak self] in
            BasketManager.shared.basketProducts.remove(at: indexPath.row)
            self?.productsTableView.reloadData()
            self?.calculateTotal()
        }
        
        cell.onCountChanged = { [weak self] newCount in
            BasketManager.shared.basketProducts[indexPath.row].count = newCount
            self?.productsTableView.reloadData()
            self?.calculateTotal()
        }
        
        cell.onDeliveryChanged = { [weak self] newType in
            guard let self = self else { return }
            var product = BasketManager.shared.basketProducts[indexPath.row]
            
            if let existingIndex = BasketManager.shared.basketProducts.firstIndex(where: {
                $0.name == product.name && $0.deliveryType == newType && $0.id != product.id
            }) {
                BasketManager.shared.basketProducts[existingIndex].count += product.count
                BasketManager.shared.basketProducts.remove(at: indexPath.row)
                
                let indexPaths = [IndexPath(row: existingIndex, section: 0), indexPath]
                self.productsTableView.reloadRows(at: indexPaths, with: .none)
            } else {
                product.deliveryType = newType
                BasketManager.shared.basketProducts[indexPath.row] = product
                
                self.productsTableView.reloadRows(at: [indexPath], with: .none)
            }
            
            self.calculateTotal()
        }
        
        return cell
    }
    
    func tableView(_ tableView: UITableView,
                   trailingSwipeActionsConfigurationForRowAt indexPath: IndexPath)
    -> UISwipeActionsConfiguration? {
        
        let deleteAction = UIContextualAction(style:.destructive, title: "Remove") { [weak self] (action, view, completionHandler) in
            BasketManager.shared.basketProducts.remove(at: indexPath.row)
            self?.productsTableView.deleteRows(at: [indexPath], with: .automatic)
            self?.calculateTotal()
            completionHandler(true)
        }
        
        deleteAction.backgroundColor = .systemRed
        let configuration = UISwipeActionsConfiguration(actions: [deleteAction])
        return configuration
    }
    
    
    func calculateTotal() {
        let subtotal = BasketManager.shared.basketProducts.reduce(0) { $0 + $1.totalPrice }
        let shipping = 4.99
        let total = subtotal + shipping
        
        subtotalLabel.text = String(format: "$%.2f", subtotal)
        totalLabel.text = String(format: "$%.2f", total)
    }
    
    
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "showPaymentPage" {
            if let destinationVC = segue.destination as? paymentPageViewController {
                destinationVC.totalAmount = totalLabel.text ?? "$0.00"
            }
        }
    }
    
    
    

    

}
