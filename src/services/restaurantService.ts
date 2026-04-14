import type { AxiosResponse } from "axios";
import instance from "../utils/AxiosCustomize";
import type { BackendResponse } from "../types/backend";
import { type HighlightItem } from "./highlightService";
import { type Destination } from "./destinationService";
import { DEFAULT_TRAVEL_TIPS } from "./hotelService";

export interface BackendRestaurant {
  id: number;
  name: string;
  description: string | null;
  rating: number;
  reviewCount: number | null;
  category: string | null; // Đổi từ cuisine
  status: string | null;
  averagePrice: number | null;
  estimatedDuration: number | null;
  imageUrl: string | null;
  previewVideo: string | null;
  provinceId: number;
  gallery?: string[];
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
    name: rest.name || "BE đang thiếu name",
    location: rest.provinceId === 1 ? "Thành phố Huế" : rest.provinceId === 2 ? "Đà Nẵng" : `Khu vực ${rest.provinceId} (BE đang thiếu tên city)`,
    rating: rest.rating || 0,
    reviews: rest.reviewCount?.toString() || "0 (BE đang thiếu reviews)",
    image: rest.imageUrl || "https://placehold.co/600x400?text=BE+dang+thieu+imageUrl",
    desc: rest.description || `BE đang thiếu trường description cho nhà hàng ${rest.name}`,
    type: "food",
    category: CUISINE_MAP[rest.category || ""] || rest.category || "Ẩm thực",
    previewVideo: rest.previewVideo || undefined,
    price: rest.averagePrice || 0,
    provinceId: rest.provinceId || 0
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

/**
 * Mapper chuyển đổi dữ liệu từ BackendRestaurant sang định dạng Destination (dùng cho DestinationDetail)
 */
export const mapBackendRestaurantToFullDestination = (rest: BackendRestaurant): Destination => {
  if (!rest) {
    return {
      id: "error",
      name: "Dữ liệu nhà hàng trống",
      location: "Đang cập nhật",
      heroImage: "https://placehold.co/1920x1080?text=Dữ+liệu+trống",
      rating: "0",
      reviews: "0",
      distance: "N/A",
      price: "N/A",
      time: "N/A",
      category: "N/A",
      description: "Không có mô tả.",
      gallery: [],
      services: [],
      reviewsData: { average: 0, total: 0, breakdown: [], list: [] },
      travelTips: DEFAULT_TRAVEL_TIPS,
      weatherCurrent: { temp: 28, description: "Nắng nhẹ", icon: "CloudSun" },
      travelTimeFromHanoi: "N/A",
      coordinates: { lat: 0, lng: 0 },
      mapScreenshot: "",
      quickInfo: []
    };
  }

  const category = CUISINE_MAP[rest.category || ""] || rest.category || "Ẩm thực";

  return {
    id: rest.id,
    name: rest.name || "BE đang thiếu name",
    location: rest.provinceId === 1 ? "Thành phố Huế" : rest.provinceId === 2 ? "Đà Nẵng" : `Khu vực ${rest.provinceId} (BE đang thiếu tên city)`,
    heroImage: rest.imageUrl || "https://placehold.co/1920x1080?text=BE+dang+thieu+heroImage",
    rating: (rest.rating || 0).toString(),
    reviews: rest.reviewCount?.toString() || "0",
    distance: "N/A",
    price: rest.averagePrice ? `${rest.averagePrice.toLocaleString()}đ` : "Giá từ 50k",
    time: rest.estimatedDuration ? `${rest.estimatedDuration} phút` : "Đang cập nhật",
    category: category,
    description: rest.description || `BE đang thiếu mô tả cho nhà hàng ${rest.name}.`,
    gallery: rest.gallery && rest.gallery.length > 0 
      ? rest.gallery 
      : [
          rest.imageUrl || "https://placehold.co/800x600?text=BE+dang+thieu+imageUrl",
          "https://placehold.co/800x600?text=BE+dang+thieu+gallery+2",
          "https://placehold.co/800x600?text=BE+dang+thieu+gallery+3",
        ],
    services: [], // Sẽ được FE tự động lọc trong DestinationDetail
    reviewsData: {
      average: rest.rating,
      total: rest.reviewCount || 0,
      breakdown: [
        { stars: 5, percentage: 80 },
        { stars: 4, percentage: 15 },
        { stars: 3, percentage: 5 },
        { stars: 2, percentage: 0 },
        { stars: 1, percentage: 0 },
      ],
      list: [
        {
          user: "TravelAi User",
          avatar: "https://i.pravatar.cc/150?u=restaurant",
          rating: 5,
          date: "Vừa xong",
          tag: "Khách hàng",
          content: "BE đang thiếu dữ liệu đánh giá chi tiết cho nhà hàng.",
        }
      ],
    },
    travelTips: DEFAULT_TRAVEL_TIPS,
    weatherCurrent: {
      temp: 28,
      description: "Trời nắng đẹp",
      icon: "CloudSun"
    },
    travelTimeFromHanoi: "Đang cập nhật",
    coordinates: { lat: 0, lng: 0 },
    mapScreenshot: "",
    quickInfo: [
      { id: 1, label: "Trạng thái", value: rest.status === 'OPENING' ? 'Đang mở cửa' : 'Đóng cửa' },
      { id: 2, label: "Loại hình", value: category },
      { id: 3, label: "Giá bình quân", value: rest.averagePrice ? `${rest.averagePrice.toLocaleString()}đ/người` : "Chưa cập nhật" },
    ],
  };
};

/**
 * Lấy chi tiết nhà hàng theo ID
 */
export const getRestaurantDetail = async (id: string | number): Promise<AxiosResponse<BackendResponse<Destination>>> => {
  const response = await instance.get<BackendResponse<BackendRestaurant>>(`/restaurants/${id}`);
  const restData = response.data.data || (response.data as any).DT;
  
  const fullData = mapBackendRestaurantToFullDestination(restData);
  
  return {
    ...response,
    data: {
      ...response.data,
      data: fullData
    }
  } as any;
};
