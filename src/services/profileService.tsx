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
  fullName: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  avatar_url: string;
  cover_url: string;
  badge: string;
  joinDate: string;
  location: string;
  savedTrips?: SavedTrip[];
}

export interface BackendResponse<T = unknown> {
  status: number;
  message: string;
  data?: T;
  DT?: T;
}

export interface ChangePasswordData {
  old_password: string;
  new_password: string;
  confirm_password: string;
}

const MOCK_SAVED_TRIPS: SavedTrip[] = [
  {
    id: "1",
    title: "Phố cổ Hội An",
    image:
      "https://images.unsplash.com/photo-1555921015-5532091f6026?auto=format&fit=crop&q=80&w=800",
    timeAgo: "Vừa xong",
  },
];

export const getProfile = async (): Promise<
  AxiosResponse<BackendResponse<ProfileData>>
> => {
  return await instance.get<BackendResponse<ProfileData>>("/users/profile");
};

// cập nhật thông tin cá nhân
export const updateProfile = async (
  data: Partial<ProfileData>,
): Promise<AxiosResponse<BackendResponse<ProfileData>>> => {
  return await instance.patch<BackendResponse<ProfileData>>(
    "/users/update-profile",
    data,
  );
};

export const uploadImage = async (
  file: File,
): Promise<AxiosResponse<BackendResponse<{ imageUrl: string }>>> => {
  const formData = new FormData();
  formData.append("file", file);
  return await instance.post<BackendResponse<{ imageUrl: string }>>(
    "/users/avatar",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
};

export const changePassword = async (
  data: ChangePasswordData,
): Promise<AxiosResponse<BackendResponse<unknown>>> => {
  return await instance.post<BackendResponse<unknown>>(
    "/users/change-password",
    data,
  );
};

// Lấy danh sách các chuyến đi đã lưu
export const getSavedTrips = async (): Promise<
  AxiosResponse<BackendResponse<SavedTrip[]>>
> => {
  try {
    return await instance.get<BackendResponse<SavedTrip[]>>("/saved_trips");
  } catch {
    console.warn("Fake API fallback cho Saved Trips GET");
    return {
      data: {
        status: 200,
        message: "Mock data",
        DT: MOCK_SAVED_TRIPS,
        data: MOCK_SAVED_TRIPS,
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as AxiosResponse<unknown>["config"],
    };
  }
};

// Thêm một chuyến đi vào danh sách đã lưu
export const addSavedTrip = async (
  tripData: SavedTrip,
): Promise<AxiosResponse<BackendResponse<SavedTrip>>> => {
  try {
    return await instance.post<BackendResponse<SavedTrip>>(
      "/saved_trips",
      tripData,
    );
  } catch {
    console.warn("Fake API fallback cho Saved Trips POST");
    return {
      data: {
        status: 201,
        message: "Đã lưu chuyến đi thành công (giả lập)",
        DT: tripData,
        data: tripData,
      },
      status: 201,
      statusText: "Created",
      headers: {},
      config: {} as AxiosResponse<unknown>["config"],
    };
  }
};

// Xóa một chuyến đi khỏi danh sách đã lưu
export const removeSavedTrip = async (
  tripId: number | string,
): Promise<AxiosResponse<BackendResponse<object>>> => {
  try {
    return await instance.delete<BackendResponse<object>>(
      `/saved_trips/${tripId}`,
    );
  } catch {
    console.warn("Fake API fallback cho Saved Trips DELETE");
    return {
      data: {
        status: 200,
        message: "Đã bỏ lưu chuyến đi thành công (giả lập)",
        DT: {},
        data: {},
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as AxiosResponse<unknown>["config"],
    };
  }
};
