//
//  RegisterRequest.swift
//  RentGo
//
//  Created by Eray İnal on 24.04.2025.
//

import Foundation

struct RegisterRequest: Codable {
    let firstName: String
    let lastName: String
    let email: String
    let userName: String
    let password: String
    let confirmPassword: String
}
