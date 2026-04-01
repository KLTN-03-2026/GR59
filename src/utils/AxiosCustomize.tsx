/*  import axios, { AxiosError } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

NProgress.configure({ showSpinner: false, trickleSpeed: 100 });

const instance = axios.create({
  baseURL: "http://localhost:8081/",
});

// Interceptor cho Request
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    NProgress.start();
    const token = localStorage.getItem("access_token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    NProgress.done();
    return Promise.reject(error);
  },
);

// Interceptor cho Response
instance.interceptors.response.use(
  (response) => {
    NProgress.done();
    // Bạn có thể trả về response.data luôn để ở Component code ngắn hơn
    return response.data;
  },
  (error: AxiosError) => {
    NProgress.done();

    // Ví dụ: Tự động xử lý lỗi 401
    if (error.response?.status === 401) {
      // localStorage.removeItem("access_token");
      // window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export default instance;
 */

import axios from "axios";
import type {
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// 1. Định nghĩa Interface cho cấu trúc bạn muốn trả về
// Thay vì dùng 'any', ta dùng 'unknown' hoặc Generic <T> để an toàn hơn
interface BackendResponse<T = unknown> {
  EC: number;
  EM: string;
  DT: T;
}

NProgress.configure({ showSpinner: false, trickleSpeed: 100 });

const instance = axios.create({
  baseURL: "http://localhost:8081/",

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
  (response: AxiosResponse): AxiosResponse<BackendResponse> => {
    NProgress.done();

    // Bọc dữ liệu MockAPI vào cấu trúc chuẩn
    const customRes: BackendResponse = {
      EC: 0,
      EM: "Success",
      DT: response.data,
    };

    // Ép kiểu qua 'unknown' trước khi ép về kiểu đích để tránh lỗi linter
    // Cách này an toàn hơn 'as any' rất nhiều
    return {
      ...response,
      data: customRes,
    } as unknown as AxiosResponse<BackendResponse>;
  },
  (error: AxiosError) => {
    NProgress.done();
    return Promise.reject(error);
  },
);

export default instance;
