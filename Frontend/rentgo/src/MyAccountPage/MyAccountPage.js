import React from 'react';
import Navbar from '../NavBar/NavBar';
import CategoriesBar from '../CategoriesBar/CategoriesBar';
import AccountPage from '../AccountPage/AccountPage';
import Footer from '../Footer/Footer';
import './MyAccountPage.css';

const MyAccountPage = () => {
  return (
    <div className="landing-page">
      <Navbar />
      <CategoriesBar />
      <AccountPage />
      <Footer />
    </div>
  );
};

export default MyAccountPage;