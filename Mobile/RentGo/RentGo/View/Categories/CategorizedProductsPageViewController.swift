//
//  CategorizedProductsPageViewController.swift
//  RentGo
//
//  Created by Eray İnal on 8.05.2025.
//

import UIKit

class CategorizedProductsPageViewController: UIViewController {
    
    @IBOutlet weak var tableView: UITableView!
    
    var selectedCategory: Category?
    var products: [CategorizedProduct] = []
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view.
        
        tableView.delegate = self
        tableView.dataSource = self
        
        fetchProducts(for: selectedCategory?.name ?? "")
        
    }
    
    func fetchProducts(for categoryName: String) {
        guard let url = URL(string: "https://localhost:9001/api/v1/Category/filter-by-category?categoryName=\(categoryName.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed) ?? "")&pageNumber=1&pageSize=10") else {
            return
        }
        
        let session = URLSession(configuration: .default, delegate: SelfSignedSSLDelegate(), delegateQueue: nil)
        
        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        
        let task = session.dataTask(with: request) { data, response, error in
            if let error = error {
                print("Request error: \(error)")
                return
            }
            
            guard let data = data else {
                print("No data received.")
                return
            }
            
            do {
                let decoded = try JSONDecoder().decode(CategoryResponse.self, from: data)
                self.products = decoded.data
                
                DispatchQueue.main.async {
                    self.tableView.reloadData()
                }
            } catch {
                print("Decoding error: \(error)")
            }
        }
        task.resume()
    }
}


    




extension CategorizedProductsPageViewController: UITableViewDelegate, UITableViewDataSource {

    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return products.count
    }

    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let cell = tableView.dequeueReusableCell(withIdentifier: "CategorizedProductsPageTableViewCell", for: indexPath) as? CategorizedProductsPageTableViewCell else {
            return UITableViewCell()
        }

        let product = products[indexPath.row]
        cell.productTitleLabel.text = product.name
        cell.productDescriptionLabel.text = product.description
        cell.productPriceLabel.text = "$\(product.pricePerMonth ?? 0)/Monthly"

        if let imageUrlString = product.productImageList.first?.imageUrl,
           let imageUrl = URL(string: imageUrlString) {
            URLSession.shared.dataTask(with: imageUrl) { data, response, error in
                guard let data = data, error == nil else { return }
                DispatchQueue.main.async {
                    cell.productImageView.image = UIImage(data: data)
                }
            }.resume()
        } else {
            cell.productImageView.image = UIImage(named: "placeholder")
        }

        return cell
    }
}


struct CategoryResponse: Decodable {
    let pageNumber: Int
    let pageSize: Int
    let data: [CategorizedProduct]
}



class SelfSignedSSLDelegate: NSObject, URLSessionDelegate {
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
