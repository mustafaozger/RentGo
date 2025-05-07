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
    
    @IBOutlet weak var weeklyButton: UIButton!
    var product: Product?
    @IBOutlet weak var monthlyButton: UIButton!
    
    var selectedDeliveryType: BasketProduct.DeliveryType = .weekly
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Do any additional setup after loading the view.
        
        productImageView.layer.cornerRadius = 10
        productImageView.clipsToBounds = true
        
        guard let product = product else { return }
        
        productName.text = product.name
        productDescription.text = product.description
        
        // Fiyatı weekly olarak göster
        let weekly = product.pricePerWeek
        productPriceLabel.text = "$\(weekly)/week"
        
        if let imageUrl = product.productImageList.first?.imageUrl {
            productImageView.loadImage(from: imageUrl)
        }
        
        // Başlangıçta weekly seçili gözüksün
        updateButtonStyles(selected: .weekly)
    }
    
    @IBAction func addToCardTapped(_ sender: Any) {
        guard let product = product else { return }
        
        let basketItem = BasketProduct(
            id: UUID(),
            name: product.name,
            imageName: nil,
            imageUrl: product.productImageList.first?.imageUrl,
            weeklyPrice: product.pricePerWeek,
            monthlyPrice: product.pricePerMonth,
            deliveryType: selectedDeliveryType
        )
        
        BasketManager.shared.add(basketItem)
        
        tabBarController?.selectedIndex = 2
    }
    
    @IBAction func weeklyTapped(_ sender: Any) {
        if let weekly = product?.pricePerWeek {
            productPriceLabel.text = "$\(weekly)/week"
            updateButtonStyles(selected: .weekly)
            selectedDeliveryType = .weekly // ✅ güncelle
        }
    }
    @IBAction func monthlyTapped(_ sender: Any) {
        if let monthly = product?.pricePerMonth {
            productPriceLabel.text = "$\(monthly)/month"
            updateButtonStyles(selected: .monthly)
            selectedDeliveryType = .monthly // ✅ güncelle
        }
    }
    
    enum DeliveryType {
        case weekly
        case monthly
    }

    func updateButtonStyles(selected: DeliveryType) {
        if #available(iOS 15.0, *) {
            var weeklyConfig = UIButton.Configuration.gray()
            var monthlyConfig = UIButton.Configuration.gray()

            if selected == .weekly {
                weeklyConfig = .filled()
            } else {
                monthlyConfig = .filled()
            }

            weeklyConfig.title = "Weekly"
            monthlyConfig.title = "Monthly"

            weeklyButton.configuration = weeklyConfig
            monthlyButton.configuration = monthlyConfig
        } else {
            // iOS 14 ve öncesi için fallback (örnek)
            weeklyButton.backgroundColor = selected == .weekly ? .systemBlue : .systemGray5
            weeklyButton.setTitleColor(.white, for: .normal)

            monthlyButton.backgroundColor = selected == .monthly ? .systemBlue : .systemGray5
            monthlyButton.setTitleColor(.white, for: .normal)
        }
    }
    
    
    
}
