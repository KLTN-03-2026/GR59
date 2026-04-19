import type { AxiosResponse } from "axios";
import instance from "../utils/AxiosCustomize";
import type { BackendResponse } from "../types/backend";

export interface ReviewItem {
  id: number;
  userName: string;
  avatar: string;
  timeAgo: string;
  rating: number;
  comment: string;
}

export interface ReviewPayload {
  userId: number;
  hotelId?: number | null;
  restaurantId?: number | null;
  attractionId?: number | null;
  type: "HOTEL" | "RESTAURANT" | "ATTRACTION" | "WEBSITE" | "TRIP";
  rating: number;
  comment: string;
}

export interface BackendResponse<T = unknown> {
  status: number;
  message: string;
  data: T;
}

const MOCK_REVIEWS: ReviewItem[] = [
  {
    id: 1,
    userName: "Linh Nguyễn",
    avatar: "https://i.pravatar.cc/150?u=user1",
    timeAgo: "2 ngày trước",
    rating: 5,
    comment:
      "Chuyến đi thật tuyệt vời! Lịch trình rất hợp lý, tôi không cảm thấy quá mệt mỏi nhưng vẫn tham quan được nhiều địa điểm đẹp.",
  },
  {
    id: 2,
    userName: "Minh Trần",
    avatar: "https://i.pravatar.cc/150?u=user2",
    timeAgo: "1 tuần trước",
    rating: 4,
    comment:
      "Giá cả khá cạnh tranh so với mặt bằng chung. Hướng dẫn viên rất nhiệt tình và chu đáo với khách hàng.",
  },
  {
    id: 3,
    userName: "Minh Trần",
    avatar: "https://i.pravatar.cc/150?u=user2",
    timeAgo: "1 tuần trước",
    rating: 4,
    comment:
      "Giá cả khá cạnh tranh so với mặt bằng chung. Hướng dẫn viên rất nhiệt tình và chu đáo với khách hàng.",
  },
];

export const getReviews = async (): Promise<AxiosResponse<BackendResponse<ReviewItem[]>>> => {
  try {
    const response = await instance.get<BackendResponse<ReviewItem[]>>("/reviews");
    return response;
  } catch (error) {
    console.warn("Fake API fallback cho Reviews GET");
    return {
      data: {
        status: 200,
        message: "Lấy dữ liệu review mock thành công",
        data: MOCK_REVIEWS,
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };
  }
};

export const createReview = async (
  reviewData: ReviewPayload,
  imageFiles?: File[]
): Promise<AxiosResponse<BackendResponse<any>>> => {
  try {
    const formData = new FormData();
    
    // Tạo Blob cho phần JSON review để set Content-Type là application/json
    const reviewBlob = new Blob([JSON.stringify(reviewData)], {
      type: "application/json",
    });
    formData.append("review", reviewBlob);

    // Thêm các file ảnh nếu có
    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formData.append("imageFiles", file);
      });
    }

    const response = await instance.post<BackendResponse<any>>("/reviews", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response;
  } catch (error) {
    console.warn("Lỗi khi gửi đánh giá:", error);
    throw error;
  }
};

export const updateReview = async (
  id: number | string,
  reviewData: Partial<ReviewPayload>,
  imageFiles?: File[]
): Promise<AxiosResponse<BackendResponse<any>>> => {
  try {
    const formData = new FormData();
    const reviewBlob = new Blob([JSON.stringify(reviewData)], {
      type: "application/json",
    });
    formData.append("review", reviewBlob);

    if (imageFiles && imageFiles.length > 0) {
      imageFiles.forEach((file) => {
        formData.append("imageFiles", file);
      });
    }

    const response = await instance.put<BackendResponse<any>>(`/reviews/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response;
  } catch (error) {
    console.error("Lỗi khi cập nhật đánh giá:", error);
    throw error;
  }
};

export const getUserReviews = async (userId?: number): Promise<AxiosResponse<BackendResponse<any[]>>> => {
  try {
    const url = userId ? `/reviews/user/${userId}` : "/reviews/user";
    const response = await instance.get<BackendResponse<any[]>>(url);
    return response;
  } catch (error: any) {
    console.warn("Lấy review user thất bại (400 hoặc lỗi khác), chi tiết:", error.response?.data);
    return {
      data: {
        status: 200,
        message: "Sử dụng dữ liệu dự phòng",
        data: []
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any
    };
  }
};export const getReviewsByTarget = async (
  type: "restaurant" | "hotel" | "attraction",
  id: number | string,
  page = 0,
  size = 10
): Promise<AxiosResponse<BackendResponse<{ content: any[]; page: any }>>> => {
  try {
    const response = await instance.get<BackendResponse<{ content: any[]; page: any }>>(
      `/reviews/${type.toLowerCase()}/${id}?page=${page}&size=${size}`
    );
    return response;
  } catch (error) {
    console.warn(`Lấy review ${type} thất bại, dùng mock`);
    return {
      data: {
        status: 200,
        message: "Thành công",
        data: { content: MOCK_REVIEWS as any[], page: { totalPages: 1, totalElements: 3, size: 10, number: 0 } }
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any
    };
  }
};
