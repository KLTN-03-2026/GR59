import type { AxiosResponse } from "axios";
import instance from "../utils/AxiosCustomize";

// --- Interfaces ---
export interface SavedTrip {
  id: number | string;
  title: string;
  image: string;
  timeAgo: string;
}

export interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  avatar: string;
  cover: string;
  badge: string;
  joinDate: string;
  location: string;
  savedTrips?: SavedTrip[];
}

export interface BackendResponse<T = unknown> {
  EC: number;
  EM: string;
  DT: T;
}

export interface ChangePasswordData {
  currentPassword?: string;
  newPassword?: string;
}

// Lấy thông tin profile
export const getProfile = (): Promise<
  AxiosResponse<BackendResponse<ProfileData>>
> => {
  return instance.get<BackendResponse<ProfileData>>("/profile");
};
// Cập nhật thông tin profile
export const updateProfile = (
  data: Partial<ProfileData>,
): Promise<AxiosResponse<BackendResponse<ProfileData>>> => {
  return instance.patch<BackendResponse<ProfileData>>("/profile", data);
};

// Đổi mật khẩu
export const changePassword = (
  data: ChangePasswordData,
): Promise<AxiosResponse<BackendResponse<unknown>>> => {
  return instance.post<BackendResponse<unknown>>("/auth/change-password", data);
};

// Lấy danh sách các chuyến đi đã lưu
export const getSavedTrips = (): Promise<
  AxiosResponse<BackendResponse<SavedTrip[]>>
> => {
  return instance.get<BackendResponse<SavedTrip[]>>("/saved_trips");
};

// Thêm một chuyến đi vào danh sách đã lưu
export const addSavedTrip = (
  tripData: SavedTrip,
): Promise<AxiosResponse<BackendResponse<SavedTrip>>> => {
  return instance.post<BackendResponse<SavedTrip>>("/saved_trips", tripData);
};

// Xóa một chuyến đi khỏi danh sách đã lưu
export const removeSavedTrip = (
  tripId: number | string,
): Promise<AxiosResponse<BackendResponse<object>>> => {
  return instance.delete<BackendResponse<object>>(`/saved_trips/${tripId}`);
};
