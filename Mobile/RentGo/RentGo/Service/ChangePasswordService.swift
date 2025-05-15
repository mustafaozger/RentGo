//
//  ChangePasswordService.swift
//  RentGo
//
//  Created by Eray İnal on 15.05.2025.
//

import Foundation

class ChangePasswordService: NSObject, URLSessionDelegate {
    
    static let shared = ChangePasswordService()
    private override init() {}

    func changePassword(request: ChangePasswordRequest, completion: @escaping (Result<String, Error>) -> Void) {
        
        guard let url = URL(string: "https://localhost:9001/api/Account/change-password") else {
            completion(.failure(NSError(domain: "Invalid URL", code: 0)))
            return
        }
        
        var urlRequest = URLRequest(url: url)
        urlRequest.httpMethod = "PUT"
        urlRequest.addValue("application/json", forHTTPHeaderField: "Content-Type")
        
        // ✅ Authorization header ekleniyor (JWT token kullanıyorsan)
        if let token = UserDefaults.standard.string(forKey: "accessToken") {
            urlRequest.addValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        
        do {
            let jsonData = try JSONEncoder().encode(request)
            urlRequest.httpBody = jsonData
        } catch {
            completion(.failure(error))
            return
        }
        
        // ✅ Sertifika doğrulamasını bypass eden session
        let session = URLSession(configuration: .default, delegate: self, delegateQueue: nil)
        
        session.dataTask(with: urlRequest) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }
            
            guard let httpResponse = response as? HTTPURLResponse else {
                completion(.failure(NSError(domain: "No HTTP Response", code: 0)))
                return
            }
            
            if (200...299).contains(httpResponse.statusCode) {
                completion(.success("Password changed successfully"))
            } else {
                completion(.failure(NSError(domain: "Failed with status code: \(httpResponse.statusCode)", code: httpResponse.statusCode)))
            }
        }.resume()
    }
    
    
    
    // ✅ Sertifika doğrulamasını bypass eden method
    func urlSession(_ session: URLSession, didReceive challenge: URLAuthenticationChallenge,
                    completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void) {
        guard let trust = challenge.protectionSpace.serverTrust else {
            completionHandler(.cancelAuthenticationChallenge, nil)
            return
        }
        let credential = URLCredential(trust: trust)
        completionHandler(.useCredential, credential)
    }
}
