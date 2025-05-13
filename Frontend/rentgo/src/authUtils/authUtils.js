class AuthUtils {
  static getToken() {
    return localStorage.getItem("token");
  }

  static getUserId() {
    return localStorage.getItem("customerId");
  }

  static getUserRoles() {
    const roles = localStorage.getItem("userRoles");
    return roles ? JSON.parse(roles) : [];
  }

  static isLoggedIn() {
    return !!localStorage.getItem("token");
  }

  static logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("customerId");
    localStorage.removeItem("userRoles");
  }
}

export default AuthUtils;
