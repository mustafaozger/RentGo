import React from 'react';
import ProductGrid from '../ProductGrid/ProductGrid';
import './AllProductsPage.css';
import Navbar from '../NavBar/NavBar';
import CategoriesBar from '../CategoriesBar/CategoriesBar';
import Footer from '../Footer/Footer';

const AllProductsPage = () => {
  return (
    <div className="all-products-page">
      <Navbar />
      <CategoriesBar />
      <ProductGrid />
      <Footer />
    </div>
  );
};

export default AllProductsPage;