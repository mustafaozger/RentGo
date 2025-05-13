import axios from 'axios';
import AuthUtils from '../authUtils/authUtils';

const API_URL = 'https://localhost:9001/api/v1/Cart';

const getCart = async () => {
  const cartId = localStorage.getItem('cartId');
  const response = await axios.get(`${API_URL}/${cartId}`, {
    headers: { Authorization: `Bearer ${AuthUtils.getToken()}` },
  });
  return response.data;
};

const addToCart = async (product, durationType, duration, totalPrice) => {
  const payload = {
    cartId: localStorage.getItem('cartId'),
    productId: product.id,
    rentalPeriodType: durationType,
    rentalDuration: duration,
    totalPrice,
  };
  const response = await axios.post(`${API_URL}/add-item-with-cart-id`, payload, {
    headers: { Authorization: `Bearer ${AuthUtils.getToken()}` },
  });
  return response.data;
};

const removeFromCart = async (cartItemId) => {
  const response = await axios.delete(`${API_URL}/remove-item`, {
    headers: { Authorization: `Bearer ${AuthUtils.getToken()}` },
    data: { cartItemId },
  });
  return response.data;
};

const updateCartItem = async (cartItemId, newRentalPeriodType, newRentalDuration) => {
  const payload = {
    cartItemId,
    rentalPeriodType: newRentalPeriodType,
    newRentalDuration,
  };
  const response = await axios.put(`${API_URL}/update-item`, payload, {
    headers: { Authorization: `Bearer ${AuthUtils.getToken()}` },
  });
  return response.data;
};

export default { getCart, addToCart, removeFromCart, updateCartItem };
