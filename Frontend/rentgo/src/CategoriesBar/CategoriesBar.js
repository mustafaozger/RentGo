import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './CategoriesBar.css';

const categories = [
  { name: "All Products", emoji: "📦", subcategories: [], path: "/all-products", id: null },
  { name: "Personal Care", emoji: "💄", subcategories: ["Hair Care", "Skin Care", "Oral Care"], path: "/all-products", id: "A1E4DCD5-9FDA-4C9B-915F-32C4E9A1B8C3" },
  { name: "Hobbies & Games", emoji: "🎮", subcategories: ["Musical Instruments", "Sports Equipment", "Gaming Consoles"], path: "/all-products", id: "B2F5E1C6-2ACE-4D35-9E4C-9F1D2A3E4B5C" },
  { name: "Smart Home", emoji: "🏠", subcategories: ["Smart Lighting", "Security Systems", "Cleaning Robots"], path: "/all-products", id: "C3D6F2B7-7BBC-4B0A-8F5D-A2B3C4D5E6F7" },
  { name: "Baby & Kids", emoji: "👶", subcategories: ["Strollers", "Toys", "High Chairs"], path: "/all-products", id: "D4E7C3A8-3ABC-4EF5-9B6D-B3C2A1F4E5D6" },
  { name: "Phones", emoji: "📱", subcategories: ["iPhone", "Samsung", "Other Brands"], path: "/all-products", id: "E5F8D4B9-1DEF-4C65-9C7E-C4D5A6B7C8D9" },
];


const CategoriesBar = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    if (category.path) {
      navigate(`${category.path}?category=${category.id || 'all'}`);
    }
  };
  

  return (
    <div className="categories-container">
      {categories.map((category, index) => (
        <div 
          key={index}
          className="category-item"
          onMouseEnter={() => setActiveCategory(index)}
          onMouseLeave={() => setActiveCategory(null)}
          onClick={() => handleCategoryClick(category)}
        >
          <span className="category-emoji">{category.emoji}</span>
          <span className="category-name">{category.name}</span>
          
          {activeCategory === index && category.subcategories.length > 0 && (
            <div className="subcategories-dropdown">
              {category.subcategories.map((sub, i) => (
                <div key={i} className="subcategory-item">
                  {sub}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoriesBar;