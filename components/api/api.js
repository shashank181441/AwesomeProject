import axios from 'axios';

// const baseURL = import.meta.env.VITE_API_URL;
// const baseURL = 'http://localhost:8001/api/v1';
const baseURL = "https://vendingao-api.xyz/api/v1"

// let machineId = localStorage.getItem("machineId") || "66d80057da82f664156f58b0";
export let machineId = "66d72290ee1e0a2dabce6069";

const apiClient = axios.create({
  baseURL,
});


// Cart Operations
  export const addToCart = async (productId) => {
    let cartData = {}
    cartData.machineId = machineId; // Ensure machineId is included
    return await apiClient.post(`/carts/${productId}`, cartData);
  };

  // export const addAllToCart = async () => {
  //   const cart = JSON.parse(localStorage.getItem('cart')) || [];
  
  //   if (!cart.length || !machineId) {
  //     return;
  //   }

  //   return  await apiClient.post('/carts/allToCart', {
  //       machineId,
  //       cartItems: cart,
  //     });
  // };
  
  export const addToCartByPN = async (productNumber) => {
    let cartData = {}
    cartData.machineId = machineId; // Ensure machineId is included
    return await apiClient.post(`/carts/productNumber/${productNumber}/?machineId=${machineId}`, cartData);
  };
  
  export const getCartItems = async () => {
    return await apiClient.get(`/carts?machineId=${machineId}`); // Include machineId in the request
  };
  
  export const removeCartItem = async (cartItemId) => {
    return await apiClient.delete(`/carts/${cartItemId}?machineId=${machineId}`); // Include machineId in the request
  };
  
  export const clearCart = async () => {
    return await apiClient.delete(`/carts/${machineId}/clear`);
  };
  
  export const getUnpaidCartsByMachine = async () => {
    return await apiClient.get(`/carts/unpaid?machineId=${machineId}`); // Include machineId in the request
  };

  export const getPaidCartsByMachine = async (machineIdy) => {
    return await apiClient.get(`/carts/paid/${machineIdy}`); // Include machineId in the request
  };

  export const updateCartItem = async (cartItemId, quantity)=>{
    return await apiClient.patch(`/carts/${cartItemId}`, {quantity})
  }
  
  // Payment Operations
  export const initiatePayment = async () => {
    let paymentData = {}
    paymentData.machineId = machineId; // Ensure machineId is included
    return await apiClient.post("/payments/", {machineId});
  };
  
  export const finalizePayment = async () => {
    // paymentData.machineId = machineId; // Ensure machineId is included
    return await apiClient.post("/payments/finalize", {machineId});
  };
  
  // Product Operations  
  
  export const getProducts = async (machineIdy=machineId) => {
    return await apiClient.get(`/products?machineId=${machineIdy}`); // Include machineId in the request
  };

  export const fillStock = async (productId)=>{
    return await apiClient.post(`/products/fillStock/${productId}`, {})
  }
  
  export const updateProduct = async (productId, newVal) => {
    console.log(newVal)
    return await apiClient.patch(`/products/${productId}`, {stock: newVal});
  };