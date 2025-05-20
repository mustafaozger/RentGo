//
//  AdminMainPageViewController.swift
//  RentGo
//
//  Created by Eray İnal on 7.05.2025.
//

import UIKit

struct Customer: Codable {
    let id: String
    let name: String
    let userName: String
    let email: String
}

struct RentInfo: Codable {
    let reciverName: String
    let reciverPhone: String
    let reciverAddress: String
}

struct OrderResponse: Codable {
    let orderId: String
    let customerId: String?
    let totalCost: Double
    let orderStatus: String
    let rentInfoID: String?
    let rentalProducts: [RentalProduct]
    let orderDate: String
    
    let customer: Customer?        // ✅ EKLE
    let rentInfo: RentInfo?        // ✅ EKLE
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
    
    
    var allOrders: [OrderResponse] = []
    var displayedRentalProducts: [RentalProduct] = []
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        backgroundImage1.layer.cornerRadius = 10
        backgroundImage2.layer.cornerRadius = 10
        backgroundImage3.layer.cornerRadius = 10
        productsTableView.layer.cornerRadius = 10
        
        
        productsTableView.delegate = self
        productsTableView.dataSource = self
        
        fetchPendingOrderProducts()
        fetchAllOrdersAndUpdateStats()
    }
    
    // 🟣 Pending siparişlerdeki ürünleri getir + TotalOrders = pendingOrders.count
    func fetchPendingOrderProducts() {
        guard let url = URL(string: "https://localhost:9001/api/v1/Order/get-order-status:Pending") else { return }
        
        URLSession(configuration: .default, delegate: self, delegateQueue: nil)
            .dataTask(with: url) { data, response, error in
                if let error = error {
                    print("❌", error)
                    return
                }
                
                guard let data = data else { return }
                
                do {
                    let pendingOrders = try JSONDecoder().decode([OrderResponse].self, from: data)
                    
                    DispatchQueue.main.async {
                        self.displayedRentalProducts = pendingOrders.flatMap { $0.rentalProducts }
                        print("📦 Pending ürün sayısı:", self.displayedRentalProducts.count)
                        
                        // ✅ Pending sipariş sayısını göster
                        self.totalOrderPcsLabel.text = "\(pendingOrders.count)"
                        self.productsTableView.reloadData()
                    }
                } catch {
                    print("❌ Pending Decoding error", error)
                }
            }.resume()
    }
    
    // 🟢 Tüm siparişlerden toplam ürün ve toplam satış verilerini hesapla
    func fetchAllOrdersAndUpdateStats() {
        guard let url = URL(string: "https://localhost:9001/api/v1/Order/get-all-orders") else { return }
        
        URLSession(configuration: .default, delegate: self, delegateQueue: nil)
            .dataTask(with: url) { data, response, error in
                if let error = error {
                    print("❌", error)
                    return
                }
                
                guard let data = data else { return }
                
                do {
                    let allFetchedOrders = try JSONDecoder().decode([OrderResponse].self, from: data)
                    
                    DispatchQueue.main.async {
                        self.allOrders = allFetchedOrders.sorted { $0.orderDate > $1.orderDate }
                        
                        // ✅ Total Sell
                        let totalSell = self.allOrders.reduce(0.0) { $0 + $1.totalCost }
                        self.totalSellLAbel.text = "$\(totalSell)"
                        
                        // ✅ Total Product (tüm siparişlerdeki ürünlerin toplamı)
                        let totalProductCount = self.allOrders.flatMap { $0.rentalProducts }.count
                        self.totalProductCountLabel.text = "\(totalProductCount)"
                    }
                } catch {
                    print("❌ All Orders Decoding error", error)
                }
            }.resume()
    }
    
    // ➡️ Detay sayfasına yönlendirme
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "toAdminDetailedPageFromMain",
           let destinationVC = segue.destination as? AdminDetailedProductPageViewController,
           let selectedProduct = sender as? RentalProduct {

            if let parentOrder = allOrders.first(where: { $0.rentalProducts.contains(where: { $0.rentalItemId == selectedProduct.rentalItemId }) }) {
                destinationVC.order = parentOrder               // ✅ Zaten vardı
                destinationVC.orderId = parentOrder.orderId     // 🆕 Bunu EKLİYORSUN
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
