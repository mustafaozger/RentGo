import React from 'react';
import './StaticPage.css';
import logo from '../../assets/rentgo-logo.png';

const AboutUsPage = () => {
  return (
    <div className="static-page">
      <img src={logo} alt="RentGo Logo" className="static-logo" />
      <h1>About Us</h1>
      <p>
        Welcome to RentGo – your trusted partner for high-quality rental products!
      </p>
      <p>
        Founded in 2025, RentGo is a pioneering platform that connects users with affordable and flexible rental options.
        Whether you’re in need of electronics, furniture, or household essentials, our mission is to make rental fast, reliable, and cost-effective.
      </p>
      <p>
        Our team is passionate about sustainability and accessibility. By promoting the sharing economy, we aim to reduce waste
        and give everyone access to the things they need, only when they need them. From students to families and professionals,
        RentGo helps everyone live smarter with temporary access to great products.
      </p>
      <p>
        Join us on our journey to transform the way we consume. Rent smarter. Live better.
      </p>
    </div>
  );
};

export default AboutUsPage;
