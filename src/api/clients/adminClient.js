import axios from "axios";
import { setupInterceptors } from "./Interceptors";
const adminClient = axios.create({
  baseURL: "http://127.0.0.1:8004/api/v1/admin",
  withCredentials: true,
});

setupInterceptors(adminClient);



export default adminClient;
