import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './AllProductsPage.css';
import Navbar from '../NavBar/NavBar';
import CategoriesBar from '../CategoriesBar/CategoriesBar';
import Footer from '../Footer/Footer';
import ProductCard from '../ProductCard/ProductCard';


const AllProductsPage = () => {
  const [products, setProducts] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryId = queryParams.get("category");

    let url = '';
    if (categoryId && categoryId !== 'all') {
      url = `https://localhost:9001/api/v1/Category/filter-by-category?categoryId=${categoryId}&pageNumber=1&pageSize=10`;
    } else {
      url = 'https://localhost:9001/api/v1/Product';
    }

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log('Gelen veri:', data);
        setProducts(data.data);
      })
      .catch((err) => {
        console.error('Ürünler alınamadı:', err);
        setProducts([]);
      });
  }, [location.search]);

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
