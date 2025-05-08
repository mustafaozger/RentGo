//
//  AddItemRequest.swift
//  RentGo
//
//  Created by Eray İnal on 8.05.2025.
//

import Foundation

struct AddItemRequest: Encodable {
    let cartId: String
    let productId: String
    let rentalPeriodType: String
    let rentalDuration: Int
    let totalPrice: Double
}
