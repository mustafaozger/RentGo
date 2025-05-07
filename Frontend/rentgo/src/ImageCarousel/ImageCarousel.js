import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ImageCarousel.css';
import s2 from '../assets/slides/2.svg';
import s3 from '../assets/slides/3.svg';
import s4 from '../assets/slides/4.webp';

const ImageCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  const navigate = useNavigate();

  const slides = [
    {
      image: s3 ,
      title: "IT FEELS LIKE YOURS WHEN YOU RENT FROM RENTGO",
      description: "Still undecided about purchasing that tech device? How about renting it and trying it out?",
      buttonText: "Rent Now"
    },
    {
      image: s4,
      title: "CHECK OUT THE NEW ARRIVALS NOW",
      description: "Highly requested and newly launched products have arrived at Rentgo. Rent or subscribe now, don’t miss the chance for fast delivery.",
      buttonText: "Explore Products"
    },
    {
      image: s2,
      title: "EXTEND YOUR RENTAL",
      description: "You can easily rent from anywhere in Türkiye.",
      buttonText: "Rent Now"
    },
  ];
  
  const handleButtonClick = () => {
    navigate('/all-products'); 
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="carousel-container">
      <div className="carousel">
        <div className="slide">
          <div className="text-content">
            <h2>{slides[currentSlide].title}</h2>
            <p>{slides[currentSlide].description}</p>
            <button className="cta-button"
                onClick={handleButtonClick}
                >
              {slides[currentSlide].buttonText}
            </button>
          </div>
          <div className="image-container">
            <img 
              src={slides[currentSlide].image} 
              alt={slides[currentSlide].title} 
              className="slide-image"
            />
          </div>
        </div>
      </div>
      <div className="indicators">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`indicator ${currentSlide === index ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;