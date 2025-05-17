//
//  BasketPageViewController.swift
//  RentGo
//
//  Created by Eray İnal on 15.04.2025.
//

import UIKit

struct CartResponse: Codable {
    let cartId: String
    let customerId: String
    let items: [CartItem]
}

struct CartItem: Codable {
    let cartItemId: String
    let productId: String
    let rentalPeriodType: String
    let rentalDuration: Int
    let product: Product
}

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
        
        fetchCartItems()
        
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
            guard let self = self else { return }

            // 🟥 Backend DELETE API çağrısı
            let cartItemId = BasketManager.shared.basketProducts[indexPath.row].cartItemId
            self.deleteCartItem(cartItemId: cartItemId)

            // 🟩 Localden sil
            BasketManager.shared.basketProducts.remove(at: indexPath.row)
            self.productsTableView.deleteRows(at: [indexPath], with: .automatic)
            self.calculateTotal()
        }

        cell.onRentalDurationChanged = { [weak self] newDuration in
            BasketManager.shared.basketProducts[indexPath.row].rentalDuration = newDuration
            self?.productsTableView.reloadData()
            self?.calculateTotal()
            
            self?.updateCartItem(at: indexPath.row)
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
            self.updateCartItem(at: indexPath.row)
        }
        
        return cell
    }
    
    func tableView(_ tableView: UITableView,
                   trailingSwipeActionsConfigurationForRowAt indexPath: IndexPath)
    -> UISwipeActionsConfiguration? {
        
        let deleteAction = UIContextualAction(style:.destructive, title: "Remove") { [weak self] (action, view, completionHandler) in
            guard let self = self else { return }

            let cartItemId = BasketManager.shared.basketProducts[indexPath.row].cartItemId

            // ✅ Backend'e DELETE çağrısı yap
            self.deleteCartItem(cartItemId: cartItemId)

            // ✅ Local'den ürünü sil
            BasketManager.shared.basketProducts.remove(at: indexPath.row)
            self.productsTableView.deleteRows(at: [indexPath], with: .automatic)
            self.calculateTotal()

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
        guard let cartId = AuthService.shared.currentAuthResponse?.cartId else {
            print("CartId bulunamadı.")
            return
        }
        guard let url = URL(string: "https://localhost:9001/api/v1/Cart/\(cartId)") else { return }

        var request = URLRequest(url: url)
        request.httpMethod = "GET"

        let session = BasketNetworkManager.shared.createSecureSession()

        session.dataTask(with: request) { data, response, error in
            if let error = error {
                print("Sepet getirme hatası: \(error)")
                return
            }

            guard let data = data else { return }

            do {
                let decoded = try JSONDecoder().decode(CartResponse.self, from: data)
                print("Sepet verisi geldi:", decoded)

                BasketManager.shared.basketProducts = decoded.items.map {
                    BasketProduct(
                        id: UUID(),
                        productId: $0.productId,
                        name: $0.product.name,
                        imageName: nil,
                        imageUrl: $0.product.productImageList.first?.imageUrl,
                        rentalDuration: $0.rentalDuration,
                        weeklyPrice: $0.product.pricePerWeek,
                        monthlyPrice: $0.product.pricePerMonth,
                        deliveryType: BasketProduct.DeliveryType(rawValue: $0.rentalPeriodType) ?? .weekly,
                        cartItemId: $0.cartItemId
                    )
                }

                DispatchQueue.main.async {
                    self.productsTableView.reloadData()
                    self.calculateTotal()
                }

            } catch {
                print("Decode hatası:", error)
            }
        }.resume()
    }
    
    
    func updateCartItem(at index: Int) {
        let product = BasketManager.shared.basketProducts[index]

        let body: [String: Any] = [
            "cartItemId": product.cartItemId,
            "rentalPeriodType": product.deliveryType.rawValue,  // ✅ PERIOD TYPE EKLENDİ
            "newRentalDuration": product.rentalDuration,         // ✅ RENTAL DURATION
            "totalPrice": product.totalPrice                    // ✅ TOTAL PRICE EKLENDİ
        ]

        guard let url = URL(string: "https://localhost:9001/api/v1/Cart/update-item"),
              let httpBody = try? JSONSerialization.data(withJSONObject: body, options: []) else { return }

        var request = URLRequest(url: url)
        request.httpMethod = "PUT"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = httpBody

        let session = BasketNetworkManager.shared.createSecureSession()

        session.dataTask(with: request) { data, response, error in
            if let error = error {
                print("CartItem update hatası: \(error.localizedDescription)")
                return
            }
            print("CartItem güncellendi: \(product.cartItemId)")
        }.resume()
    }


    func deleteCartItem(cartItemId: String) {
        let body: [String: Any] = [
            "cartItemId": cartItemId
        ]

        guard let url = URL(string: "https://localhost:9001/api/v1/Cart/remove-item"),
              let httpBody = try? JSONSerialization.data(withJSONObject: body, options: []) else { return }

        var request = URLRequest(url: url)
        request.httpMethod = "DELETE"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = httpBody

        let session = BasketNetworkManager.shared.createSecureSession()

        session.dataTask(with: request) { data, response, error in
            if let error = error {
                print("CartItem silme hatası: \(error.localizedDescription)")
                return
            }

            print("CartItem başarıyla silindi: \(cartItemId)")
        }.resume()
    }
    
    

    

}
