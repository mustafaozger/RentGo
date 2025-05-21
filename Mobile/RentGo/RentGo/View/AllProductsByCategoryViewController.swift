//
//  AllProductsByCategoryViewController.swift
//  RentGo
//
//  Created by Eray İnal on 8.05.2025.
//

import UIKit

class AllProductsByCategoryViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    
    
    @IBOutlet weak var productsTableView: UITableView!
    
    var categoryId: String!
    var products: [Product] = []
    
    var refreshTimer: Timer?
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view.
        productsTableView.delegate = self
        productsTableView.dataSource = self
        
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
        guard let categoryId = categoryId else {
            print("❌ categoryId nil geldi")
            return
        }

        let urlStr = "https://localhost:9001/api/v1/Product?categoryId=\(categoryId)"
        guard let url = URL(string: urlStr) else {
            print("❌ URL oluşturulamadı")
            return
        }

        let session = URLSession(configuration: .default)
        session.dataTask(with: url) { data, _, error in
            if let error = error {
                print("❌ API hatası: \(error.localizedDescription)")
                return
            }

            guard let data = data else {
                print("❌ Veri alınamadı")
                return
            }

            do {
                let decodedResponse = try JSONDecoder().decode(ProductResponse.self, from: data)
                self.products = decodedResponse.data
                print("✅ Kategoriye ait ürün sayısı: \(self.products.count)")

                DispatchQueue.main.async {
                    self.productsTableView.reloadData()
                }
            } catch {
                print("❌ JSON decode hatası: \(error)")
            }
        }.resume()
    }
    
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return products.count
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        guard let cell = tableView.dequeueReusableCell(withIdentifier: "categoryProductCell", for: indexPath) as? AllProductsByCategoryTableViewCell else {
            return UITableViewCell()
        }
        
        let product = products[indexPath.row]
        cell.productTitle.text = product.name
        cell.productDescription.text = product.description
        cell.productPrice.text = "$\(product.pricePerMonth)/Monthly"
        
        if let imageUrl = product.productImageList.first?.imageUrl {
            cell.productImageView.loadImage(from: imageUrl)
        }
        
        return cell
    }
    
    // MARK: - UITableViewDelegate
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let selectedProduct = products[indexPath.row]
        performSegue(withIdentifier: "toDetailedPageFromCategory", sender: selectedProduct)
    }
    
    // MARK: - Navigation
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "toDetailedPageFromCategory",
           let selectedProduct = sender as? Product,
           let destinationVC = segue.destination as? DetailedProductsPageViewController {
            destinationVC.product = selectedProduct
        }
    }
    
    
    
    
    
}
