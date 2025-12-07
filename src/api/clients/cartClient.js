import axios from "axios";
import { setupInterceptors } from "./Interceptors";
const cartClient = axios.create({
  baseURL: "http://127.0.0.1:8002/api/v1/",
  withCredentials: true,
  timeout: 8000
});

setupInterceptors(cartClient);


export default cartClient;
