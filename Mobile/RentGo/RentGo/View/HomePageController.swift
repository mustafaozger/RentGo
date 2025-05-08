//
//  HomePageController.swift
//  RentGo
//
//  Created by Eray İnal on 26.03.2025.
//

import UIKit

class HomePageController: UIViewController {
    
    @IBOutlet weak var campaignImageView: UIImageView!
    
    @IBOutlet weak var productImageView1: UIImageView!
    @IBOutlet weak var productImageView2: UIImageView!
    @IBOutlet weak var productImageView3: UIImageView!
    @IBOutlet weak var productImageView4: UIImageView!
    @IBOutlet weak var productImageView5: UIImageView!
    @IBOutlet weak var productImageView6: UIImageView!
    
    @IBOutlet weak var productTitleLabel1: UILabel!
    @IBOutlet weak var productTitleLabel2: UILabel!
    @IBOutlet weak var productTitleLabel3: UILabel!
    @IBOutlet weak var productTitleLabel4: UILabel!
    @IBOutlet weak var productTitleLabel5: UILabel!
    @IBOutlet weak var productTitleLabel6: UILabel!
    
    @IBOutlet weak var productPriceLabel1: UILabel!
    @IBOutlet weak var productPriceLabel2: UILabel!
    @IBOutlet weak var productPriceLabel3: UILabel!
    @IBOutlet weak var productPriceLabel4: UILabel!
    @IBOutlet weak var productPriceLabel5: UILabel!
    @IBOutlet weak var productPriceLabel6: UILabel!
    
    @IBOutlet weak var seeAllLabel1: UILabel!
    @IBOutlet weak var seeAllLabel2: UILabel!
    
    var rentNowProducts: [Product] = []
    var suggestedProducts: [Product] = []
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view.
        let tapGestureSeeAll = UITapGestureRecognizer(target: self, action: #selector(seeAllLabelTapped))
        seeAllLabel1.addGestureRecognizer(tapGestureSeeAll)
        seeAllLabel1.isUserInteractionEnabled = true
        
        setupGestures()
        fetchProducts()
    }
    
    
    
    
    
    
    func setupGestures() {
        let tapGestureSeeAllRentNow = UITapGestureRecognizer(target: self, action: #selector(seeAllLabelTapped))
        seeAllLabel1.addGestureRecognizer(tapGestureSeeAllRentNow)
        seeAllLabel1.isUserInteractionEnabled = true

        let tapGestureSeeAllSuggestions = UITapGestureRecognizer(target: self, action: #selector(seeAllSuggestionsTapped))
        seeAllLabel2.addGestureRecognizer(tapGestureSeeAllSuggestions)
        seeAllLabel2.isUserInteractionEnabled = true
    }
    
    @objc func seeAllLabelTapped() {
        performSegue(withIdentifier: "toAllProductsPageFromHome", sender: nil)
    }

    @objc func seeAllSuggestionsTapped() {
        performSegue(withIdentifier: "toProductsFromCategory", sender: suggestedProducts.first?.categoryId)
    }

    func fetchProducts() {
        guard let url = URL(string: "https://localhost:9001/api/v1/Product") else { return }
        let session = URLSession(configuration: .default, delegate: nil, delegateQueue: nil)

        session.dataTask(with: url) { data, _, error in
            guard let data = data, error == nil else { return }

            do {
                let decodedResponse = try JSONDecoder().decode(ProductResponse.self, from: data)
                let allProducts = decodedResponse.data

                // Rent Now (İlk 3 ürün)
                self.rentNowProducts = Array(allProducts.prefix(3))

                // Products for you (Random 3 ürün)
                self.suggestedProducts = Array(allProducts.shuffled().prefix(3))

                DispatchQueue.main.async {
                    self.updateUI()
                }
            } catch {
                print("Decoding error:", error)
            }
        }.resume()
    }
    
    
    func updateUI() {
        // Rent Now
        let rentImages = [productImageView1, productImageView2, productImageView3]
        let rentTitles = [productTitleLabel1, productTitleLabel2, productTitleLabel3]
        let rentPrices = [productPriceLabel1, productPriceLabel2, productPriceLabel3]

        for (index, product) in rentNowProducts.enumerated() {
            rentTitles[index]?.text = product.name
            rentPrices[index]?.text = "$\(product.pricePerWeek)/Weekly"
            if let imageUrl = product.productImageList.first?.imageUrl {
                rentImages[index]?.loadImage(from: imageUrl)
            }
        }

        // Suggestions
        let sugImages = [productImageView4, productImageView5, productImageView6]
        let sugTitles = [productTitleLabel4, productTitleLabel5, productTitleLabel6]
        let sugPrices = [productPriceLabel4, productPriceLabel5, productPriceLabel6]

        for (index, product) in suggestedProducts.enumerated() {
            sugTitles[index]?.text = product.name
            sugPrices[index]?.text = "$\(product.pricePerWeek)/Weekly"
            if let imageUrl = product.productImageList.first?.imageUrl {
                sugImages[index]?.loadImage(from: imageUrl)
            }
        }
    }
    
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "toAllProductsPageFromHome" {
            segue.destination.hidesBottomBarWhenPushed = false
        } else if segue.identifier == "toProductsFromCategory",
                  let categoryId = sender as? String,
                  let destination = segue.destination as? ProductsByCategoryViewController {
            destination.categoryId = categoryId
        }
    }
    
    
    
    
    
    
}
