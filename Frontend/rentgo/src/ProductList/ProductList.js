import React, { useState, useEffect } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './ProductList.css';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://localhost:9001/api/v1/Product');
        const data = await response.json();
        console.log("Gelen veri:", data);
        setProducts(data.data); 
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]); 
      } finally {
        setLoading(false);
      }
    };
  
    fetchProducts();
  }, []);
  

  if (loading) return <div>Loading...</div>;

  return (
    <div className="product-list-container">
      <h2>Rent Now</h2>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
