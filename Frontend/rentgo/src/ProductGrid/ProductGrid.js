import React from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './ProductGrid.css';

const products = [
  {
    id: 1,
    name: "Apple iPhone 16 128 GB Siyah",
    category: "Telefon",
    price: 3000,
    discountedPrice: 3000,
    image: "/images/iphone.jpg"
  },
  {
    id: 2,
    name: "Apple iPad Pro 11 inç 256 GB",
    category: "Tablet",
    price: 4591,
    discountedPrice: 4078,
    image: "/images/ipad.jpg"
  },
  // Diğer ürünler...
];

const ProductGrid = () => {
  return (
    <div className="product-grid">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductGrid;