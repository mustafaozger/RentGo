//
//  AdminDetailedProductPageViewController.swift
//  RentGo
//
//  Created by Eray İnal on 7.05.2025.
//

import UIKit

class AdminDetailedProductPageViewController: UIViewController {
    
    @IBOutlet weak var productImageView: UIImageView!
    @IBOutlet weak var productTitleLabel: UILabel!
    @IBOutlet weak var statusLabel: UILabel!
    @IBOutlet weak var usernameLabel: UILabel!
    @IBOutlet weak var phoneNumberLabel: UILabel!
    @IBOutlet weak var AddressLabel: UILabel!
    @IBOutlet weak var startLabel: UILabel!
    @IBOutlet weak var endLabel: UILabel!
    
    var orderId: String!

    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        
        fetchOrderDetails()
    }
    
    
    func fetchOrderDetails() {
            guard let url = URL(string: "https://localhost:9001/api/v1/Order/get-order:\(orderId!)") else { return }

            URLSession.shared.dataTask(with: url) { data, response, error in
                if let error = error {
                    print("❌", error)
                    return
                }

                guard let data = data else { return }

                do {
                    let orderDetail = try JSONDecoder().decode(OrderResponse.self, from: data)

                    DispatchQueue.main.async {
                        self.populateUI(orderDetail)
                    }
                } catch {
                    print("❌ Decoding error", error)
                }
            }.resume()
        }

        func populateUI(_ order: OrderResponse) {
            guard let product = order.rentalProducts.first else { return }

            productTitleLabel.text = product.productName
            statusLabel.text = order.orderStatus
            usernameLabel.text = "Unknown"  // müşteri null geliyor
            phoneNumberLabel.text = "Unknown"
            AddressLabel.text = "Unknown"
            startLabel.text = String(product.startRentTime.prefix(10))
            endLabel.text = String(product.endRentTime.prefix(10))

            if let url = URL(string: product.productImageList.first?.imageUrl ?? "") {
                URLSession.shared.dataTask(with: url) { data, _, _ in
                    if let data = data {
                        DispatchQueue.main.async {
                            self.productImageView.image = UIImage(data: data)
                        }
                    }
                }.resume()
            }
        }
    

    

}
