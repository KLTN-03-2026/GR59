import type { AxiosResponse } from "axios";
import instance from "../utils/AxiosCustomize";

// --- Interfaces ---
export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  initial: string;
  color: string;
  text: string;
  delay: string;
}

export interface BackendReview {
  id: number;
  userId: number;
  hotelId: number | null;
  restaurantId: number | null;
  attractionId: number | null;
  type: "HOTEL" | "RESTAURANT" | "ATTRACTION";
  rating: number;
  comment: string;
  isVerified: boolean;
  createdAt: string;
  user?: {
    fullName: string;
    avatar: string | null;
  } | null;
}

export interface PaginatedData<T> {
  content: T[];
  page: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
}

export interface BackendResponse<T = unknown> {
  status: number;
  message: string;
  data?: T;
  DT?: T;
}

const COLORS = ["bgBlue", "bgGreen", "bgPurple", "bgOrange", "bgRed"];

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const mapBackendToTestimonial = (review: BackendReview, index: number): TestimonialItem => {
  const hasUser = !!review.user;
  const name = review.user?.fullName || (hasUser ? "BE đang thiếu fullName" : "BE đang thiếu thông tin User");
  const role = review.type === "HOTEL" ? "Khách lưu trú" : review.type === "RESTAURANT" ? "Thực khách" : "Khách tham quan";
  
  return {
    id: review.id.toString(),
    name: name,
    role: role,
    initial: review.user?.fullName ? getInitials(review.user.fullName) : "BE",
    color: COLORS[index % COLORS.length],
    text: review.comment || "BE đang thiếu nội dung comment",
    delay: ((index % 3) * 200 + 100).toString()
  };
};

/**
 * Lấy danh sách đánh giá khách hàng từ API thật
 */
export const getTestimonials = async (page = 0, size = 6): Promise<AxiosResponse<BackendResponse<PaginatedData<TestimonialItem>>>> => {
  const response = await instance.get<BackendResponse<PaginatedData<BackendReview>>>(`/reviews?page=${page}&size=${size}`);
  
  // Chúng ta ánh xạ sang TestimonialItem ngay tại đây để UI sử dụng luôn
  const rawData = response.data.data;
  let mappedContent: TestimonialItem[] = [];
  
  if (rawData?.content) {
    mappedContent = rawData.content.map((rev, index) => mapBackendToTestimonial(rev, index));
  }

  return {
    ...response,
    data: {
      ...response.data,
      data: {
        ...rawData,
        content: mappedContent
      }
    }
  } as any;
};
