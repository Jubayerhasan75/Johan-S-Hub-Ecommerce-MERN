import { Product } from '../types';

/**
 * Fetch all products from the backend server (API_BASE_URL).
 */
export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await fetch("API_BASE_URL/api/products");

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();
    return data as Product[];
  
  } catch (error) {
    console.error("Error fetching products:", error);
    return []; 
  }
};

/**
 * Fetch a single product by id from the backend.
 * (Used by ProductDetailPage.tsx)
 */
export const fetchProductById = async (id: string): Promise<Product | null> => {
   try {
    const response = await fetch(`API_BASE_URL/api/products/${id}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch product (id: ${id}): ${response.statusText}`);
    }

    const data = await response.json();
    return data as Product;
  
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
}
