//
//  AdminAllProductsViewController.swift
//  RentGo
//
//  Created by Eray İnal on 19.05.2025.
//

import UIKit

class AdminAllProductsViewController: UIViewController, URLSessionDelegate {
    
    @IBOutlet weak var tableView: UITableView!
    
    var allProducts: [RentalProduct] = []
    var allOrders: [OrderResponse] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view.
        
        tableView.delegate = self
        tableView.dataSource = self
        
        fetchAllProducts()
    }
    
    func fetchAllProducts() {
        guard let url = URL(string: "https://localhost:9001/api/v1/Order/get-all-orders") else { return }
        
        URLSession(configuration: .default, delegate: self, delegateQueue: nil)
            .dataTask(with: url) { data, response, error in
                if let error = error {
                    print("❌", error)
                    return
                }
                
                guard let data = data else { return }
                
                do {
                    let orders = try JSONDecoder().decode([OrderResponse].self, from: data)
                    
                    DispatchQueue.main.async {
                        self.allOrders = orders
                        self.allProducts = orders.flatMap { $0.rentalProducts }
                        self.tableView.reloadData()
                        print("📦 All Products Count: \(self.allProducts.count)")
                    }
                } catch {
                    print("❌ Decoding error in All Products:", error)
                }
            }.resume()
    }
    
    
    // ✅ Segue hazırlığı
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "toAdminDetailedPageFromAllProducts",
           let destinationVC = segue.destination as? AdminDetailedProductPageViewController,
           let selectedProduct = sender as? RentalProduct {

            if let parentOrder = allOrders.first(where: { $0.rentalProducts.contains(where: { $0.rentalItemId == selectedProduct.rentalItemId }) }) {
                destinationVC.order = parentOrder               
                destinationVC.orderId = parentOrder.orderId
            }
        }
    }
    
    
    // Sertifika bypass
    func urlSession(_ session: URLSession, didReceive challenge: URLAuthenticationChallenge,
                    completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void) {
        guard let trust = challenge.protectionSpace.serverTrust else {
            completionHandler(.cancelAuthenticationChallenge, nil)
            return
        }
        let credential = URLCredential(trust: trust)
        completionHandler(.useCredential, credential)
    }
    
}





extension AdminAllProductsViewController: UITableViewDelegate, UITableViewDataSource {

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return allProducts.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let cell = tableView.dequeueReusableCell(withIdentifier: "AdminAllProductsTableViewCell", for: indexPath) as? AdminAllProductsTableViewCell else {
            return UITableViewCell()
        }

        let product = allProducts[indexPath.row]
        cell.configure(with: product)
        return cell
    }

    // ✅ Ürün tıklanınca segue başlat
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let selectedProduct = allProducts[indexPath.row]
        performSegue(withIdentifier: "toAdminDetailedPageFromAllProducts", sender: selectedProduct)
    }
}
