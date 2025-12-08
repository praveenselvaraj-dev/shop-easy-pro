import axios from "axios";
import { setupInterceptors } from "./Interceptors";
const adminClient = axios.create({
  baseURL: "https://shop-easy-pro-api-admin.onrender.com/api/v1/admin",
  withCredentials: true,
});

setupInterceptors(adminClient);

export default adminClient;
