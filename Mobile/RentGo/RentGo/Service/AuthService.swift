import Foundation

class AuthService: NSObject, URLSessionDelegate {
    
    static let shared = AuthService()
    private override init() {}
    
    var currentAuthResponse: AuthResponse?

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

        // ✅ Sertifika doğrulamasını bypass eden özel session
        let session = URLSession(configuration: .default, delegate: self, delegateQueue: nil)

        session.dataTask(with: req) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }

            guard let data = data else {
                completion(.failure(NSError(domain: "EmptyData", code: 0)))
                return
            }

            do {
                let decoded = try JSONDecoder().decode(AuthResponse.self, from: data)
                self.currentAuthResponse = decoded // ✅ Yeni eklenen satır
                completion(.success(decoded))
            } catch {
                completion(.failure(error))
            }

        }.resume()
    }

    // ✅ Artık register sonrası gelen raw metni döndürüyoruz (içinde link var)
    func signUp(request: RegisterRequest, completion: @escaping (Result<String, Error>) -> Void) {
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

        let session = URLSession(configuration: .default, delegate: self, delegateQueue: nil)

        session.dataTask(with: req) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }

            guard let httpResponse = response as? HTTPURLResponse,
                  httpResponse.statusCode == 200,
                  let data = data,
                  let responseString = String(data: data, encoding: .utf8) else {
                completion(.failure(NSError(domain: "InvalidResponse", code: 0)))
                return
            }

            completion(.success(responseString)) // ✅ Linki döndür
        }.resume()
    }

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
