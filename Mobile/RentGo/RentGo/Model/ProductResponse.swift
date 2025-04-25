//
//  ProductResponse.swift
//  RentGo
//
//  Created by Eray İnal on 24.04.2025.
//

import Foundation

struct ProductResponse: Codable {
    let pageNumber: Int
    let pageSize: Int
    let data: [Product]
}
