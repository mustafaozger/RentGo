//
//  AuthService.swift
//  RentGo
//
//  Created by Eray İnal on 24.04.2025.
//

import Foundation

class AuthService: NSObject, URLSessionDelegate {
    
    static let shared = AuthService()
    private override init() {}

    let baseURL = "https://localhost:9001/api/Account"

    func signIn(request: LoginRequest, completion: @escaping (Result<AuthResponse, Error>) -> Void) {
        guard let url = URL(string: "\(baseURL)/authenticate") else { return }

        var req = URLRequest(url: url)
        req.httpMethod = "POST"
        req.addValue("application/json", forHTTPHeaderField: "Content-Type")

        do {
            req.httpBody = try JSONEncoder().encode(request)
        } catch {
            completion(.failure(error))
            return
        }

        let session = URLSession(configuration: .default, delegate: self, delegateQueue: nil) 

        session.dataTask(with: req) { data, _, error in
            if let error = error {
                completion(.failure(error))
                return
            }

            guard let data = data else { return }

            do {
                let decoded = try JSONDecoder().decode(AuthResponse.self, from: data)
                completion(.success(decoded))
            } catch {
                completion(.failure(error))
            }

        }.resume()
    }

    func signUp(request: RegisterRequest, completion: @escaping (Result<Void, Error>) -> Void) {
        guard let url = URL(string: "\(baseURL)/register") else { return }

        var req = URLRequest(url: url)
        req.httpMethod = "POST"
        req.addValue("application/json", forHTTPHeaderField: "Content-Type")

        do {
            req.httpBody = try JSONEncoder().encode(request)
        } catch {
            completion(.failure(error))
            return
        }

        let session = URLSession(configuration: .default, delegate: self, delegateQueue: nil) // ✅

        session.dataTask(with: req) { _, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }

            guard let httpResponse = response as? HTTPURLResponse,
                  httpResponse.statusCode == 200 else {
                completion(.failure(NSError(domain: "InvalidResponse", code: 0)))
                return
            }

            completion(.success(()))
        }.resume()
    }

    // ✅ Self-signed SSL için gerekli olan delegate fonksiyonu
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
