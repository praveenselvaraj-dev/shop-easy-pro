import axios from "axios";

const authClient = axios.create({
  baseURL: "https://shop-easy-pro-api.onrender.com/api/v1/",
  withCredentials: true,
});

authClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default authClient;
