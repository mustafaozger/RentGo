//
//  AdminMainPageViewController.swift
//  RentGo
//
//  Created by Eray İnal on 7.05.2025.
//

import UIKit

struct OrderResponse: Codable {
    let orderId: String
    let customerId: String?
    let totalCost: Double
    let orderStatus: String
    let rentInfoID: String?
    let rentalProducts: [RentalProduct]
    let orderDate: String
}

struct RentalProduct: Codable {
    let rentalItemId: String
    let productId: String
    let productName: String
    let description: String
    let pricePerMonth: Double
    let pricePerWeek: Double
    let rentalDuration: Int
    let rentalPeriodType: String
    let productRentalHistories: String
    let startRentTime: String
    let endRentTime: String
    let totalPrice: Double
    let productImageList: [RentalProductImage] // << Burası Değişti
}

struct RentalProductImage: Codable { 
    let imageUrl: String
}



class AdminMainPageViewController: UIViewController, URLSessionDelegate {
    
    @IBOutlet weak var backgroundImage1: UIImageView!
    @IBOutlet weak var backgroundImage2: UIImageView!
    @IBOutlet weak var backgroundImage3: UIImageView!
    @IBOutlet weak var productsTableView: UITableView!
    
    @IBOutlet weak var totalOrderPcsLabel: UILabel!
    @IBOutlet weak var totalSellLAbel: UILabel!
    @IBOutlet weak var totalProductCountLabel: UILabel!
    
    
    var orders: [OrderResponse] = []
    var displayedRentalProducts: [RentalProduct] = []
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        backgroundImage1.layer.cornerRadius = 10
        backgroundImage2.layer.cornerRadius = 10
        backgroundImage3.layer.cornerRadius = 10
        productsTableView.layer.cornerRadius = 10
        
        
        productsTableView.delegate = self
        productsTableView.dataSource = self
        
        fetchOrderData()
    }
    
    func fetchOrderData() {
        guard let url = URL(string: "https://localhost:9001/api/v1/Order/get-all-orders") else { return }

        URLSession(configuration: .default, delegate: self, delegateQueue: nil)
            .dataTask(with: url) { data, response, error in
                if let error = error {
                    print("❌", error)
                    return
                }

                guard let data = data else { return }

                do {
                    let fetchedOrders = try JSONDecoder().decode([OrderResponse].self, from: data)

                    DispatchQueue.main.async {
                        self.orders = fetchedOrders.sorted { $0.orderDate > $1.orderDate }

                        // Burada sadece rentalProducts'ları birleştiriyoruz
                        self.displayedRentalProducts = fetchedOrders.flatMap { $0.rentalProducts }.prefix(3).map { $0 }

                        print("Toplam gösterilecek ürün:", self.displayedRentalProducts.count)

                        self.totalOrderPcsLabel.text = "\(fetchedOrders.count)"
                        let totalSell = fetchedOrders.reduce(0) { $0 + $1.totalCost }
                        self.totalSellLAbel.text = "$\(totalSell)"

                        self.productsTableView.reloadData()
                    }

                } catch {
                    print("❌ Decoding error", error)
                }
            }.resume()
    }
    
    
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "toAdminDetailedPageFromMain",
           let destinationVC = segue.destination as? AdminDetailedProductPageViewController,
           let selectedProduct = sender as? RentalProduct {

            // RentalProduct üzerinden orderId bulup gönderiyoruz
            if let parentOrder = orders.first(where: { $0.rentalProducts.contains(where: { $0.rentalItemId == selectedProduct.rentalItemId }) }) {
                destinationVC.orderId = parentOrder.orderId
            }
        }
    }
    
    
    func urlSession(_ session: URLSession, didReceive challenge: URLAuthenticationChallenge,
                    completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void) {
        if let trust = challenge.protectionSpace.serverTrust {
            let credential = URLCredential(trust: trust)
            completionHandler(.useCredential, credential)
        } else {
            completionHandler(.performDefaultHandling, nil)
        }
    }
    
    
    
}


extension AdminMainPageViewController: UITableViewDelegate, UITableViewDataSource {

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return displayedRentalProducts.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let cell = tableView.dequeueReusableCell(withIdentifier: "adminRentedProducts", for: indexPath) as? AdminMainPageTableViewCell else {
            return UITableViewCell()
        }

        let product = displayedRentalProducts[indexPath.row]
        cell.configure(with: product)

        return cell
    }

    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        performSegue(withIdentifier: "toAdminDetailedPageFromMain", sender: displayedRentalProducts[indexPath.row])
    }
}
