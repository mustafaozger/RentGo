import React, { useState } from 'react';
import './CategoriesBar.css';

const categories = [
  { 
    name: "All Products", 
    emoji: "📦",
    subcategories: [] 
  },
  { 
    name: "Personal Care", 
    emoji: "💄",
    subcategories: ["Hair Care", "Skin Care", "Oral Care"] 
  },
  { 
    name: "Hobbies & Games", 
    emoji: "🎮",
    subcategories: ["Musical Instruments", "Sports Equipment", "Gaming Consoles"]
  },
  { 
    name: "Smart Home", 
    emoji: "🏠",
    subcategories: ["Smart Lighting", "Security Systems", "Cleaning Robots"]
  },
  { 
    name: "Baby & Kids", 
    emoji: "👶",
    subcategories: ["Strollers", "Toys", "High Chairs"]
  },
  { 
    name: "Phones", 
    emoji: "📱",
    subcategories: ["iPhone", "Samsung", "Other Brands"]
  },
  { 
    name: "Tablets & Laptops", 
    emoji: "💻",
    subcategories: ["iPad", "MacBook", "Windows Laptops"]
  },
  { 
    name: "Smart Watches", 
    emoji: "⌚",
    subcategories: ["Apple Watch", "Samsung Gear", "Fitbit"]
  },
  { 
    name: "Campaigns", 
    emoji: "🏷️",
    subcategories: ["Weekly Deals", "Special Discounts", "Product Bundles"]
  }
];

const CategoriesBar = () => {
  const [activeCategory, setActiveCategory] = useState(null);

  return (
    <div className="categories-container">
      {categories.map((category, index) => (
        <div 
          key={index}
          className="category-item"
          onMouseEnter={() => setActiveCategory(index)}
          onMouseLeave={() => setActiveCategory(null)}
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