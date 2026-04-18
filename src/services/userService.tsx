import type { AxiosResponse } from "axios";
import instance from "../utils/AxiosCustomize";

// --- Interfaces ---
export interface UserData {
  id: number | string;
  username?: string;
  fullName?: string;
  email: string;
  password?: string;
  accessToken?: string;
  refreshToken?: string;
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
  status: number;
  message: string;
  data?: T;
  DT?: T;
}

// 1. Đăng ký (Thay API thật)
export const postSignUp = (
  username: string,
  email: string,
  pass: string,
): Promise<AxiosResponse<BackendResponse<AuthResponseData>>> => {
  return instance.post<BackendResponse<AuthResponseData>>(
    "/auth/register",
    {
      full_name: username,
      email: email,
      password: pass,
    },
  );
};

// 2. Đăng nhập (Thay API thật)
export const postLogin = (
  email: string,
  pass: string,
): Promise<AxiosResponse<BackendResponse<AuthResponseData>>> => {
  return instance.post<BackendResponse<AuthResponseData>>(
    "/auth/login",
    {
      email: email,
      password: pass,
    },
  );
};

// 3. Đăng nhập Google (Thay API thật)
export const postLoginGoogle = (
  token: string,
): Promise<AxiosResponse<BackendResponse<AuthResponseData>>> => {
  return instance.post<BackendResponse<AuthResponseData>>(
    "/auth/google",
    {
      token,
    },
  );
};

// 3.1. Đăng nhập Facebook
export const postLoginFacebook = (
  accessToken: string,
): Promise<AxiosResponse<BackendResponse<AuthResponseData>>> => {
  return instance.post<BackendResponse<AuthResponseData>>(
    "/auth/facebook",
    {
      accessToken,
    },
  );
};

// 4. Quên mật khẩu & Cập nhật mật khẩu mới (Đã chuẩn hóa Type)
export const updatePasswordByEmail = async (
  email: string,
  newPass: string,
): Promise<AxiosResponse<BackendResponse<UserData | null>>> => {
  const res = await instance.get<BackendResponse<UserData[]>>(
    `/users?email=${email}`,
  );
  const users = res.data.data;

  if (users && users.length > 0) {
    const user = users[0];
    return instance.patch<BackendResponse<UserData>>(`/users/${user.id}`, {
      password: newPass,
    });
  } else {
    return {
      data: {
        status: 404,
        message: "Email không tồn tại trên hệ thống!",
        data: null,
      },
    } as AxiosResponse<BackendResponse<null>>;
  }
};

// 5. Đăng xuất
export const postLogout = (
  refreshToken: string,
): Promise<AxiosResponse<BackendResponse<unknown>>> => {
  return instance.post<BackendResponse<unknown>>("/auth/logout", {
    refresh_token: refreshToken,
  });
};

// 6. Refresh Token
export const postRefreshToken = (
  refreshToken: string,
): Promise<AxiosResponse<BackendResponse<AuthResponseData>>> => {
  return instance.post<BackendResponse<AuthResponseData>>(
    "/auth/refresh-token",
    {
      refreshToken: refreshToken,
    },
  );
};

export interface SendOtpResponseData {
  expiresIn: number;
  email: string;
  status: string;
}

// 7. Gửi mã OTP
export const postSendOTP = (
  email: string,
): Promise<AxiosResponse<BackendResponse<SendOtpResponseData>>> => {
  return instance.post<BackendResponse<SendOtpResponseData>>(
    "/auth/send-otp",
    {
      email,
    },
  );
};

// 8. Xác minh OTP - Trả về BackendResponse chung hoặc cụ thể nếu cần
export const postVerifyOTP = (
  email: string,
  otp: number,
): Promise<AxiosResponse<BackendResponse<unknown>>> => {
  return instance.post<BackendResponse<unknown>>("/auth/verify-otp", {
    email,
    otp,
  });
};

// 9. Đặt lại mật khẩu mới sau khi OTP thành công
export const postResetPassword = (
  email: string,
  newPass: string,
): Promise<AxiosResponse<BackendResponse<unknown>>> => {
  return instance.post<BackendResponse<unknown>>(
    "/auth/reset-password-otp",
    {
      email: email,
      new_password: newPass,
    },
  );
};
