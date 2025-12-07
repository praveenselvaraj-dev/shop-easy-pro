import axios from "axios";
import { setupInterceptors } from "./Interceptors";
const cartClient = axios.create({
  baseURL: "https://shop-easy-pro-api-cart.onrender.com/api/v1/",
  withCredentials: true,
  timeout: 8000
});

setupInterceptors(cartClient);


export default cartClient;
