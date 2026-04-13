import type { AxiosResponse } from "axios";
import instance from "../utils/AxiosCustomize";
import type { BackendResponse } from "../types/backend";
import { type HighlightItem } from "./highlightService";

export interface BackendRestaurant {
  id: number;
  name: string;
  description: string | null;
  rating: number;
  reviewCount: number | null;
  cuisine: string | null;
  status: string | null;
  averagePrice: number | null;
  estimatedDuration: number | null;
  imageUrl: string | null;
  previewVideo: string | null;
  provinceId: number;
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

const CUISINE_MAP: Record<string, string> = {
  "MON_VIET": "Món Việt",
  "HAI_SAN": "Hải sản",
  "CHAY": "Món chay",
  "A_DONG": "Á Đông",
  "AU_MY": "Âu Mỹ",
};

/**
 * Lấy danh sách nhà hàng từ API và map sang HighlightItem
 */
export const getRestaurants = async (page = 0, size = 10): Promise<AxiosResponse<BackendResponse<PaginatedData<HighlightItem>>>> => {
  const response = await instance.get<BackendResponse<PaginatedData<BackendRestaurant>>>(`/restaurants?page=${page}&size=${size}`);
  
  const mappedContent: HighlightItem[] = (response.data.data?.content || []).map(rest => ({
    id: rest.id.toString(),
    slug: `restaurant-${rest.id}`,
    name: rest.name || "BE đang thiếu name",
    location: rest.provinceId === 1 ? "Thành phố Huế" : rest.provinceId === 2 ? "Đà Nẵng" : `Khu vực ${rest.provinceId} (BE đang thiếu tên city)`,
    rating: rest.rating || 0,
    reviews: rest.reviewCount?.toString() || "0 (BE đang thiếu reviews)",
    image: rest.imageUrl || "https://placehold.co/600x400?text=BE+dang+thieu+imageUrl",
    desc: rest.description || `BE đang thiếu trường description cho nhà hàng ${rest.name}`,
    type: "food",
    category: CUISINE_MAP[rest.cuisine || ""] || rest.cuisine || "Ẩm thực",
    previewVideo: rest.previewVideo || undefined
  }));

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
