import React, { useState, useEffect } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './ProductList.css';

const mockProducts = [
    {
      id: 1,
      name: "Sony Playstation 5 Oyun Konsolu ve 2 Adet PS5 Kol",
      description: "4K TV Destekli, 825 GB",
      price: 1211,
      image: "/images/ps5.jpg"
    },
    {
      id: 2,
      name: "Oculus Quest 2 VR Sanal Gerçeklik Gözlüğü",
      description: "128 GB, VR, Sanal Gerçeklik Gözlüğü",
      price: 998,
      image: "/images/oculus.jpg"
    },
    {
        id: 2,
        name: "Oculus Quest 2 VR Sanal Gerçeklik Gözlüğü",
        description: "128 GB, VR, Sanal Gerçeklik Gözlüğü",
        price: 998,
        image: "/images/oculus.jpg"
      },
      {
        id: 2,
        name: "Oculus Quest 2 VR Sanal Gerçeklik Gözlüğü",
        description: "128 GB, VR, Sanal Gerçeklik Gözlüğü",
        price: 998,
        image: "/images/oculus.jpg"
      },
      {
        id: 2,
        name: "Oculus Quest 2 VR Sanal Gerçeklik Gözlüğü",
        description: "128 GB, VR, Sanal Gerçeklik Gözlüğü",
        price: 998,
        image: "/images/oculus.jpg"
      },
      {
        id: 2,
        name: "Oculus Quest 2 VR Sanal Gerçeklik Gözlüğü",
        description: "128 GB, VR, Sanal Gerçeklik Gözlüğü",
        price: 998,
        image: "/images/oculus.jpg"
      },
      {
        id: 2,
        name: "Oculus Quest 2 VR Sanal Gerçeklik Gözlüğü",
        description: "128 GB, VR, Sanal Gerçeklik Gözlüğü",
        price: 998,
        image: "/images/oculus.jpg"
      },
      {
        id: 2,
        name: "Oculus Quest 2 VR Sanal Gerçeklik Gözlüğü",
        description: "128 GB, VR, Sanal Gerçeklik Gözlüğü",
        price: 998,
        image: "/images/oculus.jpg"
      },
      {
        id: 2,
        name: "Oculus Quest 2 VR Sanal Gerçeklik Gözlüğü",
        description: "128 GB, VR, Sanal Gerçeklik Gözlüğü",
        price: 998,
        image: "/images/oculus.jpg"
      }
  ];
  



const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://api.example.com/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    setProducts(mockProducts);
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