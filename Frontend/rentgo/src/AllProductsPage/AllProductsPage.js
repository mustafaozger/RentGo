import React, { useEffect, useState } from 'react';
import './AllProductsPage.css';
import Navbar from '../NavBar/NavBar';
import CategoriesBar from '../CategoriesBar/CategoriesBar';
import Footer from '../Footer/Footer';
import ProductCard from '../ProductCard/ProductCard';

const AllProductsPage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('https://localhost:9001/api/v1/Product')
      .then((res) => res.json())
      .then((data) => {
        console.log('Gelen veri:', data);
        setProducts(data.data); 
      })
      .catch((err) => {
        console.error('Ürünler alınamadı:', err);
        setProducts([]); 
      });
  }, []);

  return (
    <div className="all-products-page">
      <Navbar />
      <CategoriesBar />
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <Footer />
    </div>
  );
};

export default AllProductsPage;
