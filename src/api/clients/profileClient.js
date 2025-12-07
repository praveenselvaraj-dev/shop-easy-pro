import axios from "axios";
import { setupInterceptors } from "./Interceptors";
const profileClient = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1/",
  withCredentials: true,
  timeout:8000
});

setupInterceptors(profileClient);

export default profileClient;
