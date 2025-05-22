import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './AllProductsPage.css';
import Navbar from '../NavBar/NavBar';
import CategoriesBar from '../CategoriesBar/CategoriesBar';
import Footer from '../Footer/Footer';
import ProductCard from '../ProductCard/ProductCard';

const AllProductsPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOrder, setSortOrder] = useState('default');
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryId = queryParams.get("category");

    let url = '';
    if (categoryId && categoryId !== 'all') {
      url = `https://localhost:9001/api/v1/Category/filter-by-category?categoryId=${categoryId}&pageNumber=1&pageSize=100`;
    } else {
      url = 'https://localhost:9001/api/v1/Product';
    }

  setIsLoading(true);

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        const products = data?.data || [];
        setAllProducts(products);
        setFilteredProducts(products);
        setIsLoading(false)
      })
      .catch((err) => {
        console.error('Failed to fetch products:', err);
        setAllProducts([]);
        setFilteredProducts([]);
         setIsLoading(false);
      });
  }, [location.search]);

  useEffect(() => {
    let sorted = [...allProducts];

    if (sortOrder === 'priceAsc') {
      sorted.sort((a, b) => a.pricePerMonth - b.pricePerMonth);
    } else if (sortOrder === 'priceDesc') {
      sorted.sort((a, b) => b.pricePerMonth - a.pricePerMonth);
    } else if (sortOrder === 'nameAsc') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'nameDesc') {
      sorted.sort((a, b) => b.name.localeCompare(a.name));
    }

    setFilteredProducts(sorted);
  }, [sortOrder, allProducts]);

  return (
    <div className="all-products-page">
      <Navbar />
      <CategoriesBar />

      <div className="sort-bar">
        <label htmlFor="sort">Sort by: </label>
        <select
          id="sort"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="default">Default</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="nameAsc">Name: A to Z</option>
          <option value="nameDesc">Name: Z to A</option>
        </select>
      </div>

     <div className="product-grid">
  {isLoading ? (
    Array.from({ length: 8 }).map((_, index) => (
      <div key={index} className="product-skeleton">
        <div className="image-loading-placeholder"></div>
        <div className="name-loading-placeholder"></div>
        <div className="name-loading-placeholder" style={{ width: '60%' }}></div>
      </div>
    ))
  ) : filteredProducts.length === 0 ? (
    <p>No products found.</p>
  ) : (
    filteredProducts.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))
  )}
</div>
      <Footer />
    </div>
  );
};

export default AllProductsPage;
