//
//  DetailedProductsPageViewController.swift
//  RentGo
//
//  Created by Eray İnal on 24.04.2025.
//

import UIKit

class DetailedProductsPageViewController: UIViewController {

    @IBOutlet weak var productImageView: UIImageView!
    @IBOutlet weak var productName: UILabel!
    @IBOutlet weak var productDescription: UILabel!
    @IBOutlet weak var productPriceLabel: UILabel!
    
    var product: Product?
    
    override func viewDidLoad() {
        super.viewDidLoad()

        // Do any additional setup after loading the view.
        guard let product = product else { return }

            productName.text = product.name
            productDescription.text = product.description
            productPriceLabel.text = "$\(product.pricePerMonth)/month" // varsayılan

            if let imageUrl = product.productImageList.first?.imageUrl {
                productImageView.loadImage(from: imageUrl)
            }
    }
    
    @IBAction func addToCardTapped(_ sender: Any) {
        guard let product = product else { return }
        
        // Image yok, placeholder name kullanılacak
        let basketItem = BasketProduct(
            id: UUID(),
            name: product.name,
            imageName: nil,  // local görsel kullanılmayacak
            imageUrl: product.productImageList.first?.imageUrl, // ✅ backend'den gelen URL
            weeklyPrice: product.pricePerWeek,
            monthlyPrice: product.pricePerMonth,
            deliveryType: .monthly
        )
        
        BasketManager.shared.add(basketItem)
        
        // geçiş
        tabBarController?.selectedIndex = 2
    }
    
    @IBAction func weeklyTapped(_ sender: Any) {
        if let weekly = product?.pricePerWeek {
            productPriceLabel.text = "$\(weekly)/week"
        }
    }
    @IBAction func monthlyTapped(_ sender: Any) {
        if let monthly = product?.pricePerMonth {
            productPriceLabel.text = "$\(monthly)/month"
        }
    }
    
    
}
