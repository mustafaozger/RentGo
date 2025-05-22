import React from 'react';
import './Footer.css';
import logo from '../assets/rentgo-logo.png'; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <div className="footer-column">
          <h4>Corporate</h4>
          <ul>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Legal</h4>
          <ul>
            <li><a href="/privacy-policy">Privacy Policy</a></li>
            <li><a href="/terms-of-use">Terms of Use</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Help</h4>
          <ul>
            <li><a href="/how-it-works">How It Works</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 rentgo.com All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
