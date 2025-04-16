import React from 'react';
import Navbar from '../NavBar/NavBar';
import CategoriesBar from '../CategoriesBar/CategoriesBar';
import ImageCarousel from '../ImageCarousel/ImageCarousel';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <Navbar />
      <CategoriesBar />
      <ImageCarousel />
    </div>
  );
};

export default LandingPage;