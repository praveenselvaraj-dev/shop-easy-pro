import axios from "axios";
import { setupInterceptors } from "./Interceptors";
const profileClient = axios.create({
  baseURL: "https://shop-easy-pro-api.onrender.com/api/v1/",
  withCredentials: true,
  timeout:8000
});

setupInterceptors(profileClient);

export default profileClient;
