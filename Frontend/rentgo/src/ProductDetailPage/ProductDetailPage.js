import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../NavBar/NavBar';
import CategoriesBar from '../CategoriesBar/CategoriesBar';
import ProductDetailComponent from '../ProductDetailComponent/ProductDetailComponent';
import './ProductDetailPage.css';

const ProductDetailPage = () => {
  const location = useLocation();
  const product = location.state?.product;

  if (!product) {
    return <p>Ürün bilgisi bulunamadı.</p>;
  }

  return (
    <div className="product-detail-page">
      <Navbar />
      <CategoriesBar />
      <ProductDetailComponent product={product} />
    </div>
  );
};

export default ProductDetailPage;
