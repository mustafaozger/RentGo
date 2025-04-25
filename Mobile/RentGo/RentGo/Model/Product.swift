//
//  Product.swift
//  RentGo
//
//  Created by Eray İnal on 24.04.2025.
//

import Foundation

struct Product: Codable {
    let id: String
    let name: String
    let description: String
    let categoryId: String
    let pricePerMonth: Double
    let pricePerWeek: Double
    let isRent: Bool
    let lastRentalHistory: String
    let productImageList: [ProductImage]
}

struct ProductImage: Codable {
    let imageUrl: String
}
