//
//  AdminDetailedProductPageViewController.swift
//  RentGo
//
//  Created by Eray İnal on 7.05.2025.
//

import UIKit

class AdminDetailedProductPageViewController: UIViewController, URLSessionDelegate {
    
    @IBOutlet weak var productImageView: UIImageView!
    @IBOutlet weak var productTitleLabel: UILabel!
    
    @IBOutlet weak var usernameLabel: UILabel!
    @IBOutlet weak var phoneNumberLabel: UILabel!
    @IBOutlet weak var AddressLabel: UILabel!
    @IBOutlet weak var startLabel: UILabel!
    @IBOutlet weak var endLabel: UILabel!
    
    @IBOutlet weak var statusButton: UIButton!
    @IBOutlet weak var saveButton: UIButton!
    
    
    var selectedStatus: String?
    
    
    var orderId: String?
    var order: OrderResponse?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view.
        
        saveButton.isEnabled = false
        
        if let order = order {
            populateUI(order)
        } else if let orderId = orderId {
            fetchOrderById(orderId)
        } else {
            print("❌ Neither order nor orderId is set")
        }
    }
    
    
    
    
    func populateUI(_ order: OrderResponse) {
        guard let product = order.rentalProducts.first else { return }

        productTitleLabel.text = product.productName

        // 🆕 Status Button varsayılanı sipariş durumu ile eşleşsin
        self.statusButton.setTitle(order.orderStatus, for: .normal)
        self.selectedStatus = order.orderStatus

        // ✅ Customer (Kullanıcı Bilgisi)
        if let customer = order.customer {
            usernameLabel.text = customer.userName
        } else {
            usernameLabel.text = "Unknown"
        }

        // ✅ Rent Info (Telefon ve Adres)
        if let rentInfo = order.rentInfo {
            phoneNumberLabel.text = rentInfo.reciverPhone
            AddressLabel.text = rentInfo.reciverAddress
        } else {
            phoneNumberLabel.text = "Unknown"
            AddressLabel.text = "Unknown"
        }

        // ✅ Tarihler
        startLabel.text = String(product.startRentTime.prefix(10))
        endLabel.text = String(product.endRentTime.prefix(10))

        // ✅ Görsel
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
    
    
    @IBAction func statusTapped(_ sender: Any) {
        let alert = UIAlertController(title: "Change Status", message: "Please select order status", preferredStyle: .actionSheet)
        
        let statuses = ["Pending", "Approved", "Delivered"]
        
        for status in statuses {
            alert.addAction(UIAlertAction(title: status, style: .default, handler: { _ in
                self.selectedStatus = status
                self.statusButton.setTitle(status, for: .normal)
                self.saveButton.isEnabled = true
            }))
        }
        
        alert.addAction(UIAlertAction(title: "Cancel", style: .cancel, handler: nil))
        
        // iPad için popover'da çökmesini önle:
        if let popover = alert.popoverPresentationController,
           let button = sender as? UIView {
            popover.sourceView = button
            popover.sourceRect = button.bounds
        }
        
        present(alert, animated: true)
    }
    
    @IBAction func saveButtonTapped(_ sender: Any) {
        print("✅ Save button tapped")
        
        guard let status = selectedStatus else {
            print("⚠️ Status not selected — selectedStatus is nil")
            return
        }
        
        guard let orderId = orderId else {
            print("⚠️ Order ID not found — orderId is nil")
            return
        }
        
        print("📦 Status to be sent: \(status)")
        print("📦 Order ID: \(orderId)")
        
        let urlString = "https://localhost:9001/api/v1/Order/change-order-status-of-order-id:\(orderId)"
        guard let url = URL(string: urlString) else {
            print("❌ Invalid URL")
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.addValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try? JSONEncoder().encode(status)
        
        let session = URLSession(configuration: .default, delegate: self, delegateQueue: nil)
        session.dataTask(with: request) { data, response, error in
            if let error = error {
                print("❌ Error changing status:", error)
                return
            }
            
            if let httpResponse = response as? HTTPURLResponse {
                print("✅ Status code: \(httpResponse.statusCode)")
            }
            
            DispatchQueue.main.async {
                let alert = UIAlertController(title: "Success", message: "Status updated to \(status)", preferredStyle: .alert)
                alert.addAction(UIAlertAction(title: "OK", style: .default, handler: { _ in
                    self.navigationController?.popViewController(animated: true)
                }))
                self.present(alert, animated: true)
            }
        }.resume()
    }
    
    
    func fetchOrderById(_ id: String) {
        let urlString = "https://localhost:9001/api/v1/Order/get-order:\(id)"
        guard let url = URL(string: urlString) else {
            print("❌ Invalid URL")
            return
        }

        let session = URLSession(configuration: .default, delegate: self, delegateQueue: nil)
        session.dataTask(with: url) { data, response, error in
            if let error = error {
                print("❌ Fetch error:", error)
                return
            }

            guard let data = data else {
                print("❌ No data received")
                return
            }

            do {
                let order = try JSONDecoder().decode(OrderResponse.self, from: data)
                DispatchQueue.main.async {
                    self.order = order
                    self.populateUI(order)
                }
            } catch {
                print("❌ Decoding error:", error)
            }
        }.resume()
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
