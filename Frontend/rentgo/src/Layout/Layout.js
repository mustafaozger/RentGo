// src/Layout/Layout.js
import React from 'react';
import Navbar from '../NavBar/NavBar';
import CategoriesBar from '../CategoriesBar/CategoriesBar';
import Footer from '../Footer/Footer';

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <CategoriesBar />
      <main>{children}</main>
      <Footer />
    </>
  );
};

export default Layout;
