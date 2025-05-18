//
//  BasketManager.swift
//  RentGo
//
//  Created by Eray İnal on 24.04.2025.
//

import Foundation

class BasketManager {
    static var shared = BasketManager()
    private init() {}

    var basketProducts: [BasketProduct] = []

    func add(_ product: BasketProduct) {
        if let index = basketProducts.firstIndex(where: {
            $0.productId == product.productId && $0.deliveryType == product.deliveryType
        }) {
            // ✅ rentalDuration arttır ama cartItemId güncellensin
            var existingProduct = basketProducts[index]
            existingProduct.rentalDuration += product.rentalDuration
            existingProduct.cartItemId = product.cartItemId  // ✅ ÖNEMLİ KISIM
            basketProducts[index] = existingProduct
        } else {
            basketProducts.append(product)
        }
    }

    func clear() {
        basketProducts.removeAll()
    }
    
    
    func addAndSync(_ product: BasketProduct, cartId: String) {
        // Önce local olarak ekle
        self.add(product)

        // Ardından sunucuya gönder
        let body: [String: Any] = [
            "cartId": cartId,
            "productId": product.productId,
            "rentalPeriodType": product.deliveryType.rawValue,
            "rentalDuration": product.rentalDuration,
            "totalPrice": product.totalPrice
        ]

        guard let url = URL(string: "https://localhost:9001/api/v1/Cart/add-item"),
              let httpBody = try? JSONSerialization.data(withJSONObject: body, options: []) else {
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = httpBody

        let session = BasketNetworkManager.shared.createSecureSession()

        session.dataTask(with: request) { data, response, error in
            if let error = error {
                print("❌ Sepet API ekleme hatası: \(error.localizedDescription)")
                return
            }

            print("✅ Ürün sunucu sepetine başarıyla eklendi.")
        }.resume()
    }
}





