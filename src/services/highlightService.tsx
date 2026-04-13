import type { AxiosResponse } from "axios";
import instance from "../utils/AxiosCustomize";
import type { BackendResponse } from "../types/backend";
import { getRestaurants } from "./restaurantService";

// --- Interfaces ---
export interface HighlightItem {
  id: string;
  slug: string;
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
}

const MOCK_PLACES: HighlightItem[] = [
  {
    "id": "1",
    "slug": "pho-co-hoi-an",
    "name": "Phố cổ Hội An",
    "location": "Quảng Nam",
    "rating": "4.8",
    "reviews": "1.2k",
    "image": "https://images.unsplash.com/photo-1555921015-5532091f6026?auto=format&fit=crop&q=80&w=800",
    "desc": "Hội An nổi tiếng with vẻ đẹp lãng mạn, cổ kính, yên bình với những ngôi nhà cổ.",
    "type": "pin",
    "category": "culture",
    "previewVideo": ""
  },
  {
    "id": "2",
    "slug": "vinh-ha-long",
    "name": "Vịnh Hạ Long",
    "location": "Quảng Ninh",
    "rating": "4.9",
    "reviews": "3.5k",
    "image": "https://images.unsplash.com/photo-1528605105345-5344ea20e269?auto=format&fit=crop&q=80&w=800",
    "desc": "Di sản thiên nhiên thế giới với hàng nghìn hòn đảo kỳ vĩ, hang động tuyệt đẹp.",
    "type": "pin",
    "category": "popular",
    "previewVideo": ""
  },
  {
    "id": "3",
    "slug": "da-lat",
    "name": "Thành phố Đà Lạt",
    "location": "Lâm Đồng",
    "rating": "4.7",
    "reviews": "2.8k",
    "image": "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80&w=800",
    "desc": "Thành phố ngàn hoa với khí hậu mát mẻ quanh năm và nhiều cảnh điểm lãng mạn.",
    "type": "pin",
    "category": "nature",
    "previewVideo": ""
  },
  {
    "id": "4",
    "slug": "co-do-hue",
    "name": "Cố đô Huế",
    "location": "Thừa Thiên Huế",
    "rating": "4.8",
    "reviews": "2.1k",
    "image": "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80&w=800",
    "desc": "Quần thể di tích lịch sử với cung điện, lăng tẩm mang đậm dấu ấn triều Nguyễn.",
    "type": "pin",
    "category": "culture",
    "previewVideo": ""
  },
  {
    "id": "5",
    "slug": "phu-quoc",
    "name": "Đảo Ngọc Phú Quốc",
    "location": "Kiên Giang",
    "rating": "4.9",
    "reviews": "4.2k",
    "image": "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80&w=800",
    "desc": "Thiên đường nghỉ dưỡng với những bãi cát trắng mịn và làn nước trong xanh.",
    "type": "pin",
    "category": "beach",
    "previewVideo": ""
  },
  {
    "id": "10",
    "slug": "nha-hang-gao",
    "name": "Nhà hàng Gạo",
    "location": "TP HCM",
    "rating": "4.5",
    "reviews": "950",
    "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800",
    "desc": "Mang đến hương vị ẩm thực Việt Nam tinh tế giữa không gian Đông Dương.",
    "type": "food",
    "category": "restaurant",
    "previewVideo": ""
  },
  {
    "id": "11",
    "slug": "pizza-4ps",
    "name": "Pizza 4P's Bến Thành",
    "location": "TP HCM",
    "rating": "4.8",
    "reviews": "5.6k",
    "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800",
    "desc": "Ẩm thực Ý mang phong cách Nhật Bản với phô mai thủ công tự làm nổi tiếng.",
    "type": "food",
    "category": "restaurant",
    "previewVideo": ""
  },
  {
    "id": "12",
    "slug": "tam-vi",
    "name": "Tầm Vị",
    "location": "Hà Nội",
    "rating": "4.6",
    "reviews": "1.1k",
    "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800",
    "desc": "Nhà hàng đạt sao Michelin với mâm cơm gia đình miền Bắc truyền thống.",
    "type": "food",
    "category": "restaurant",
    "previewVideo": ""
  },
  {
    "id": "13",
    "slug": "nha-hang-bien-xanh",
    "name": "Nhà hàng Biển Xanh",
    "location": "Đà Nẵng",
    "rating": "4.8",
    "reviews": "1.2k",
    "image": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800",
    "desc": "Hải sản tươi sống bên bờ biển.",
    "type": "food",
    "category": "restaurant",
    "previewVideo": ""
  },
  {
    "id": "14",
    "slug": "ba-na-hills",
    "name": "Bà Nà Hills",
    "location": "Đà Nẵng",
    "rating": "4.7",
    "reviews": "10k",
    "image": "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&q=80&w=800",
    "desc": "Đường lên tiên cảnh với Cầu Vàng nổi tiếng thế giới.",
    "type": "pin",
    "category": "popular",
    "previewVideo": ""
  },
  {
    "id": "15",
    "slug": "fansipan",
    "name": "Sapa - Fansipan",
    "location": "Lào Cai",
    "rating": "4.8",
    "reviews": "8.5k",
    "image": "https://images.unsplash.com/photo-1504457047772-27fad17438e2?auto=format&fit=crop&q=80&w=800",
    "desc": "Nóc nhà Đông Dương với biển mây bạt ngàn.",
    "type": "pin",
    "category": "popular",
    "previewVideo": ""
  },
  {
    "id": "16",
    "slug": "mui-ne",
    "name": "Mũi Né - Phan Thiết",
    "location": "Bình Thuận",
    "rating": "4.6",
    "reviews": "5.2k",
    "image": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800",
    "desc": "Đồi cát bay và biển xanh nắng vàng.",
    "type": "pin",
    "category": "beach",
    "previewVideo": ""
  },
  {
    "id": "17",
    "slug": "cho-ben-thanh",
    "name": "Chợ Bến Thành",
    "location": "TP HCM",
    "rating": "4.5",
    "reviews": "15.6k",
    "image": "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=800",
    "desc": "Biểu tượng văn hóa và ẩm thực của Sài Gòn.",
    "type": "pin",
    "category": "popular",
    "previewVideo": ""
  },
  {
    "id": "18",
    "slug": "nha-trang",
    "name": "Bãi biển Nha Trang",
    "location": "Khánh Hòa",
    "rating": "4.8",
    "reviews": "12.5k",
    "image": "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&q=80&w=800",
    "desc": "Vịnh biển đẹp nhất thế giới với nhiều hoạt động giải trí.",
    "type": "pin",
    "category": "beach",
    "previewVideo": ""
  }
];

