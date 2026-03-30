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
  EC: number;
  EM: string;
  DT: T;
}

// Lấy danh sách đánh giá khách hàng
export const getTestimonials = (): Promise<AxiosResponse<BackendResponse<TestimonialItem[]>>> => {
  return instance.get<BackendResponse<TestimonialItem[]>>("/testimonials");
};
