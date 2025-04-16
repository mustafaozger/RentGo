import React, { useState } from 'react';
import './CategoriesBar.css';
import electronicsIcon from '../assets/icons/Smartphone.png'; 
import babyIcon from '../assets/icons/BabyBottle.png';

const categories = [
  { name: "Tüm Ürünler", icon: electronicsIcon, subcategories: [] },
  { 
    name: "Elektronik", 
    icon: electronicsIcon,
    subcategories: ["Telefon", "Laptop", "Tablet"]
  },
  { 
    name: "Bebek & Çocuk", 
    icon: babyIcon,
    subcategories: ["Bebek Arabası", "Oyuncak", "Mama Sandalyesi"]
  },
  { 
    name: "Bebek & Çocuk", 
    icon: babyIcon,
    subcategories: ["Bebek Arabası", "Oyuncak", "Mama Sandalyesi"]
  },
  { 
    name: "Bebek & Çocuk", 
    icon: babyIcon,
    subcategories: ["Bebek Arabası", "Oyuncak", "Mama Sandalyesi"]
  },
  { 
    name: "Bebek & Çocuk", 
    icon: babyIcon,
    subcategories: ["Bebek Arabası", "Oyuncak", "Mama Sandalyesi"]
  },
  { 
    name: "Bebek & Çocuk", 
    icon: babyIcon,
    subcategories: ["Bebek Arabası", "Oyuncak", "Mama Sandalyesi"]
  },
  { 
    name: "Bebek & Çocuk", 
    icon: babyIcon,
    subcategories: ["Bebek Arabası", "Oyuncak", "Mama Sandalyesi"]
  },
  { 
    name: "Bebek & Çocuk", 
    icon: babyIcon,
    subcategories: ["Bebek Arabası", "Oyuncak", "Mama Sandalyesi"]
  },
  { 
    name: "Bebek & Çocuk", 
    icon: babyIcon,
    subcategories: ["Bebek Arabası", "Oyuncak", "Mama Sandalyesi"]
  },
  { 
    name: "Bebek & Çocuk", 
    icon: babyIcon,
    subcategories: ["Bebek Arabası", "Oyuncak", "Mama Sandalyesi"]
  },
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
          <img src={category.icon} alt={category.name} className="category-icon" />
          <span>{category.name}</span>
          
          {activeCategory === index && category.subcategories.length > 0 && (
            <div className="subcategories-dropdown">
              {category.subcategories.map((sub, i) => (
                <div key={i} className="subcategory-item">{sub}</div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default CategoriesBar;