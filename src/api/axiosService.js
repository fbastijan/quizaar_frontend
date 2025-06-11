import axios from "axios";
import $router from "@/router";
import auth from "@/api/account.api.js";
const baseURL = "http://localhost:4000/api/";
let Service = axios.create({
  baseURL: baseURL,
  timeout: 10000000,
  withCredentials: true,
});

import {toast} from "vue-sonner";
Service.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status == 401|| error.response.status == 403) {
      toast.error("You are not authorized! Please log in to continue.", {
        duration: 2000,   
      });
        auth.logOut();
      $router.go();
    }
    // console.error('Interceptor', error.response);
  }
);
export {Service, baseURL};