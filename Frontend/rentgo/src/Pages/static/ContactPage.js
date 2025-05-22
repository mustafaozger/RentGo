import React from 'react';
import './StaticPage.css';
import logo from '../../assets/rentgo-logo.png';

const ContactPage = () => {
  return (
    <div className="static-page">
      <img src={logo} alt="RentGo Logo" className="static-logo" />
      <h1>Contact Us</h1>
      <p>
        Have questions, suggestions, or feedback? We’d love to hear from you!
      </p>
      <p>
        📍 Address: RentGo Software, Adeniz Üniversitesi Kampüs, Teknokent ARGE-2 Uluğbey, Kat:1 D:1
      </p>
      <p>
        📞 Phone: 444 16 07
      </p>
      <p>
        📧 Email: support@rentgo.com
      </p>
      <p>
        Our support team is available Monday through Friday, 9:00 AM – 6:00 PM. Feel free to reach out with any inquiries, and we’ll get back to you as soon as possible!
      </p>
    </div>
  );
};

export default ContactPage;
