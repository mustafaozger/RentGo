//
//  AllProductsPageViewController.swift
//  RentGo
//
//  Created by Eray İnal on 24.04.2025.
//

import UIKit

class AllProductsPageViewController: UIViewController, URLSessionDelegate {
    
    @IBOutlet weak var allProductsTableView: UITableView!
    
    
    var products: [Product] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view.
        allProductsTableView.delegate = self
        allProductsTableView.dataSource = self
        fetchProducts()
    }
    
    
    
    func fetchProducts() {
        guard let url = URL(string: "https://localhost:9001/api/v1/Product") else { return }

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
                    self.allProductsTableView.reloadData()
                }
            } catch {
                print("Decoding error:", error)
            }
        }.resume()
    }
    
    func urlSession(_ session: URLSession, didReceive challenge: URLAuthenticationChallenge,
                    completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void) {
        let trust = challenge.protectionSpace.serverTrust!
        let credential = URLCredential(trust: trust)
        completionHandler(.useCredential, credential)
    }
    
    
}


extension AllProductsPageViewController: UITableViewDelegate, UITableViewDataSource {
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return products.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let cell = tableView.dequeueReusableCell(withIdentifier: "allProductsCell", for: indexPath) as? AllProductsPageTableViewCell else {
            return UITableViewCell()
        }
        
        let product = products[indexPath.row]
        cell.productNameLabel.text = product.name
        cell.productPriceLabel.text = "$\(product.pricePerMonth)/month"
        cell.descriptionLabel?.text = product.description
        
        if let imageUrl = product.productImageList.first?.imageUrl {
            cell.productImageView.loadImage(from: imageUrl)
        }
        
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let selectedProduct = products[indexPath.row]
        performSegue(withIdentifier: "toDetailedPageFromAllProducts", sender: selectedProduct)
    }
    
    
    
    
    
    
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "toDetailedPageFromAllProducts",
           let selectedProduct = sender as? Product,
           let destinationVC = segue.destination as? DetailedProductsPageViewController {
            destinationVC.product = selectedProduct
        }
    }
}

    


