import { Product } from '../types';
import { API_BASE_URL } from '../constants'; // <-- Import kora

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    // --- SHOTHIK FIX: Ekhane Backticks (``) Use Kora Hoyeche ---
    const response = await fetch(`${API_BASE_URL}/api/products`);
    
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return []; // Error hole empty array pathano
  }
};