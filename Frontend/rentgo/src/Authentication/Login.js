import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // React Router'dan navigate kullanıyoruz

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate(); // Sayfa yönlendirme için hook

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Giriş Yapıldı:", formData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Giriş Yap</h2>
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 font-medium">E-mail</label>
          <input
            type="email"
            name="email"
            placeholder="isim@örnek.com"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
          />

          <label className="block mb-2 font-medium">Şifre</label>
          <input
            type="password"
            name="password"
            placeholder="Şifrenizi girin"
            value={formData.password}
            onChange={handleInputChange}
            className="w-full p-2 mb-6 border rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
          />

          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Giriş Yap
          </button>
        </form>
        <div className="mt-4 text-center">
          <p>
            veya{" "}
            <button
              onClick={() => navigate("/register")}
              className="text-purple-500 hover:underline"
            >
              Üye Ol
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
