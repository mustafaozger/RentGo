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
        guard let cartId = AuthService.shared.currentAuthResponse?.cartId else {
            print("CartId bulunamadı.")
            return
        }
        
        let deliveryType = selectedDeliveryType
        let rentalDuration = 1
        
        // 🛒 Backend API call
        let body: [String: Any] = [
            "cartId": cartId,
            "productId": product.id,
            "rentalPeriodType": deliveryType.rawValue,
            "rentalDuration": rentalDuration,
            "totalPrice": Double(rentalDuration) * (deliveryType == .weekly ? product.pricePerWeek : product.pricePerMonth)
        ]
        
        guard let url = URL(string: "https://localhost:9001/api/v1/Cart/add-item-with-cart-id"),
              let httpBody = try? JSONSerialization.data(withJSONObject: body, options: []) else { return }
        
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = httpBody
        
        let session = BasketNetworkManager.shared.createSecureSession()
        
        session.dataTask(with: request) { data, response, error in
            if let error = error {
                print("Sepete ekleme hatası: \(error.localizedDescription)")
                return
            }

            guard let data = data,
                  let cartItemIdString = String(data: data, encoding: .utf8)?
                                            .replacingOccurrences(of: "\"", with: "") else {
                print("CartItemId parse edilemedi")
                return
            }

            print("CartItemId geldi: \(cartItemIdString)")

            // 🛒 Local BasketManager güncelle
            let basketItem = BasketProduct(
                id: UUID(),
                productId: product.id,
                name: product.name,
                imageName: nil,
                imageUrl: product.productImageList.first?.imageUrl,
                rentalDuration: rentalDuration,
                weeklyPrice: product.pricePerWeek,
                monthlyPrice: product.pricePerMonth,
                deliveryType: deliveryType,
                cartItemId: cartItemIdString // ✅ Burada geldikten sonra ekle
            )
            BasketManager.shared.addAndSync(basketItem, cartId: cartId)

            DispatchQueue.main.async {
                self.tabBarController?.selectedIndex = 2
            }

        }.resume()
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
