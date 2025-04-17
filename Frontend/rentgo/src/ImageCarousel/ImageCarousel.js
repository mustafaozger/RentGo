import React, { useState, useEffect } from 'react';
import './ImageCarousel.css';
import slide1 from '../assets/slides/slide1.jpg';
import slide2 from '../assets/slides/slide2.jpg';

const ImageCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      image: slide1,
      title: "THE ERA OF ELECTRONICS RENTAL BEGINS",
      description: "Rent the electronic device you need and use it for your specified period."
    },
    {
      image: slide2,
      title: "CAMPAIGN PRODUCTS",
      description: "Rental products at special prices"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="carousel">
      <div className="slide" style={{ backgroundImage: `url(${slides[currentSlide].image})` }}>
        <div className="slide-content">
          <h2>{slides[currentSlide].title}</h2>
          <p>{slides[currentSlide].description}</p>
          <button className="cta-button">Rent Now</button>
        </div>
      </div>
    </div>
  );
};

export default ImageCarousel;