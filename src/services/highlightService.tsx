import type { AxiosResponse } from "axios";
import instance from "../utils/AxiosCustomize";
import type { BackendResponse } from "../types/backend";
import { getRestaurants } from "./restaurantService";

// --- Interfaces ---
export interface HighlightItem {
  id: string;
  name: string;
  location: string;
  rating: string | number;
  reviews: string;
  image: string;
  desc: string;
  type: string;
  category: string;
  distance?: string;
  previewVideo?: string;
  isHot?: boolean;
  price: number; // Thêm trường giá số để lọc/sắp xếp
  provinceId: number; // Thêm ID tỉnh thành để lọc
  status?: string; // Trạng thái (ACTIVE, MAINTENANCE, etc.)
  uniqueId?: string; // Khóa duy nhất gộp từ type + id
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

// Lập mapper chung cho cấu trúc dữ liệu của Attractions/Restaurants
const mapBackendToHighlightItem = (item: any, type: "pin" | "food"): HighlightItem => ({
  id: item.id.toString(),
  name: item.name || "BE đang thiếu name",
  location: 
    item.provinceId === 1 ? "Thừa Thiên Huế" : 
    item.provinceId === 2 ? "Đà Nẵng" : 
    item.provinceId === 3 ? "Quảng Nam" :
    item.provinceId === 4 ? "Hà Nội" : 
    item.provinceId === 5 ? "TP. Hồ Chí Minh" : `Khu vực ${item.provinceId} (Đang cập nhật)`,
  rating: item.rating || 0,
  reviews: item.reviewCount?.toString() || (item as any).reviews?.toString() || "0 (BE đang thiếu reviews)",
  image: item.imageUrl || item.image || "https://placehold.co/600x400?text=BE+dang+thieu+imageUrl",
  desc: item.description || `BE đang thiếu trường description cho ${item.name}`,
  type: type,
  category: item.category || item.cuisine || item.type || "Địa điểm",
  distance: item.distance || (item as any).distance,
  previewVideo: item.previewVideo || undefined,
  price: item.averagePrice || 0,
  provinceId: item.provinceId || 0,
  status: item.status || "ACTIVE"
});

/**
 * Lấy danh sách địa điểm tham quan từ API thật
 */
export const getAttractions = async (page = 0, size = 10): Promise<AxiosResponse<BackendResponse<any>>> => {
  const response = await instance.get<BackendResponse<any>>(`/attractions?page=${page}&size=${size}`);
  
  const mappedContent = (response.data.data?.content || []).map((item: any) => mapBackendToHighlightItem(item, "pin"));

  return {
    ...response,
    data: {
      ...response.data,
      data: {
        ...response.data.data,
        content: mappedContent
      }
    }
  } as any;
};

/**
 * Lấy danh sách địa điểm tham quan nổi bật (cho trang chủ)
 */
export const getHighlightLocations = async (): Promise<AxiosResponse<BackendResponse<HighlightItem[]>>> => {
  const response = await getAttractions(0, 10);
  return {
    ...response,
    data: {
      ...response.data,
      data: response.data.data?.content || []
    }
  } as any;
};

/**
 * Lấy danh sách nhà hàng nổi bật (cho trang chủ)
 */
export const getHighlightRestaurants = async (): Promise<AxiosResponse<BackendResponse<HighlightItem[]>>> => {
  const response = await getRestaurants(0, 10);
  
  const mappedContent = (response.data.data?.content || []).map((item: any) => mapBackendToHighlightItem(item, "food"));

  return {
    ...response,
    data: {
      ...response.data,
      data: mappedContent
    }
  } as any;
};
/**
 * Tìm kiếm địa điểm theo từ khóa (Tên hoặc Vị trí)
 */
export const getHighlightAttractionsByKeyword = async (keyword: string, page = 0, size = 10): Promise<AxiosResponse<BackendResponse<any>>> => {
  const response = await instance.get<BackendResponse<any>>(`/attractions/search/by-keyword?keyword=${keyword}&page=${page}&size=${size}`);
  const mappedContent = (response.data.data?.content || []).map((item: any) => mapBackendToHighlightItem(item, "pin"));

  return {
    ...response,
    data: {
      ...response.data,
      data: {
        ...response.data.data,
        content: mappedContent
      }
    }
  } as any;
};

/**
 * Tìm kiếm nhà hàng theo từ khóa (Tên hoặc Vị trí)
 */
export const getHighlightRestaurantsByKeyword = async (keyword: string, page = 0, size = 10): Promise<AxiosResponse<BackendResponse<any>>> => {
  const response = await instance.get<BackendResponse<any>>(`/restaurants/search/by-keyword?keyword=${keyword}&page=${page}&size=${size}`);
  const mappedContent = (response.data.data?.content || []).map((item: any) => mapBackendToHighlightItem(item, "food"));

  return {
    ...response,
    data: {
      ...response.data,
      data: {
        ...response.data.data,
        content: mappedContent
      }
    }
  } as any;
};