// Lập mapper chung cho cấu trúc dữ liệu của Attractions/Restaurants
const mapBackendToHighlightItem = (item: any, type: "pin" | "food"): HighlightItem => ({
  id: item.id.toString(),
  slug: `${type === "pin" ? "place" : "restaurant"}-${item.id}`,
  name: item.name || "BE đang thiếu name",
  location: item.provinceId === 1 ? "Thành phố Huế" : item.provinceId === 2 ? "Đà Nẵng" : `Khu vực ${item.provinceId} (BE đang thiếu tên city)`,
  rating: item.rating || 0,
  reviews: item.reviewCount?.toString() || (item as any).reviews?.toString() || "0 (BE đang thiếu reviews)",
  image: item.imageUrl || item.image || "https://placehold.co/600x400?text=BE+dang+thieu+imageUrl",
  desc: item.description || `BE đang thiếu trường description cho ${item.name}`,
  type: type,
  category: item.cuisine || item.type || "Địa điểm",
  distance: item.distance || (item as any).distance,
  previewVideo: item.previewVideo || undefined
});

// Lấy tất cả địa điểm (cho trang Explore)
export const getPlaces = async (): Promise<AxiosResponse<BackendResponse<HighlightItem[]>>> => {
  try {
    const response = await instance.get<BackendResponse<any>>("/places");
    return response;
  } catch (error) {
    console.warn("Fake API fallback cho Places");
    return {
      data: { status: 200, message: "Mock data", data: MOCK_PLACES },
      status: 200, statusText: "OK", headers: {}, config: {} as any
    };
  }
};

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

export const getHighlightLocations = async (): Promise<AxiosResponse<BackendResponse<HighlightItem[]>>> => {
  try {
    const response = await getAttractions(0, 10);
    return {
      ...response,
      data: {
        ...response.data,
        data: response.data.data?.content || []
      }
    } as any;
  } catch (error) {
    console.warn("Fake API fallback cho Highlight Locations");
    return {
      data: { status: 200, message: "Mock data", data: MOCK_PLACES.filter(p => p.type === "pin") },
      status: 200, statusText: "OK", headers: {}, config: {} as any
    };
  }
};

// Lấy danh sách nhà hàng nổi bật
export const getHighlightRestaurants = async (): Promise<AxiosResponse<BackendResponse<HighlightItem[]>>> => {
  try {
    const response = await getRestaurants(0, 10);
    return {
      ...response,
      data: {
        ...response.data,
        data: response.data.data?.content || []
      }
    } as any;
  } catch (error) {
    console.warn("Fake API fallback cho Highlight Restaurants");
    return {
      data: { status: 200, message: "Mock data", data: MOCK_PLACES.filter(p => p.type === "food") },
      status: 200, statusText: "OK", headers: {}, config: {} as any
    };
  }
};
