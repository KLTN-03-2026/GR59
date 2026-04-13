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
  rating: number;
  comment: string;
  images: string[];
  targetId?: string;
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

export const postReview = async (payload: ReviewPayload): Promise<AxiosResponse<BackendResponse<any>>> => {
  try {
    const response = await instance.post<BackendResponse<any>>("/reviews", payload);
    return response;
  } catch (error) {
    console.warn("Fake API fallback cho Reviews POST");
    return {
      data: {
        status: 201,
        message: "Đã giả lập gửi đánh giá thành công",
        data: { success: true },
      },
      status: 201,
      statusText: "CREATED",
      headers: {},
      config: {} as any,
    };
  }
};
