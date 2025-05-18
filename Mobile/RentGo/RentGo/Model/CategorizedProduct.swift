//
//  CategorizedProduct.swift
//  RentGo
//
//  Created by Eray İnal on 8.05.2025.
//

import Foundation

struct CategorizedProduct: Decodable {
    let id: String
    let name: String
    let description: String
    let categoryId: String
    let pricePerMonth: Double?
    let productImageList: [ProductImage]
}
