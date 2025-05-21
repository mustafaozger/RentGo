import React, { useState, useEffect } from "react";
import "./AdminSettings.css";
import axios from "axios";
import AuthUtils from "../authUtils/authUtils";
import AdminNavbar from './AdminNavbar';
import AdminTabs from './AdminTabs';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminSettings = () => {
  const userId = AuthUtils.getUserId();
  const [activeTab, setActiveTab] = useState("userinfo");

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

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get(
          `https://localhost:9001/api/Account/GetCustomerDetail`,
          { params: { id: userId } }
        );
        const data = response.data;
        const [firstName, ...lastParts] = data.name.split(" ");
        const lastName = lastParts.join(" ");
        setUserInfo({
          firstName,
          lastName,
          email: data.email,
          username: data.userName,
        });
      } catch (error) {
        console.error("Failed to fetch user information:", error);
      }
    };

    if (userId) fetchUserInfo();
  }, [userId]);

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
      toast.error("An error occurred while updating name.");
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
      toast.error("An error occurred while updating email.");
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
      toast.error("An error occurred while updating username.");
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
      toast.error("An error occurred while updating the password.");
    }
  };

  return (
    <div className="admin-main-container">
      <AdminNavbar />
      <div className="admin-content">
        <AdminTabs activeTab="settings" />
        <div className="account-page">
          <div className="sidebar">
            <button
              className={activeTab === "userinfo" ? "active" : ""}
              onClick={() => setActiveTab("userinfo")}
            >
              My Admin Info
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
                <h2>Admin Information</h2>
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
                <button onClick={updateFirstNameLastName}>Update Name</button>

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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
