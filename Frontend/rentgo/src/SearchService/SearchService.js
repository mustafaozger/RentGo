import axios from 'axios';

const API_BASE_URL = 'https://localhost:9001/api/v1';

export const searchService = {
  searchProducts: async (productName) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/Product/get-product-list-by-name`, {
        params: { ProductName: productName }
      });
      return response.data;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  }
};