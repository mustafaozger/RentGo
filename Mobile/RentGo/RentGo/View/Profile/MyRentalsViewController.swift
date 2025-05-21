//
//  MyRentalsViewController.swift
//  RentGo
//
//  Created by Eray İnal on 13.05.2025.
//

import UIKit
import Foundation

struct MyOrderResponse: Codable {
    let orderId: String
    let customerId: String
    let totalCost: Double
    let orderStatus: String
    let rentalProducts: [MyRentalProduct]
    let orderDate: String
}

struct MyRentalProduct: Codable {
    let rentalItemId: String
    let productId: String
    let productName: String
    let description: String
    let pricePerMonth: Double
    let pricePerWeek: Double
    let rentalDuration: Int
    let rentalPeriodType: String
    let startRentTime: String
    let endRentTime: String
    let totalPrice: Double
    let productImageList: [MyProductImage]
}

struct MyProductImage: Codable {
    let imageUrl: String
}


class MyRentalsViewController: UIViewController, UITableViewDelegate, UITableViewDataSource  {
    
    @IBOutlet weak var tableView: UITableView!
    
    var rentalProducts: [MyRentalProduct] = []
    
    var refreshTimer: Timer?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view.
        tableView.delegate = self
        tableView.dataSource = self
        fetchMyRentals()
    }
    
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        
        fetchMyRentals()
        
        refreshTimer = Timer.scheduledTimer(withTimeInterval: 20.0, repeats: true) { [weak self] _ in
            self?.fetchMyRentals()
        }
    }
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        refreshTimer?.invalidate()
    }
    deinit {
        refreshTimer?.invalidate()
    }
    
    
    
    
    func fetchMyRentals() {
            guard let customerId = AuthService.shared.currentAuthResponse?.id else {
                print("❌ Customer ID not found")
                return
            }
            
            guard let url = URL(string: "https://localhost:9001/api/v1/Order/get-orders-by-customer-id:\(customerId)") else {
                print("❌ Invalid URL")
                return
            }

            var request = URLRequest(url: url)
            request.httpMethod = "GET"
            request.addValue("*/*", forHTTPHeaderField: "accept")
            
            let session = URLSession(configuration: .default, delegate: AuthService.shared, delegateQueue: nil)
            
            session.dataTask(with: request) { data, response, error in
                if let error = error {
                    print("❌ Network error: \(error.localizedDescription)")
                    return
                }
                
                guard let data = data else {
                    print("❌ No data received")
                    return
                }
                
                do {
                    let order = try JSONDecoder().decode(MyOrderResponse.self, from: data)
                    self.rentalProducts = order.rentalProducts
                    
                    DispatchQueue.main.async {
                        self.tableView.reloadData()
                    }
                } catch {
                    print("❌ JSON decode error: \(error)")
                }
            }.resume()
        }
        
        // MARK: - TableView Methods
        
        func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
            return rentalProducts.count
        }
        
        func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
            guard let cell = tableView.dequeueReusableCell(withIdentifier: "MyRentalsTableViewCell", for: indexPath) as? MyRentalsTableViewCell else {
                return UITableViewCell()
            }

            let rental = rentalProducts[indexPath.row]
            cell.productTitleLabel.text = rental.productName
            cell.productDescriptionLabel.text = rental.description
            cell.productPriceLabel.text = "$\(rental.totalPrice)"

            if let imageUrl = rental.productImageList.first?.imageUrl,
               let url = URL(string: imageUrl) {
                DispatchQueue.global().async {
                    if let data = try? Data(contentsOf: url) {
                        DispatchQueue.main.async {
                            cell.productImageView.image = UIImage(data: data)
                        }
                    }
                }
            } else {
                cell.productImageView.image = UIImage(systemName: "photo")
            }

            return cell
        }
    
    
    
}
