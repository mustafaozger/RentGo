//
//  AuthResponse.swift
//  RentGo
//
//  Created by Eray İnal on 24.04.2025.
//

import Foundation

struct AuthResponse: Codable {
    let token: String
    let expiration: String
}
