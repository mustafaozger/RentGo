import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './CategoriesBar.css';

const categories = [
  { 
    name: "All Products", 
    emoji: "📦",
    subcategories: [], 
    path: "/all-products",
  },
  { 
    name: "Personal Care", 
    emoji: "💄",
    subcategories: ["Hair Care", "Skin Care", "Oral Care"] ,
    path: "/all-products",
  },
  { 
    name: "Hobbies & Games", 
    emoji: "🎮",
    subcategories: ["Musical Instruments", "Sports Equipment", "Gaming Consoles"],
    path: "/all-products"
  },
  { 
    name: "Smart Home", 
    emoji: "🏠",
    subcategories: ["Smart Lighting", "Security Systems", "Cleaning Robots"],
    path: "/all-products"
  },
  { 
    name: "Baby & Kids", 
    emoji: "👶",
    subcategories: ["Strollers", "Toys", "High Chairs"],
    path: "/all-products"
  },
  { 
    name: "Phones", 
    emoji: "📱",
    subcategories: ["iPhone", "Samsung", "Other Brands"],
    path: "/all-products"
  },
  { 
    name: "Tablets & Laptops", 
    emoji: "💻",
    subcategories: ["iPad", "MacBook", "Windows Laptops"],
    path: "/all-products"
  },
  { 
    name: "Smart Watches", 
    emoji: "⌚",
    subcategories: ["Apple Watch", "Samsung Gear", "Fitbit"],
    path: "/all-products"
  },
  { 
    name: "Campaigns", 
    emoji: "🏷️",
    subcategories: ["Weekly Deals", "Special Discounts", "Product Bundles"],
    path: "/all-products"
  }
];

const CategoriesBar = () => {
  const [activeCategory, setActiveCategory] = useState(null);
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    if (category.path) {
      navigate(category.path); 
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