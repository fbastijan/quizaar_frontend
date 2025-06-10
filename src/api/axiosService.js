import axios from "axios";

const baseURL = "http://localhost:4000/api/";
let Service = axios.create({
  baseURL: baseURL,
  timeout: 10000000,
  withCredentials: true,
});
Service.interceptors.response.use(
  response => response,
  async (error) => {
    if (error.response?.status === 401) {
        localStorage.removeItem("token") // Handle logout
      }
    return Promise.reject(error);
  }
);
export {Service, baseURL};