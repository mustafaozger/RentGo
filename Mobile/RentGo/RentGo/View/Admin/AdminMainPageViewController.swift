//
//  AdminMainPageViewController.swift
//  RentGo
//
//  Created by Eray İnal on 7.05.2025.
//

import UIKit

class AdminMainPageViewController: UIViewController, URLSessionDelegate {
    
    @IBOutlet weak var backgroundImage1: UIImageView!
    @IBOutlet weak var backgroundImage2: UIImageView!
    @IBOutlet weak var backgroundImage3: UIImageView!
    @IBOutlet weak var productsTableView: UITableView!
    
    var rentedProducts: [Product] = []
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        backgroundImage1.layer.cornerRadius = 10
        backgroundImage2.layer.cornerRadius = 10
        backgroundImage3.layer.cornerRadius = 10
        productsTableView.layer.cornerRadius = 10
        
        
        productsTableView.delegate = self
        productsTableView.dataSource = self
        
        fetchRentedProducts()
    }
    
    func fetchRentedProducts() {
        guard let url = URL(string: "https://localhost:9001/api/v1/Product") else {
            print("❌ Invalid URL")
            return
        }
        
        let session = URLSession(configuration: .default, delegate: self, delegateQueue: nil)
        
        session.dataTask(with: url) { data, response, error in
            if let error = error {
                print("❌ Request error:", error)
                return
            }
            
            guard let data = data else {
                print("❌ No data received")
                return
            }
            
            do {
                let decoded = try JSONDecoder().decode(ProductResponse.self, from: data)
                let sorted = decoded.data.sorted { $0.lastRentalHistory > $1.lastRentalHistory }
                self.rentedProducts = Array(sorted.prefix(3))
                
                DispatchQueue.main.async {
                    self.productsTableView.reloadData()
                }
                
            } catch {
                print("❌ Decoding error:", error)
            }
        }.resume()
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


extension AdminMainPageViewController: UITableViewDataSource, UITableViewDelegate {

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return rentedProducts.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let cell = tableView.dequeueReusableCell(withIdentifier: "adminRentedProducts", for: indexPath) as? AdminMainPageTableViewCell else {
            return UITableViewCell()
        }

        let product = rentedProducts[indexPath.row]
        cell.configure(with: product)
        return cell
    }
}
