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
  baseURL: "http://localhost:8888/api/v1/",
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

    // BE trả về cấu trúc { status, message, data }
    return response;
  },
  async (error: AxiosError) => {
    NProgress.done();

    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Nếu lỗi 401 (Unauthorized) và chưa thử retry lần nào
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (refreshToken) {
        try {
          // Gọi API refresh token trực tiếp
          const res = await axios.post("http://localhost:8888/api/v1/auth/refresh-token", {
            refreshToken: refreshToken,
          });

          if (res.data && res.data.status === 200) {
            const data = res.data.data;

            // Cập nhật token mới vào storage
            if (data.accessToken) localStorage.setItem("token", data.accessToken);
            if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);

            // Gắn token mới vào header của request cũ và chạy lại
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
            }
            return instance(originalRequest);
          }
        } catch (refreshError) {
          // Nếu Refresh Token cũng hết hạn -> Logout sạch sẽ
          console.error("Refresh token failed:", refreshError);
          localStorage.clear();
          window.location.href = "/auth?mode=login";
          return Promise.reject(refreshError);
        }
      } else {
        // Không có refresh token -> Redirect về đăng nhập
        localStorage.clear();
        window.location.href = "/auth?mode=login";
      }
    }

    return Promise.reject(error);
  },
);

export default instance;
