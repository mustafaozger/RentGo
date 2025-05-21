//
//  AdminMyProductsViewController.swift
//  RentGo
//
//  Created by Eray İnal on 20.05.2025.
//

import UIKit

class AdminMyProductsViewController: UIViewController, URLSessionDelegate {
    
    @IBOutlet weak var tableView: UITableView!
    
    var products: [Product] = []
    
    var refreshTimer: Timer?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view.
        
        tableView.delegate = self
        tableView.dataSource = self
        
        fetchProducts()
        
        
    }
    
    
    
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        refreshTimer = Timer.scheduledTimer(withTimeInterval: 20.0, repeats: true) { [weak self] _ in
            self?.fetchProducts()
        }
    }
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        refreshTimer?.invalidate()
    }
    deinit {
        refreshTimer?.invalidate()
    }
    
    
    
    
    
    func fetchProducts() {
        let urlString = "https://localhost:9001/api/v1/Product"  // Tüm ürünleri getir
        
        guard let url = URL(string: urlString) else {
            print("Invalid URL")
            return
        }
        
        let session = URLSession(configuration: .default, delegate: self, delegateQueue: nil)
        
        session.dataTask(with: url) { data, response, error in
            if let error = error {
                print("Request error:", error)
                return
            }
            
            guard let data = data else {
                print("No data received.")
                return
            }
            
            do {
                let decodedResponse = try JSONDecoder().decode(ProductResponse.self, from: data)
                self.products = decodedResponse.data
                DispatchQueue.main.async {
                    self.tableView.reloadData()
                }
            } catch {
                print("Decoding error:", error)
            }
        }.resume()
    }
    
    
    func deleteProduct(with id: String, at indexPath: IndexPath) {
        guard let url = URL(string: "https://localhost:9001/api/v1/Product/\(id)") else {
            print("Invalid DELETE URL")
            return
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = "DELETE"
        request.setValue("*/*", forHTTPHeaderField: "accept") // Swagger'daki gibi
        
        let session = URLSession(configuration: .default, delegate: self, delegateQueue: nil)
        
        session.dataTask(with: request) { data, response, error in
            if let error = error {
                print("Delete request failed:", error)
                return
            }
            
            guard let data = data else {
                print("No data received on delete.")
                return
            }
            
            if let result = try? JSONDecoder().decode(Bool.self, from: data), result == true {
                DispatchQueue.main.async {
                    self.products.remove(at: indexPath.row)
                    self.tableView.deleteRows(at: [indexPath], with: .automatic)
                }
            } else {
                print("Failed to decode delete response or result was false.")
            }
        }.resume()
    }
    
    // SSL için self-signed sertifikalarda gerekli:
    func urlSession(_ session: URLSession, didReceive challenge: URLAuthenticationChallenge,
                    completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void) {
        if let serverTrust = challenge.protectionSpace.serverTrust {
            let credential = URLCredential(trust: serverTrust)
            completionHandler(.useCredential, credential)
        }
    }
    

}






extension AdminMyProductsViewController: UITableViewDelegate, UITableViewDataSource {
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return products.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let cell = tableView.dequeueReusableCell(withIdentifier: "AdminMyProductsTableViewCell", for: indexPath) as? AdminMyProductsTableViewCell else {
            return UITableViewCell()
        }
        
        let product = products[indexPath.row]
        cell.productTitleLabel.text = product.name
        cell.productDescriptionLabel.text = product.description
        cell.productPriceLabel.text = "\(product.pricePerWeek ?? 0)$ / W"
        
        if let imageUrl = product.productImageList.first?.imageUrl {
            cell.productImageView.loadImage(from: imageUrl)
        }
        
        return cell
    }
    
    func tableView(_ tableView: UITableView, trailingSwipeActionsConfigurationForRowAt indexPath: IndexPath) -> UISwipeActionsConfiguration? {
        let deleteAction = UIContextualAction(style: .destructive, title: "Delete") { [weak self] (action, view, completionHandler) in
            guard let self = self else { return }
            let product = self.products[indexPath.row]
            self.deleteProduct(with: product.id, at: indexPath)
            completionHandler(true)
        }
        
        deleteAction.backgroundColor = .systemRed
        let configuration = UISwipeActionsConfiguration(actions: [deleteAction])
        return configuration
    }
}
