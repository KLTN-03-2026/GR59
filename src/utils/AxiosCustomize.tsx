

import axios from "axios";
import type {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";



NProgress.configure({ showSpinner: false, trickleSpeed: 100 });

const instance = axios.create({
  baseURL: "http://localhost:8888",
});

instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    NProgress.start();
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    NProgress.done();
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    NProgress.done();

    // BE thật đã trả về cấu trúc { EC, EM, DT } nên ta trả về nguyên bản response.
    // Dữ liệu { EC, EM, DT } sẽ nằm trong res.data
    return response;
  },
  (error: AxiosError) => {
    NProgress.done();
    return Promise.reject(error);
  },
);

export default instance;
