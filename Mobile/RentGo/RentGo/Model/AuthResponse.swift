//
//  AuthResponse.swift
//  RentGo
//
//  Created by Eray İnal on 24.04.2025.
//

import Foundation

struct AuthResponse: Codable {
    let id: String
    let userName: String
    let email: String
    let roles: [String]
    let isVerified: Bool
    let jwToken: String

    enum CodingKeys: String, CodingKey {
        case id, userName, email, roles, isVerified, jwToken = "jwToken"
    }
}
