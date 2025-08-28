import axios from "axios";
import { API_URL } from "@/utils/constants";

const axiosInstance = axios.create({
  baseURL: API_URL,
});

export default axiosInstance;
