import React from 'react';
import Navbar from '../NavBar/NavBar';
import CategoriesBar from '../CategoriesBar/CategoriesBar';
import ImageCarousel from '../ImageCarousel/ImageCarousel';
import ProductList from '../ProductList/ProductList';
import Footer from '../Footer/Footer';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Navbar />
      <CategoriesBar />
      <ImageCarousel />
      <ProductList />
      <Footer />
    </div>
  );
};

export default LandingPage;