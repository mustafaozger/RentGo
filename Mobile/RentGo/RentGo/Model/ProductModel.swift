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
    let imageName: String?  // ✅ Lokal resim adı
    let imageUrl: String?   // ✅ URL’den gelecekse bu
    
    var count: Int = 1
    let weeklyPrice: Double
    let monthlyPrice: Double
    var deliveryType: DeliveryType = .monthly

    var totalPrice: Double {
        let unitPrice = deliveryType == .weekly ? weeklyPrice : monthlyPrice
        return Double(count) * unitPrice
    }

    enum DeliveryType {
        case weekly
        case monthly
    }
}
