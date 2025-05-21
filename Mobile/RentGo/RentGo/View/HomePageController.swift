//
//  HomePageController.swift
//  RentGo
//
//  Created by Eray İnal on 26.03.2025.
//

import UIKit

class HomePageController: UIViewController, URLSessionDelegate {
    
    @IBOutlet weak var campaignImageView: UIImageView!
    @IBOutlet weak var belowCampaignImageView: UIImageView!
    @IBOutlet weak var searchTextField: UITextField!
    @IBOutlet weak var searchIconImageView: UIImageView!
    
    
    
    @IBOutlet weak var backgorundImage1: UIImageView!
    @IBOutlet weak var backgroundImage2: UIImageView!
    @IBOutlet weak var backgorundImage3: UIImageView!
    @IBOutlet weak var backgorundImage4: UIImageView!
    @IBOutlet weak var backgorundImage5: UIImageView!
    @IBOutlet weak var backgorundImage6: UIImageView!
    
    
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
    
    var selectedProduct: Product?
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view.
        let tapGestureSeeAll = UITapGestureRecognizer(target: self, action: #selector(seeAllLabelTapped))
        seeAllLabel1.addGestureRecognizer(tapGestureSeeAll)
        seeAllLabel1.isUserInteractionEnabled = true
        
        let tapGestureSeeAllSuggestions = UITapGestureRecognizer(target: self, action: #selector(seeAllSuggestionsTapped))
        seeAllLabel2.addGestureRecognizer(tapGestureSeeAllSuggestions)
        seeAllLabel2.isUserInteractionEnabled = true
        
        let backgrounds = [backgorundImage1, backgroundImage2, backgorundImage3, backgorundImage4, backgorundImage5, backgorundImage6]

        for (index, bg) in backgrounds.enumerated() {
            bg?.layer.cornerRadius = 10
            bg?.clipsToBounds = true
            bg?.isUserInteractionEnabled = true
            bg?.tag = index // ✅ gesture değil, view’ın kendisi tag almalı
            let gesture = UITapGestureRecognizer(target: self, action: #selector(productTapped(_:)))
            bg?.addGestureRecognizer(gesture)
        }
        
        campaignImageView.layer.cornerRadius = 10
        belowCampaignImageView.layer.cornerRadius = 10
        
        let productImages = [productImageView1, productImageView2, productImageView3,
                             productImageView4, productImageView5, productImageView6]

        for imageView in productImages {
            imageView?.layer.cornerRadius = 10
            imageView?.clipsToBounds = true
        }
        
        searchTextField.delegate = self
        searchTextField.returnKeyType = .search
        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(searchManually))
        searchIconImageView.isUserInteractionEnabled = true
        searchIconImageView.addGestureRecognizer(tapGesture)
        
        setupGestures()
        fetchProducts()
    }
    
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        searchTextField.text = "" // Arama çubuğunu temizle
    }
    
    
    @objc func searchManually() {
        _ = textFieldShouldReturn(searchTextField)
    }
    
    
    /*
    override func viewDidLayoutSubviews() {
        super.viewDidLayoutSubviews()

        let topCornersPath = UIBezierPath(
            roundedRect: campaignImageView.bounds,
            byRoundingCorners: [.topLeft, .topRight],
            cornerRadii: CGSize(width: 10, height: 10)
        )
        let maskLayer = CAShapeLayer()
        maskLayer.path = topCornersPath.cgPath
        campaignImageView.layer.mask = maskLayer
    }
     */
    
    
    
    
    @objc func productTapped(_ sender: UITapGestureRecognizer) {
        guard let tag = sender.view?.tag else { return }

        // ilk 3 rentNow, sonraki 3 suggested
        if tag < 3 {
            selectedProduct = rentNowProducts[safe: tag]
        } else {
            selectedProduct = suggestedProducts[safe: tag - 3]
        }

        performSegue(withIdentifier: "toDetailedPageFromHome", sender: nil)
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
        performSegue(withIdentifier: "toCategoryProductsFromHome", sender: suggestedProducts.first?.categoryId)
    }
    
    func fetchProducts() {
        guard let url = URL(string: "https://localhost:9001/api/v1/Product") else {
            print("❌ URL oluşamadı")
            return
        }
        
        let session = URLSession(configuration: .default, delegate: self, delegateQueue: nil)
        
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
                let allProducts = decodedResponse.data
                print("✅ HomePage veri sayısı: \(allProducts.count)")
                
                self.rentNowProducts = Array(allProducts.prefix(3))
                self.suggestedProducts = Array(allProducts.shuffled().prefix(3))
                
                DispatchQueue.main.async {
                    self.updateUI()
                }
            } catch {
                print("❌ Decode hatası: \(error)")
            }
        }.resume()
    }
    
    
    func updateUI() {
        let rentImages = [productImageView1, productImageView2, productImageView3]
        let rentTitles = [productTitleLabel1, productTitleLabel2, productTitleLabel3]
        let rentPrices = [productPriceLabel1, productPriceLabel2, productPriceLabel3]
        
        for (index, product) in rentNowProducts.enumerated() {
            rentTitles[index]?.text = product.name
            rentPrices[index]?.text = "$\(product.pricePerWeek)/Weekly"
            if let imageUrl = product.productImageList.first?.imageUrl {
                rentImages[index]?.loadImage(from: imageUrl)
            } else {
                rentImages[index]?.image = UIImage(systemName: "photo")
            }
        }
        
        let sugImages = [productImageView4, productImageView5, productImageView6]
        let sugTitles = [productTitleLabel4, productTitleLabel5, productTitleLabel6]
        let sugPrices = [productPriceLabel4, productPriceLabel5, productPriceLabel6]
        
        for (index, product) in suggestedProducts.enumerated() {
            sugTitles[index]?.text = product.name
            sugPrices[index]?.text = "$\(product.pricePerWeek)/Weekly"
            if let imageUrl = product.productImageList.first?.imageUrl {
                sugImages[index]?.loadImage(from: imageUrl)
            } else {
                sugImages[index]?.image = UIImage(systemName: "photo")
            }
        }
    }
    
    
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        if segue.identifier == "toAllProductsPageFromHome",
           let destination = segue.destination as? AllProductsPageViewController {
            destination.searchQuery = sender as? String
            destination.hidesBottomBarWhenPushed = false
        } else if segue.identifier == "toCategoryProductsFromHome",
                  let categoryId = sender as? String,
                  let destination = segue.destination as? AllProductsByCategoryViewController {
            // destination.categoryId = categoryId
        } else if segue.identifier == "toDetailedPageFromHome",
                  let destination = segue.destination as? DetailedProductsPageViewController,
                  let product = selectedProduct {
            destination.product = product
        }
    }
    
    
    
    
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




extension Collection {
    subscript(safe index: Index) -> Element? {
        return indices.contains(index) ? self[index] : nil
    }
}




extension HomePageController: UITextFieldDelegate {
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        guard let query = textField.text?.trimmingCharacters(in: .whitespacesAndNewlines),
              !query.isEmpty else {
            print("⚠️ Boş arama sorgusu engellendi.")
            return false
        }

        print("🔍 Arama yapılıyor: \(query)")
        textField.resignFirstResponder()
        
        performSegue(withIdentifier: "toAllProductsPageFromHome", sender: query)
        
        return true
    }
}


