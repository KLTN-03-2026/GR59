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
  status: number;
  message: string;
  data?: T;
  DT?: T;
  EC?: number;
  EM?: string;
}


const MOCK_PLACES: HighlightItem[] = [
  {
    "id": "1",
    "title": "Phố cổ Hội An",
    "location": "Quảng Nam",
    "rating": "4.8",
    "reviews": "1.2k",
    "img": "https://images.unsplash.com/photo-1555921015-5532091f6026?auto=format&fit=crop&q=80&w=800",
    "desc": "Hội An nổi tiếng với vẻ đẹp lãng mạn, cổ kính, yên bình với những ngôi nhà cổ.",
    "type": "pin",
    "category": "culture",
    "previewVideo": ""
  },
  {
    "id": "2",
    "title": "Vịnh Hạ Long",
    "location": "Quảng Ninh",
    "rating": "4.9",
    "reviews": "3.5k",
    "img": "https://images.unsplash.com/photo-1528605105345-5344ea20e269?auto=format&fit=crop&q=80&w=800",
    "desc": "Di sản thiên nhiên thế giới với hàng nghìn hòn đảo kỳ vĩ, hang động tuyệt đẹp.",
    "type": "pin",
    "category": "popular",
    "previewVideo": ""
  },
  {
    "id": "3",
    "title": "Thành phố Đà Lạt",
    "location": "Lâm Đồng",
    "rating": "4.7",
    "reviews": "2.8k",
    "img": "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80&w=800",
    "desc": "Thành phố ngàn hoa với khí hậu mát mẻ quanh năm và nhiều cảnh điểm lãng mạn.",
    "type": "pin",
    "category": "nature",
    "previewVideo": ""
  },
  {
    "id": "4",
    "title": "Cố đô Huế",
    "location": "Thừa Thiên Huế",
    "rating": "4.8",
    "reviews": "2.1k",
    "img": "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80&w=800",
    "desc": "Quần thể di tích lịch sử với cung điện, lăng tẩm mang đậm dấu ấn triều Nguyễn.",
    "type": "pin",
    "category": "culture",
    "previewVideo": ""
  },
  {
    "id": "5",
    "title": "Đảo Ngọc Phú Quốc",
    "location": "Kiên Giang",
    "rating": "4.9",
    "reviews": "4.2k",
    "img": "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80&w=800",
    "desc": "Thiên đường nghỉ dưỡng với những bãi cát trắng mịn và làn nước trong xanh.",
    "type": "pin",
    "category": "beach",
    "previewVideo": ""
  },
  {
    "id": "6",
    "title": "InterContinental Resort",
    "location": "Đà Nẵng",
    "rating": "4.9",
    "reviews": "2.2k",
    "img": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
    "desc": "Khu nghỉ dưỡng sang trọng bậc nhất tọa lạc tại bán đảo Sơn Trà.",
    "type": "bed",
    "category": "popular",
    "previewVideo": ""
  },
  {
    "id": "7",
    "title": "Topas Ecolodge",
    "location": "Sapa",
    "rating": "4.7",
    "reviews": "1.8k",
    "img": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
    "desc": "Trải nghiệm nghỉ dưỡng giữa thiên nhiên hoang sơ với hồ bơi vô cực.",
    "type": "bed",
    "category": "nature",
    "previewVideo": ""
  },
  {
    "id": "8",
    "title": "Six Senses Ninh Van Bay",
    "location": "Nha Trang",
    "rating": "4.9",
    "reviews": "1.5k",
    "img": "https://images.unsplash.com/photo-1555921015-5532091f6026?auto=format&fit=crop&q=80&w=800",
    "desc": "Khu nghỉ dưỡng biệt lập với các villa nằm giữa vách đá và biển cả.",
    "type": "bed",
    "category": "beach",
    "previewVideo": ""
  },
  {
    "id": "9",
    "title": "Hotel de la Coupole",
    "location": "Sapa",
    "rating": "4.8",
    "reviews": "2.5k",
    "img": "https://images.unsplash.com/photo-1555921015-5532091f6026?auto=format&fit=crop&q=80&w=800",
    "desc": "Sự kết hợp hoàn hảo giữa văn hóa bản địa Sapa và phong cách Pháp thượng lưu.",
    "type": "bed",
    "category": "culture",
    "previewVideo": ""
  },
  {
    "id": "10",
    "title": "Nhà hàng Gạo",
    "location": "TP HCM",
    "rating": "4.5",
    "reviews": "950",
    "img": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800",
    "desc": "Mang đến hương vị ẩm thực Việt Nam tinh tế giữa không gian Đông Dương.",
    "type": "food",
    "category": "restaurant",
    "previewVideo": ""
  },
  {
    "id": "11",
    "title": "Pizza 4P's Bến Thành",
    "location": "TP HCM",
    "rating": "4.8",
    "reviews": "5.6k",
    "img": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800",
    "desc": "Ẩm thực Ý mang phong cách Nhật Bản với phô mai thủ công tự làm nổi tiếng.",
    "type": "food",
    "category": "restaurant",
    "previewVideo": ""
  },
  {
    "id": "12",
    "title": "Tầm Vị",
    "location": "Hà Nội",
    "rating": "4.6",
    "reviews": "1.1k",
    "img": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800",
    "desc": "Nhà hàng đạt sao Michelin với mâm cơm gia đình miền Bắc truyền thống.",
    "type": "food",
    "category": "restaurant",
    "previewVideo": ""
  },
  {
    "id": "13",
    "title": "Nhà hàng Biển Xanh",
    "location": "Đà Nẵng",
    "rating": "4.8",
    "reviews": "1.2k",
    "img": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800",
    "desc": "Hải sản tươi sống bên bờ biển.",
    "type": "food",
    "category": "restaurant",
    "previewVideo": ""
  },
  {
    "id": "14",
    "title": "Bà Nà Hills",
    "location": "Đà Nẵng",
    "rating": "4.7",
    "reviews": "10k",
    "img": "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&q=80&w=800",
    "desc": "Đường lên tiên cảnh với Cầu Vàng nổi tiếng thế giới.",
    "type": "pin",
    "category": "popular",
    "previewVideo": ""
  },
  {
    "id": "15",
    "title": "Sapa - Fansipan",
    "location": "Lào Cai",
    "rating": "4.8",
    "reviews": "8.5k",
    "img": "https://images.unsplash.com/photo-1504457047772-27fad17438e2?auto=format&fit=crop&q=80&w=800",
    "desc": "Nóc nhà Đông Dương với biển mây bạt ngàn.",
    "type": "pin",
    "category": "popular",
    "previewVideo": ""
  },
  {
    "id": "16",
    "title": "Mũi Né - Phan Thiết",
    "location": "Bình Thuận",
    "rating": "4.6",
    "reviews": "5.2k",
    "img": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800",
    "desc": "Đồi cát bay và biển xanh nắng vàng.",
    "type": "pin",
    "category": "beach",
    "previewVideo": ""
  },
  {
    "id": "17",
    "title": "Chợ Bến Thành",
    "location": "TP HCM",
    "rating": "4.5",
    "reviews": "15.6k",
    "img": "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&q=80&w=800",
    "desc": "Biểu tượng văn hóa và ẩm thực của Sài Gòn.",
    "type": "pin",
    "category": "popular",
    "previewVideo": ""
  },
  {
    "id": "18",
    "title": "Bãi biển Nha Trang",
    "location": "Khánh Hòa",
    "rating": "4.8",
    "reviews": "12.5k",
    "img": "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?auto=format&fit=crop&q=80&w=800",
    "desc": "Vịnh biển đẹp nhất thế giới với nhiều hoạt động giải trí.",
    "type": "pin",
    "category": "beach",
    "previewVideo": ""
  }
];

