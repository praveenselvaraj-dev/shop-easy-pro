// src/api/clients/productClient.js
import axios from "axios";
import { setupInterceptors } from "./Interceptors";
const productClient = axios.create({
  baseURL: "https://shop-easy-pro-api-product.onrender.com/api/v1/",
  timeout: 8000
});

setupInterceptors(productClient);
// // Attach token automatically
// productClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// // Auto logout & redirect if token expired
// productClient.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response?.status === 401) {
//       localStorage.removeItem("token");
//       window.location.href = "/login"; // redirect
//     }
//     return Promise.reject(err);
//   }
// );

export default productClient;
