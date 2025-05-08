//
//  AdminProductModel.swift
//  RentGo
//
//  Created by Eray İnal on 7.05.2025.
//

import Foundation

struct AdminProductModel: Decodable {
    let id: String
    let name: String
    let description: String
    let pricePerWeek: Double
    let pricePerMonth: Double
    let isRent: Bool
    let lastRentalHistory: String
    let productImageList: [ProductImage]

    struct ProductImage: Decodable {
        let imageUrl: String
    }
}


