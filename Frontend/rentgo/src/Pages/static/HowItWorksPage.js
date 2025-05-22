import React from 'react';
import './StaticPage.css';
import logo from '../../assets/rentgo-logo.png';

const HowItWorksPage = () => {
  return (
    <div className="static-page">
      <img src={logo} alt="RentGo Logo" className="static-logo" />
      <h1>How It Works</h1>
      <p>
        Renting on RentGo is easy and stress-free. Here’s how it works:
      </p>
      <ol>
        <li><strong>Browse:</strong> Explore our catalog of high-quality rental products.</li>
        <li><strong>Select:</strong> Choose your desired product and rental duration.</li>
        <li><strong>Checkout:</strong> Enter your details and confirm your payment.</li>
        <li><strong>Receive:</strong> Your item will be delivered right to your door.</li>
        <li><strong>Return:</strong> When you're done, send it back easily with our pickup or drop-off options.</li>
      </ol>
      <p>
        That’s it! No long-term commitments, no hidden fees—just flexible access to the things you need.
      </p>
    </div>
  );
};

export default HowItWorksPage;
