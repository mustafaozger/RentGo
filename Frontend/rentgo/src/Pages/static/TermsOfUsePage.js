import React from 'react';
import './StaticPage.css';
import logo from '../../assets/rentgo-logo.png';

const TermsOfUsePage = () => {
  return (
    <div className="static-page">
      <img src={logo} alt="RentGo Logo" className="static-logo" />
      <h1>Terms of Use</h1>
      <p>
        Welcome to RentGo. By accessing or using our services, you agree to be bound by these Terms of Use.
      </p>
      <p>
        Our platform allows users to rent products under specific terms and durations. Users must provide accurate information
        and adhere to payment deadlines. Damaging or failing to return items may result in penalties.
      </p>
      <p>
        RentGo reserves the right to modify or discontinue services without prior notice. All users are responsible for staying
        updated with our latest terms.
      </p>
      <p>
        Continued use of RentGo constitutes acceptance of these terms. Please read them carefully before proceeding.
      </p>
    </div>
  );
};

export default TermsOfUsePage;
