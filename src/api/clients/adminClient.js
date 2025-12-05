import axios from "axios";

const adminClient = axios.create({
  baseURL: "http://127.0.0.1:8004/api/v1/admin",
  withCredentials: true,
});

adminClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default adminClient;
