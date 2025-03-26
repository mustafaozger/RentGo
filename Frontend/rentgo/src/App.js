import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Authentication/LoginPage";
import RegisterPage from "./Authentication//RegisterPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </Router>
  );
};

export default App;
