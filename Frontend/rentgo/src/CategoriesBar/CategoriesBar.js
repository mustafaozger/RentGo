import React from 'react';
import './CategoriesBar.css';

const categories = [
  "All Products",
  "Personal Care",
  "Hobbies & Games",
  "Smart Home",
  "Baby & Kids",
  "Phones & Laptops",
  "Smart Watches",
  "Campaigns",
  "New Arrivals"
];

const CategoriesBar = () => {
  return (
    <div className="categories-bar">
      {categories.map((category, index) => (
        <div key={index} className="category-item">
          {category}
        </div>
      ))}
    </div>
  );
};

export default CategoriesBar;