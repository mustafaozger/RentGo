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
}


