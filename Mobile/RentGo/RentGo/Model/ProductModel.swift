//
//  ProductModel.swift
//  RentGo
//
//  Created by Eray İnal on 17.04.2025.
//

import Foundation

struct BasketProduct {
    let id: UUID
    let name: String
    let imageName: String?
    let imageUrl: String?

    var rentalDuration: Int = 1 // eski adı count
    let weeklyPrice: Double
    let monthlyPrice: Double
    var deliveryType: DeliveryType = .monthly

    var totalPrice: Double {
        let unitPrice = deliveryType == .weekly ? weeklyPrice : monthlyPrice
        return Double(rentalDuration) * unitPrice
    }

    enum DeliveryType {
        case weekly
        case monthly
    }
}
