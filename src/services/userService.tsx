import type { AxiosResponse } from "axios";
import instance from "../utils/AxiosCustomize";

// --- Interfaces ---
export interface UserData {
  id: number | string;
  username?: string; // Tạm giữ lại nếu nơi khác đang cần
  fullName?: string;
  email: string;
  password?: string;
  accessToken?: string;
  createdAt?: string;
  role?: string;
  status?: string;
  avatarUrl?: string | null;
  isActive?: boolean;
}

export interface AuthResponseData {
  accessToken: string;
  refreshToken: string;
  type: string | null;
  user: UserData;
}

export interface BackendResponse<T = unknown> {
  EC: number;
  EM: string;
  DT: T;
}

// 1. Đăng ký (Thay API thật)
export const postSignUp = (
  username: string, // thực chất đây là full name người dùng nhập
  email: string,
  pass: string,
): Promise<AxiosResponse<BackendResponse<AuthResponseData>>> => {
  return instance.post<BackendResponse<AuthResponseData>>("/api/v1/auth/register", {
    full_name: username, // Sửa lại thành full_name như Postman yêu cầu
    email: email,
    password: pass,
  });
};

// 2. Đăng nhập (Thay API thật)
export const postLogin = (
  email: string,
  pass: string,
): Promise<AxiosResponse<BackendResponse<AuthResponseData>>> => {
  return instance.post<BackendResponse<AuthResponseData>>("/api/v1/auth/login", {
    email: email,
    password: pass,
  });
};

// 3. Đăng nhập Google (Thay API thật)
export const postLoginGoogle = (
  token: string,
): Promise<AxiosResponse<BackendResponse<AuthResponseData>>> => {
  return instance.post<BackendResponse<AuthResponseData>>("/api/v1/auth/google", {
    token, // Send token in the body (the backend accepts access_token payload now)
  });
};

// 3.1. Đăng nhập Facebook
export const postLoginFacebook = (
  accessToken: string,
): Promise<AxiosResponse<BackendResponse<AuthResponseData>>> => {
  return instance.post<BackendResponse<AuthResponseData>>("/api/v1/auth/facebook", {
    accessToken,
  });
};

// 4. Quên mật khẩu & Cập nhật mật khẩu mới (Đã chuẩn hóa Type)
export const updatePasswordByEmail = async (
  email: string,
  newPass: string,
): Promise<AxiosResponse<BackendResponse<UserData | null>>> => {
  // B1: Tìm user theo email
  const res = await instance.get<BackendResponse<UserData[]>>(
    `/users?email=${email}`,
  );
  const users = res.data.DT;

  if (users && users.length > 0) {
    const user = users[0];
    // B2: Cập nhật mật khẩu mới qua PATCH (chỉ ghi đè trường password)
    return instance.patch<BackendResponse<UserData>>(`/users/${user.id}`, {
      password: newPass,
    });
  } else {
    // Trả về lỗi theo format chuẩn để FE dễ xử lý toast
    return {
      data: {
        EC: -1,
        EM: "Email không tồn tại trên hệ thống!",
        DT: null,
      },
    } as AxiosResponse<BackendResponse<null>>;
  }
};

// 5. Đăng xuất
export const postLogout = (): Promise<AxiosResponse<BackendResponse<unknown>>> => {
  return instance.post<BackendResponse<unknown>>("/api/v1/auth/logout");
};

// 6. Refresh Token
export const postRefreshToken = (
  refreshToken: string,
): Promise<AxiosResponse<BackendResponse<AuthResponseData>>> => {
  return instance.post<BackendResponse<AuthResponseData>>(
    "/api/v1/auth/refresh-token",
    {
      refreshToken: refreshToken,
    },
  );
};
// 7. Gửi mã OTP
export const postSendOTP = (
  email: string,
): Promise<AxiosResponse<BackendResponse<unknown>>> => {
  return instance.post<BackendResponse<unknown>>("/api/v1/auth/send-otp", {
    email,
  });
};

// 8. Xác minh OTP
export const postVerifyOTP = (
  email: string,
  otp: string,
): Promise<AxiosResponse<BackendResponse<unknown>>> => {
  return instance.post<BackendResponse<unknown>>("/api/v1/auth/verify-email", {
    email,
    otp, // Gửi otp lên BE xác minh
  });
};

