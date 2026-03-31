import type { AxiosResponse } from "axios";
import instance from "../utils/AxiosCustomize";

// --- Interfaces ---
export interface HighlightItem {
  id: string;
  title: string;
  location: string;
  rating: string | number;
  reviews: string;
  img: string;
  desc: string;
  type: string;
  category: string;
  previewVideo?: string;
  isHot?: boolean;
}

export interface BackendResponse<T = unknown> {
  EC: number;
  EM: string;
  DT: T;
}

// Lấy tất cả địa điểm (cho trang Explore)
export const getPlaces = (): Promise<AxiosResponse<BackendResponse<HighlightItem[]>>> => {
  return instance.get<BackendResponse<HighlightItem[]>>("/places");
};

// Lấy danh sách địa điểm nổi bật
export const getHighlightLocations = (): Promise<AxiosResponse<BackendResponse<HighlightItem[]>>> => {
  return instance.get<BackendResponse<HighlightItem[]>>("/places?type=pin");
};

// Lấy danh sách khách sạn nổi bật
export const getHighlightHotels = (): Promise<AxiosResponse<BackendResponse<HighlightItem[]>>> => {
  return instance.get<BackendResponse<HighlightItem[]>>("/places?type=bed");
};

// Lấy danh sách nhà hàng nổi bật
export const getHighlightRestaurants = (): Promise<AxiosResponse<BackendResponse<HighlightItem[]>>> => {
  return instance.get<BackendResponse<HighlightItem[]>>("/places?type=food");
};
