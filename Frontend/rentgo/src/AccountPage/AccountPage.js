import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
        });
      } catch (error) {
        console.error("Failed to fetch user info:", error);
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
        console.error("Failed to fetch orders:", error);
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
      toast.success("First and last name updated successfully!");
    } catch (error) {
      console.error("Name update error:", error);
      toast.error("An error occurred while updating the name.");
    }
  };

  const updateEmail = async () => {
    try {
      await axios.put("https://localhost:9001/api/Account/update-email", {
        userId,
        newEmail: userInfo.email,
      });
      toast.success("Email updated successfully!");
    } catch (error) {
      console.error("Email update error:", error);
      toast.error("An error occurred while updating the email.");
    }
  };

  const updateUsername = async () => {
    try {
      await axios.put("https://localhost:9001/api/Account/update-username", {
        userId,
        newUsername: userInfo.username,
      });
      toast.success("Username updated successfully!");
    } catch (error) {
      console.error("Username update error:", error);
      toast.error("An error occurred while updating the username.");
    }
  };

  const updatePassword = async () => {
    if (passwords.new !== passwords.confirmNew) {
      toast.error("New passwords do not match.");
      return;
    }

    try {
      await axios.put("https://localhost:9001/api/Account/change-password", {
        userId,
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });

      toast.success("Password updated successfully!");
    } catch (error) {
      console.error("Password update error:", error);
      toast.error("An error occurred while updating the password.");
    }
  };

  return (
    <div className="account-page">
      <div className="sidebar">
        <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => setActiveTab("orders")}
        >
          My Orders
        </button>
        <button
          className={activeTab === "userinfo" ? "active" : ""}
          onClick={() => setActiveTab("userinfo")}
        >
          My Account Info
        </button>
        <button
          className={activeTab === "password" ? "active" : ""}
          onClick={() => setActiveTab("password")}
        >
          Update Password
        </button>
      </div>

      <div className="content">
        {activeTab === "userinfo" && (
          <div className="form-section">
            <h2>Account Information</h2>
            <input
              name="firstName"
              value={userInfo.firstName}
              onChange={handleUserInfoChange}
              placeholder="First Name"
            />
            <input
              name="lastName"
              value={userInfo.lastName}
              onChange={handleUserInfoChange}
              placeholder="Last Name"
            />
            <button onClick={updateFirstNameLastName}>
              Update First & Last Name
            </button>

            <input
              name="email"
              value={userInfo.email}
              onChange={handleUserInfoChange}
              placeholder="Email"
            />
            <button onClick={updateEmail}>Update Email</button>

            <input
              name="username"
              value={userInfo.username}
              onChange={handleUserInfoChange}
              placeholder="Username"
            />
            <button onClick={updateUsername}>Update Username</button>
          </div>
        )}

        {activeTab === "password" && (
          <div className="form-section">
            <h2>Update Password</h2>
            <input
              type="password"
              name="current"
              value={passwords.current}
              onChange={(e) =>
                setPasswords({ ...passwords, current: e.target.value })
              }
              placeholder="Current Password"
            />
            <input
              type="password"
              name="new"
              value={passwords.new}
              onChange={(e) =>
                setPasswords({ ...passwords, new: e.target.value })
              }
              placeholder="New Password"
            />
            <input
              type="password"
              name="confirmNew"
              value={passwords.confirmNew}
              onChange={(e) =>
                setPasswords({ ...passwords, confirmNew: e.target.value })
              }
              placeholder="Confirm New Password"
            />
            <button onClick={updatePassword}>Update Password</button>
          </div>
        )}
        {activeTab === "orders" && <MyOrdersPage orders={orders} />}
      </div>
    </div>
  );
};

export default AccountPage;
