import React from 'react';
import './StaticPage.css';
import logo from '../../assets/rentgo-logo.png';

const PrivacyPolicyPage = () => {
  return (
    <div className="static-page">
      <img src={logo} alt="RentGo Logo" className="static-logo" />
      <h1>Privacy Policy</h1>
      <p>
        Your privacy is important to us. At RentGo, we are committed to safeguarding the information you entrust to us.
      </p>
      <p>
        This policy outlines how we collect, use, and protect your personal information when you use our website and services.
        We collect data such as your name, email, phone number, and payment information to provide and improve our services.
      </p>
      <p>
        Your data is never sold or shared with third parties without your explicit consent. We employ industry-standard
        security measures and continuously monitor our systems for vulnerabilities to ensure the safety of your data.
      </p>
      <p>
        By using RentGo, you consent to the practices outlined in this policy. You can contact us anytime for questions regarding your personal data.
      </p>
    </div>
  );
};

export default PrivacyPolicyPage;
