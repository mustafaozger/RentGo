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
            $0.name == product.name && $0.deliveryType == product.deliveryType
        }) {
            basketProducts[index].rentalDuration += product.rentalDuration
        } else {
            basketProducts.append(product)
        }
    }
    
    
    
}


