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
        
        print("Sepetteki ürünler: \(BasketManager.shared.basketProducts)")
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

        cell.onRentalDurationChanged = { [weak self] newDuration in
            BasketManager.shared.basketProducts[indexPath.row].rentalDuration = newDuration
            self?.productsTableView.reloadData()
            self?.calculateTotal()
        }

        cell.onDeliveryChanged = { [weak self] newType in
            guard let self = self else { return }
            var product = BasketManager.shared.basketProducts[indexPath.row]

            if let existingIndex = BasketManager.shared.basketProducts.firstIndex(where: {
                $0.name == product.name && $0.deliveryType == newType && $0.id != product.id
            }) {
                BasketManager.shared.basketProducts[existingIndex].rentalDuration += product.rentalDuration
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
    
    
    func fetchCartItems() {
        let cartId = "7502bbd9-adbc-4717-90b4-08dd8d9336fe" // kullanıcıya özel çekilmeli
        guard let url = URL(string: "https://localhost:9001/api/v1/Cart/\(cartId)") else { return }
        
        let request = URLRequest(url: url)
        let session = BasketNetworkManager.shared.createSecureSession()
        
        session.dataTask(with: request) { data, response, error in
            if let error = error {
                print("Sepet getirme hatası:", error)
                return
            }
            guard let data = data else { return }
            do {
                let decoded = try JSONDecoder().decode(CartResponse.self, from: data)
                print("Sepet verisi geldi:", decoded)
                // TODO: BasketManager.shared.basketProducts = ...
            } catch {
                print("Decode hatası:", error)
            }
        }.resume()
    }

    struct CartResponse: Codable {
        let cartId: String
        let items: [CartItem]
    }

    struct CartItem: Codable {
        let productId: String
        let rentalPeriodType: String
        let rentalDuration: Int
    }
    

    

}
