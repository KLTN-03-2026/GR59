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
  status: number;
  message: string;
  data?: T;
  DT?: T;
}

export interface ChangePasswordData {
  currentPassword?: string;
  newPassword?: string;
}

const MOCK_PROFILE: ProfileData = {
  name: "Hồ Thế Anh",
  email: "anh.ho@example.com",
  phone: "+84 901 234 567",
  address: "Quận 1, TP. Hồ Chí Minh, Việt Nam",
  bio: "Đam mê du lịch bụi và khám phá những vùng đất mới lạ. Luôn tìm kiếm những trải nghiệm địa phương chân thực.",
  avatar: "https://i.pravatar.cc/150?u=qlong",
  cover: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop",
  badge: "Thành viên Vàng",
  joinDate: "01/2023",
  location: "TP. Hồ Chí Minh, VN",
};

const MOCK_SAVED_TRIPS: SavedTrip[] = [
  {
    "id": "1",
    "title": "Phố cổ Hội An",
    "image": "https://images.unsplash.com/photo-1555921015-5532091f6026?auto=format&fit=crop&q=80&w=800",
    "timeAgo": "Vừa xong"
  }
];

// Lấy thông tin profile
export const getProfile = async (): Promise<
  AxiosResponse<BackendResponse<ProfileData>>
> => {
  try {
    return await instance.get<BackendResponse<ProfileData>>("/profile");
  } catch (error) {
    console.warn("Fake API fallback cho Profile GET");
    return {
      data: { status: 200, message: "Mock data", DT: MOCK_PROFILE, data: MOCK_PROFILE },
      status: 200, statusText: "OK", headers: {}, config: {} as any
    };
  }
};
// Cập nhật thông tin profile
export const updateProfile = async (
  data: Partial<ProfileData>,
): Promise<AxiosResponse<BackendResponse<ProfileData>>> => {
  try {
    return await instance.patch<BackendResponse<ProfileData>>("/profile", data);
  } catch (error) {
    console.warn("Fake API fallback cho Profile PATCH");
    return {
      data: { status: 200, message: "Mock data success", DT: { ...MOCK_PROFILE, ...data }, data: { ...MOCK_PROFILE, ...data } },
      status: 200, statusText: "OK", headers: {}, config: {} as any
    };
  }
};

// Đổi mật khẩu
export const changePassword = async (
  data: ChangePasswordData,
): Promise<AxiosResponse<BackendResponse<unknown>>> => {
  try {
    return await instance.post<BackendResponse<unknown>>("/auth/change-password", data);
  } catch (error) {
    console.warn("Fake API fallback cho Change Password");
    return {
      data: {
        status: 200,
        message: "Đổi mật khẩu giả lập thành công",
        DT: null,
        data: null,
      },
      status: 200, statusText: "OK", headers: {}, config: {} as any
    };
  }
};

// Lấy danh sách các chuyến đi đã lưu
export const getSavedTrips = async (): Promise<
  AxiosResponse<BackendResponse<SavedTrip[]>>
> => {
  try {
    return await instance.get<BackendResponse<SavedTrip[]>>("/saved_trips");
  } catch (error) {
    console.warn("Fake API fallback cho Saved Trips GET");
    return {
      data: { status: 200, message: "Mock data", DT: MOCK_SAVED_TRIPS, data: MOCK_SAVED_TRIPS },
      status: 200, statusText: "OK", headers: {}, config: {} as any
    };
  }
};

// Thêm một chuyến đi vào danh sách đã lưu
export const addSavedTrip = async (
  tripData: SavedTrip,
): Promise<AxiosResponse<BackendResponse<SavedTrip>>> => {
  try {
    return await instance.post<BackendResponse<SavedTrip>>("/saved_trips", tripData);
  } catch (error) {
    console.warn("Fake API fallback cho Saved Trips POST");
    return {
      data: { status: 201, message: "Đã lưu chuyến đi thành công (giả lập)", DT: tripData, data: tripData },
      status: 201, statusText: "Created", headers: {}, config: {} as any
    };
  }
};

// Xóa một chuyến đi khỏi danh sách đã lưu
export const removeSavedTrip = async (
  tripId: number | string,
): Promise<AxiosResponse<BackendResponse<object>>> => {
  try {
    return await instance.delete<BackendResponse<object>>(`/saved_trips/${tripId}`);
  } catch (error) {
    console.warn("Fake API fallback cho Saved Trips DELETE");
    return {
      data: { status: 200, message: "Đã bỏ lưu chuyến đi thành công (giả lập)", DT: {}, data: {} },
      status: 200, statusText: "OK", headers: {}, config: {} as any
    };
  }
};
