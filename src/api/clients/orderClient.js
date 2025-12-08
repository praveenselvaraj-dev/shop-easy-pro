// src/api/orderClient.js
import axios from "axios";

const orderClient = axios.create({
  baseURL: "https://shop-easy-pro-api-order.onrender.com/api/v1/",
  withCredentials: true,
});

// ----------- REQUEST INTERCEPTOR -----------
orderClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ----------- RESPONSE INTERCEPTOR -----------
orderClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If backend sends token expired or unauthorized
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");   // remove invalid token
      window.location.href = "/login";    // redirect to login
    }

    return Promise.reject(error);
  }
);

export default orderClient;
