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

export interface BackendResponse<T = unknown> {
  status: number;
  message: string;
  data?: T;
  DT?: T;
  EC?: number;
  EM?: string;
}

const MOCK_TESTIMONIALS: TestimonialItem[] = [
  {
    "id": "1",
    "name": "Hoàng Linh",
    "role": "Travel Blogger",
    "initial": "HL",
    "color": "bgBlue",
    "text": "Ứng dụng thực sự kì diệu! Chỉ mất 2 phút để lên xong toàn bộ lịch trình 5 ngày.",
    "delay": "100"
  },
  {
    "id": "2",
    "name": "Minh Anh",
    "role": "Doanh nhân",
    "initial": "MA",
    "color": "bgGreen",
    "text": "Lộ trình được sắp xếp rất logic. Quán ăn AI gợi ý rất ngon và rẻ.",
    "delay": "300"
  },
  {
    "id": "3",
    "name": "Tuấn Việt",
    "role": "Sinh viên",
    "initial": "TV",
    "color": "bgPurple",
    "text": "Tính năng bản đồ kéo thả hoạt động cực mượt. Có thêm cảnh báo thời tiết là điểm cộng!",
    "delay": "500"
  }
];

// Lấy danh sách đánh giá khách hàng
export const getTestimonials = async (): Promise<AxiosResponse<BackendResponse<TestimonialItem[]>>> => {
  try {
    return await instance.get<BackendResponse<TestimonialItem[]>>("/testimonials");
  } catch (error) {
    console.warn("Fake API fallback cho Testimonials");
    return {
      data: { status: 200, message: "Mock data", DT: MOCK_TESTIMONIALS, data: MOCK_TESTIMONIALS },
      status: 200, statusText: "OK", headers: {}, config: {} as any
    };
  }
};
