import React, { useState, useEffect } from "react";
import "./AccountPage.css";
import axios from "axios";
import AuthUtils from "../authUtils/authUtils";
import MyOrdersPage from "../MyOrdersPage/MyOrdersPage";


const AccountPage = () => {
  const userId = AuthUtils.getUserId();
  const [activeTab, setActiveTab] = useState("orders");

  const [userInfo, setUserInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
  });

  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirmNew: "",
  });

  const [orders, setOrders] = useState([]);

  useEffect(() => {
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(
        `https://localhost:9001/api/Account/GetCustomerDetail`,
        {
          params: { id: userId },
        }
      );

      const data = response.data;

      const fullName = data.name.split(" ");
      const firstName = fullName[0];
      const lastName = fullName.slice(1).join(" ");
      setUserInfo({
      firstName,
      lastName,
      email: data.email,
      username: data.userName,
      } );
    } catch (error) {
      console.error("Kullanıcı bilgileri alınamadı:", error);
    }
  };

  if (userId) fetchUserInfo();
}, [userId]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `https://localhost:9001/api/v1/Order/get-orders-by-customer-id:${userId}`
        );
        const ordersData = Array.isArray(response.data)
          ? response.data
          : [response.data];
        setOrders(ordersData);
      } catch (error) {
        console.error("Siparişler alınamadı:", error);
      }
    };

    if (userId && activeTab === "orders") {
      fetchOrders();
    }
  }, [userId, activeTab]);

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({ ...userInfo, [name]: value });
  };

  const updateFirstNameLastName = async () => {
    try {
      await axios.put("https://localhost:9001/api/Account/update-name", {
        userId,
        newFirstName: userInfo.firstName,
        newLastName: userInfo.lastName,
      });
      alert("Ad ve Soyad başarıyla güncellendi!");
    } catch (error) {
      console.error("Ad/Soyad güncelleme hatası:", error);
      alert("Ad/Soyad güncelleme sırasında hata oluştu.");
    }
  };

  const updateEmail = async () => {
    try {
      await axios.put("https://localhost:9001/api/Account/update-email", {
        userId,
        newEmail: userInfo.email,
      });
      alert("Email başarıyla güncellendi!");
    } catch (error) {
      console.error("Email güncelleme hatası:", error);
      alert("Email güncelleme sırasında hata oluştu.");
    }
  };

  const updateUsername = async () => {
    try {
      await axios.put("https://localhost:9001/api/Account/update-username", {
        userId,
        newUsername: userInfo.username,
      });
      alert("Kullanıcı adı başarıyla güncellendi!");
    } catch (error) {
      console.error("Kullanıcı adı güncelleme hatası:", error);
      alert("Kullanıcı adı güncelleme sırasında hata oluştu.");
    }
  };

  const updatePassword = async () => {
    if (passwords.new !== passwords.confirmNew) {
      alert("Yeni şifreler eşleşmiyor.");
      return;
    }

    try {
      await axios.put("https://localhost:9001/api/Account/change-password", {
        userId,
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });

      alert("Şifre başarıyla güncellendi!");
    } catch (error) {
      console.error("Şifre güncelleme hatası:", error);
      alert("Şifre güncelleme sırasında hata oluştu.");
    }
  };

  return (
    <div className="account-page">
      <div className="sidebar">
          <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => setActiveTab("orders")}
        >
          Siparişlerim
        </button>
        <button
          className={activeTab === "userinfo" ? "active" : ""}
          onClick={() => setActiveTab("userinfo")}
        >
          Kullanıcı Bilgilerim
        </button>
        <button
          className={activeTab === "password" ? "active" : ""}
          onClick={() => setActiveTab("password")}
        >
          Şifre Güncelleme
        </button>
      </div>

      <div className="content">
        {activeTab === "userinfo" && (
          <div className="form-section">
            <h2>Üyelik Bilgilerim</h2>
            <input
              name="firstName"
              value={userInfo.firstName}
              onChange={handleUserInfoChange}
              placeholder="Ad"
            />
            <input
              name="lastName"
              value={userInfo.lastName}
              onChange={handleUserInfoChange}
              placeholder="Soyad"
            />
            <button onClick={updateFirstNameLastName}>Ad Soyad Güncelle</button>

            <input
              name="email"
              value={userInfo.email}
              onChange={handleUserInfoChange}
              placeholder="E-posta"
            />
            <button onClick={updateEmail}>Email Güncelle</button>

            <input
              name="username"
              value={userInfo.username}
              onChange={handleUserInfoChange}
              placeholder="Kullanıcı Adı"
            />
            <button onClick={updateUsername}>Kullanıcı Adı Güncelle</button>
          </div>
        )}

        {activeTab === "password" && (
          <div className="form-section">
            <h2>Şifre Güncelleme</h2>
            <input
              type="password"
              name="current"
              value={passwords.current}
              onChange={(e) =>
                setPasswords({ ...passwords, current: e.target.value })
              }
              placeholder="Şu Anki Şifre"
            />
            <input
              type="password"
              name="new"
              value={passwords.new}
              onChange={(e) =>
                setPasswords({ ...passwords, new: e.target.value })
              }
              placeholder="Yeni Şifre"
            />
            <input
              type="password"
              name="confirmNew"
              value={passwords.confirmNew}
              onChange={(e) =>
                setPasswords({ ...passwords, confirmNew: e.target.value })
              }
              placeholder="Yeni Şifre (Tekrar)"
            />
            <button onClick={updatePassword}>Şifreyi Güncelle</button>
          </div>
        )}
{activeTab === "orders" && <MyOrdersPage orders={orders} />}
      </div>
    </div>
  );
};

export default AccountPage;
