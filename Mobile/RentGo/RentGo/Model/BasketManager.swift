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
        basketProducts.append(product)
    }
}
