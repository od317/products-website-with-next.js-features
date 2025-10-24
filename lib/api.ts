// lib/api.ts

export const API_BASE_URL = "https://dummyjson.com";

export const API_ENDPOINTS = {
  PRODUCTS: `${API_BASE_URL}/products`,
  PRODUCT: (id: string) => `${API_BASE_URL}/products/${id}`,
  PRODUCTS_SEARCH: (query: string) =>
    `${API_BASE_URL}/products/search?q=${query}`,
  CATEGORIES: `${API_BASE_URL}/products/categories`,
};