// Lấy tất cả địa điểm (cho trang Explore)
export const getPlaces = async (): Promise<AxiosResponse<BackendResponse<HighlightItem[]>>> => {
  try {
    return await instance.get<BackendResponse<HighlightItem[]>>("/places");
  } catch (error) {
    console.warn("Fake API fallback cho Places");
    return {
      data: { status: 200, message: "Mock data", DT: MOCK_PLACES, data: MOCK_PLACES },
      status: 200, statusText: "OK", headers: {}, config: {} as any
    };
  }
};

// Lấy danh sách địa điểm nổi bật
export const getHighlightLocations = async (): Promise<AxiosResponse<BackendResponse<HighlightItem[]>>> => {
  try {
    return await instance.get<BackendResponse<HighlightItem[]>>("/places?type=pin");
  } catch (error) {
    console.warn("Fake API fallback cho Highlight Locations");
    return {
      data: { status: 200, message: "Mock data", DT: MOCK_PLACES.filter(p => p.type === "pin"), data: MOCK_PLACES.filter(p => p.type === "pin") },
      status: 200, statusText: "OK", headers: {}, config: {} as any
    };
  }
};

// Lấy danh sách khách sạn nổi bật
export const getHighlightHotels = async (): Promise<AxiosResponse<BackendResponse<HighlightItem[]>>> => {
  try {
    return await instance.get<BackendResponse<HighlightItem[]>>("/places?type=bed");
  } catch (error) {
    console.warn("Fake API fallback cho Highlight Hotels");
    return {
      data: { status: 200, message: "Mock data", DT: MOCK_PLACES.filter(p => p.type === "bed"), data: MOCK_PLACES.filter(p => p.type === "bed") },
      status: 200, statusText: "OK", headers: {}, config: {} as any
    };
  }
};

// Lấy danh sách nhà hàng nổi bật
export const getHighlightRestaurants = async (): Promise<AxiosResponse<BackendResponse<HighlightItem[]>>> => {
  try {
    return await instance.get<BackendResponse<HighlightItem[]>>("/places?type=food");
  } catch (error) {
    console.warn("Fake API fallback cho Highlight Restaurants");
    return {
      data: { status: 200, message: "Mock data", DT: MOCK_PLACES.filter(p => p.type === "food"), data: MOCK_PLACES.filter(p => p.type === "food") },
      status: 200, statusText: "OK", headers: {}, config: {} as any
    };
  }
};
