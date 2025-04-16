import React from 'react';
import './Footer.css';
import logo from '../assets/rentgo-logo.png'; 


const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-links">
        <div className="footer-column">
          <h4>Kurumsal</h4>
          <ul>
            <li><a href="/hakkimizda">Hakkımızda</a></li>
            <li><a href="/iletisim">İletişim</a></li>
            <li><a href="/etik-ve-cevre-politikasi">Etik ve Çevre Politikası</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Yasal</h4>
          <ul>
            <li><a href="/aydinlatma-metni">Aydınlatma Metni</a></li>
            <li><a href="/uyelik-sozlesmesi">Üyelik Sözleşmesi</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>Yardım</h4>
          <ul>
            <li><a href="/nasil-calisir">Nasıl Çalışır?</a></li>
            <li><a href="/sss">Sıkça Sorulan Sorular</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 rentgo.com Tüm hakları saklıdır.</p>
      </div>
    </footer>
  );
};

export default Footer;