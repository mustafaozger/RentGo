//
//  BasketNetworkManager.swift
//  RentGo
//
//  Created by Eray İnal on 8.05.2025.
//

import Foundation

class BasketNetworkManager: NSObject, URLSessionDelegate {
    
    static let shared = BasketNetworkManager()
    
    private override init() {}
    
    func createSecureSession() -> URLSession {
        let config = URLSessionConfiguration.default
        return URLSession(configuration: config, delegate: self, delegateQueue: nil)
    }
    
    // SSL sertifikasını otomatik kabul eder
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
