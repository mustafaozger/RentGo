import React, { useState } from "react";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Şifreler eşleşmiyor!");
      return;
    }
    console.log("Kayıt Başarılı:", formData);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-4">Üye Ol</h2>
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
            className="w-full p-2 mb-4 border rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
          />

          <label className="block mb-2 font-medium">Şifre (Tekrar)</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Şifrenizi tekrar girin"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="w-full p-2 mb-6 border rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
          />

          <button
            type="submit"
            className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition-colors"
          >
            Üye Ol
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
