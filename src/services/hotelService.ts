import type { AxiosResponse } from "axios";
import instance from "../utils/AxiosCustomize";
import type { BackendResponse } from "../types/backend";
import { type Destination } from "./destinationService";
import { type HighlightItem } from "./highlightService";

export interface BackendHotel {
  id: number;
  name: string;
  location: string | null;
  rating: number;
  reviews: string | number | null;
  image: string | null;
  type: string;
  status: string;
  provinceId: number;
  description?: string; // Đôi khi có trong một số API
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


/**
 * Mapper chuyển đổi dữ liệu từ BackendHotel sang định dạng Destination đầy đủ (dùng cho DestinationDetail)
 * Các trường thiếu sẽ được điền giá trị mặc định "Đang cập nhật"
 */
export const mapBackendHotelToFullDestination = (hotel: BackendHotel): Destination => ({
  id: hotel.id,
  title: hotel.name,
  location: hotel.location || "BE đang thiếu location",
  heroImage: hotel.image || "https://placehold.co/1920x1080?text=BE+dang+thieu+Hero+Image",
  rating: (hotel.rating || 0).toString(),
  reviews: hotel.reviews?.toString() || "0 (BE đang thiếu reviews)",
  distance: (hotel as any).distance || "BE đang thiếu distance",
  price: (hotel as any).price || (hotel as any).price_range || "BE đang thiếu price",
  time: (hotel as any).time || (hotel as any).check_in_time || "BE đang thiếu time (open hours)",
  category: hotel.type || "BE đang thiếu type",
  description: hotel.description || `BE đang thiếu trường description cho khách sạn ${hotel.name || hotel.id}.`,
  gallery: [
    hotel.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800", // Sample interior 1
    "https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=800"
  ],
  services: [
    {
      id: 1,
      type: "Khách sạn",
      name: hotel.name,
      location: hotel.location || "Việt Nam",
      price: "Liên hệ",
      unit: "đêm",
      rating: hotel.rating,
      image: hotel.image || "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400",
      buttonText: "Đặt phòng",
    }
  ],
  reviewsData: {
    average: hotel.rating,
    total: parseInt(hotel.reviews?.toString() || "0"),
    breakdown: [
      { stars: 5, percentage: 80 },
      { stars: 4, percentage: 15 },
      { stars: 3, percentage: 5 },
      { stars: 2, percentage: 0 },
      { stars: 1, percentage: 0 },
    ],
    list: [
      {
        user: "Người dùng TravelAi",
        avatar: "https://i.pravatar.cc/150",
        rating: 5,
        date: "Vừa xong",
        tag: "Khách du lịch",
        content: "Khách sạn tuyệt vời, tôi sẽ quay lại!",
      }
    ],
  },
  travelTips: [
    { 
      icon: "MapPin", 
      title: "Di chuyển", 
      content: "Khu vực này có mật độ taxi và xe công nghệ cao. Nếu muốn tự khám phá, bạn có thể thuê xe máy tại quầy lễ tân với giá khoảng 150.000đ/ngày." 
    },
    { 
      icon: "Wallet", 
      title: "Thanh toán", 
      content: "Khách sạn chấp nhận các loại thẻ quốc tế (Visa, Mastercard). Tuy nhiên, bạn nên mang theo một ít tiền mặt khi tham quan các khu chợ địa phương xung quanh." 
    },
    { 
      icon: "Sun", 
      title: "Thời tiết", 
      content: "Nên mang theo kem chống nắng và ô/dù nếu tham quan vào buổi chiều. Thời điểm đẹp nhất để khám phá khu vực này là từ tháng 3 đến tháng 9." 
    },
    { 
      icon: "ShieldCheck", 
      title: "An ninh", 
      content: "Khu vực này rất an toàn cho khách du lịch. Tuy nhiên, hãy luôn bảo quản tài sản cá nhân cẩn thận khi ghé thăm những nơi đông người." 
    }
  ],
  weatherCurrent: {
    temp: 28,
    description: "Nắng nhẹ",
    icon: "Sun"
  },
  travelTimeFromHanoi: "Đang tính toán...",
  coordinates: {
    lat: 16.0471, // Tọa độ giả định nếu thiếu
    lng: 108.2062
  },
  mapScreenshot: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=600",
  quickInfo: [
    { id: 1, label: "Tình trạng", value: hotel.status || "BE đang thiếu status" },
    { id: 2, label: "Loại phòng", value: hotel.type || "BE đang thiếu type" },
    { id: 3, label: "Dịch vụ", value: (hotel as any).services ? "Có dịch vụ" : "BE đang thiếu service list" },
  ],
});

/**
 * Lấy danh sách khách sạn từ API thật và thực hiện mapping sang HighlightItem
 */
export const getHotels = async (page = 0, size = 10): Promise<AxiosResponse<BackendResponse<PaginatedData<HighlightItem>>>> => {
  const response = await instance.get<BackendResponse<PaginatedData<BackendHotel>>>(`/hotels?page=${page}&size=${size}`);
  
  // Thực hiện mapping dữ liệu ngay tại service để FE dễ sử dụng
  const mappedContent: HighlightItem[] = (response.data.data.content || []).map(hotel => ({
    id: hotel.id.toString(),
    slug: `hotel-${hotel.id}`, // Tạo slug giả định từ ID
    name: hotel.name || "BE đang thiếu name",
    location: hotel.location || "BE đang thiếu location",
    rating: hotel.rating || 0,
    reviews: hotel.reviews?.toString() || "0 (BE đang thiếu reviews)",
    image: hotel.image || "https://placehold.co/600x400?text=BE+dang+thieu+anh",
    desc: hotel.description || `BE đang thiếu trường description cho khách sạn ${hotel.name || hotel.id}`,
    type: "bed", // Fix loại là khách sạn
    category: hotel.type?.toLowerCase() || "khách sạn",
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
 * Lấy chi tiết khách sạn theo ID
 */
export const getHotelDetail = async (id: string | number): Promise<AxiosResponse<BackendResponse<Destination>>> => {
  const response = await instance.get<BackendResponse<BackendHotel>>(`/hotels/${id}`);
  
  // Chuyển đổi dữ liệu đơn giản từ BE thành dữ liệu phức tạp cho UI DestinationDetail
  const fullData = mapBackendHotelToFullDestination(response.data.data);
  
  return {
    ...response,
    data: {
      ...response.data,
      data: fullData
    }
  } as any;
};
