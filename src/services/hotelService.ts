import type { AxiosResponse } from "axios";
import instance from "../utils/AxiosCustomize";
import type { BackendResponse } from "../types/backend";
import { type Destination } from "./destinationService";
import { type HighlightItem } from "./highlightService";

export interface BackendHotel {
  id: number;
  name: string;
  description: string | null;
  location: string | null;
  rating: number;
  reviewCount: number | null; // Đổi từ reviews
  imageUrl: string | null; // Đổi từ image
  gallery?: string[] | null;
  previewVideo?: string | null;
  category: string | null; // Đổi từ type
  status: string | null;
  averagePrice: number | null;
  estimatedDuration: number | null;
  provinceId: number;
}

/**
 * Danh sách mẹo du lịch cố định để đảm bảo nội dung luôn đầy đủ
 */
export const DEFAULT_TRAVEL_TIPS = [
  { 
    icon: "MapPin", 
    title: "Vị trí & Di chuyển", 
    content: "Nên sử dụng các ứng dụng đặt xe như Grab để có giá minh bạch. Giờ cao điểm thường từ 17:00 - 19:00, hãy sắp xếp lịch trình sớm hơn để tránh kẹt xe." 
  },
  { 
    icon: "Wallet", 
    title: "Giá và Thanh toán", 
    content: "Phần lớn các cửa hàng và khách sạn đều chấp nhận chuyển khoản hoặc thẻ. Tuy nhiên, hãy mang theo một ít tiền mặt khi đi mua sắm tại các chợ truyền thống hoặc quán ăn nhỏ." 
  },
  { 
    icon: "ShieldCheck", 
    title: "An toàn & Quy định", 
    content: "Luôn bảo quản tư trang cẩn thận ở nơi đông người. Hãy mặc trang phục kín đáo, lịch sự khi tham quan các khu vực đền chùa hoặc di tích lịch sử tâm linh." 
  },
  { 
    icon: "Sun", 
    title: "Thời tiết & Tiện ích", 
    content: "Kiểm tra dự báo thời tiết trước khi khởi hành. Đừng quên mang theo ô/dù, kem chống nắng và sạc dự phòng để đảm bảo trải nghiệm không bị gián đoạn." 
  },
  { 
    icon: "Coffee", 
    title: "Ẩm thực bản địa", 
    content: "Hãy thử các món ăn đặc sản tại những quán có đông người bản địa lui tới. Lưu ý sử dụng nước đóng chai thay vì nước máy trực tiếp để bảo vệ sức khỏe." 
  },
  { 
    icon: "Camera", 
    title: "Chụp ảnh & Kỷ niệm", 
    content: "Thời điểm 'giờ vàng' để có những bức ảnh đẹp nhất là lúc bình minh (5:30) hoặc hoàng hôn (17:30). Hãy tôn trọng không gian riêng của người dân địa phương khi chụp ảnh." 
  }
];

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
export const mapBackendHotelToFullDestination = (hotel: BackendHotel): Destination => {
  if (!hotel) {
    return {
      id: "error",
      name: "BE trả về dữ liệu null/undefined",
      location: "BE đang thiếu location",
      heroImage: "https://placehold.co/1920x1080?text=Dữ+liệu+trống",
      rating: "0",
      reviews: "0",
      distance: "N/A",
      price: "N/A",
      time: "N/A",
      category: "N/A",
      description: "Không có mô tả từ Backend.",
      gallery: [],
      services: [],
      reviewsData: { average: 0, total: 0, breakdown: [], list: [] },
      travelTips: [],
      weatherCurrent: { temp: 0, description: "N/A", icon: "Cloud" },
      travelTimeFromHanoi: "N/A",
      coordinates: { lat: 0, lng: 0 },
      mapScreenshot: "",
      quickInfo: []
    };
  }

  return {
    id: hotel.id.toString(),
    name: hotel.name || "Khách sạn chưa cập nhật tên",
    location: hotel.location || "Đang cập nhật vị trí",
    heroImage: hotel.imageUrl || "https://placehold.co/1920x1080?text=Hình+ảnh+đang+cập+nhật",
    rating: (hotel.rating || 0).toString(),
    reviews: hotel.reviewCount?.toString() || "0",
    distance: "Thông tin đang cập nhật",
    price: hotel.averagePrice ? `${hotel.averagePrice.toLocaleString()}đ` : "Liên hệ",
    time: hotel.estimatedDuration 
      ? (hotel.estimatedDuration >= 60 
          ? `${Math.round(hotel.estimatedDuration / 60)} giờ` 
          : `${hotel.estimatedDuration} phút`)
      : "Đang cập nhật",
    category: hotel.category || "LUXURY",
    description: hotel.description || `Thông tin chi tiết về khách sạn ${hotel.name || hotel.id} đang được cập nhật.`,
    gallery: hotel.gallery && hotel.gallery.length > 0 
      ? hotel.gallery 
      : [
          hotel.imageUrl || "https://placehold.co/800x600?text=BE+dang+thieu+imageUrl",
          "https://placehold.co/800x600?text=BE+dang+thieu+gallery+2",
          "https://placehold.co/800x600?text=BE+dang+thieu+gallery+3"
        ],
    services: (hotel as any).services || [
      {
        id: 1,
        type: "Khách sạn",
        name: hotel.name,
        location: hotel.location || "BE đang thiếu address",
        price: hotel.averagePrice ? `${hotel.averagePrice.toLocaleString()}đ` : "Liên hệ",
        unit: "đêm",
        rating: hotel.rating,
        image: hotel.imageUrl || "https://placehold.co/400x300?text=BE+dang+thieu+service+image",
        buttonText: "Xem chi tiết",
      }
    ],
    reviewsData: (hotel as any).reviewsData || {
      average: hotel.rating || 0,
      total: (hotel.reviewCount || 0),
      breakdown: [
        { stars: 5, percentage: 0 },
        { stars: 4, percentage: 0 },
        { stars: 3, percentage: 0 },
        { stars: 2, percentage: 0 },
        { stars: 1, percentage: 0 },
      ],
      list: [],
    },
    travelTips: DEFAULT_TRAVEL_TIPS,

    weatherCurrent: (hotel as any).weatherCurrent || {
      temp: 0,
      description: "BE đang thiếu weather data",
      icon: "Cloud"
    },
    travelTimeFromHanoi: (hotel as any).travelTimeFromHanoi || "BE đang thiếu travelTime",
    coordinates: (hotel as any).coordinates || {
      lat: 0,
      lng: 0
    },
    mapScreenshot: (hotel as any).mapScreenshot || "https://placehold.co/600x400?text=BE+dang+thieu+mapScreenshot",
    quickInfo: [
      { id: 1, label: "Tình trạng", value: hotel.status === "MAINTENANCE" ? "Đang bảo trì" : "Đang hoạt động" },
      { id: 2, label: "Hạng sao", value: hotel.rating ? `${hotel.rating} sao` : "Đang cập nhật" },
      { id: 3, label: "Khu vực", value: 
          hotel.provinceId === 1 ? "Thừa Thiên Huế" : 
          hotel.provinceId === 2 ? "Đà Nẵng" : 
          hotel.provinceId === 3 ? "Quảng Nam" :
          hotel.provinceId === 4 ? "Hà Nội" : 
          hotel.provinceId === 5 ? "TP. Hồ Chí Minh" : "Toàn quốc" 
      },
      { id: 4, label: "Thời lượng", value: hotel.estimatedDuration ? `${hotel.estimatedDuration} phút` : "Đang cập nhật" },
    ],
  };
};

/**
 * Lấy danh sách khách sạn từ API thật và thực hiện mapping sang HighlightItem
 */
export const getHotels = async (page = 0, size = 10): Promise<AxiosResponse<BackendResponse<PaginatedData<HighlightItem>>>> => {
  const response = await instance.get<BackendResponse<PaginatedData<BackendHotel>>>(`/hotels?page=${page}&size=${size}`);
  const data = response.data.data || (response.data as any).DT;

  // Thực hiện mapping dữ liệu ngay tại service để FE dễ sử dụng
  const mappedContent: HighlightItem[] = (data?.content || []).map((hotel: BackendHotel) => ({
    id: hotel.id.toString(),
    name: hotel.name || "Đang cập nhật",
    location: hotel.location || "Đang cập nhật",
    rating: hotel.rating || 0,
    reviews: hotel.reviewCount?.toString() || "0",
    image: hotel.imageUrl || "https://placehold.co/600x400?text=Hình+ảnh+đang+cập+nhật",
    desc: hotel.description || `Mô tả về ${hotel.name} đang được cập nhật.`,
    type: "bed",
    category: hotel.category || "khách sạn",
    price: hotel.averagePrice || 0,
    provinceId: hotel.provinceId || 0,
    previewVideo: hotel.previewVideo || undefined,
    status: hotel.status || "ACTIVE"
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
  const hotelData = response.data.data || (response.data as any).DT;
  
  // Chuyển đổi dữ liệu đơn giản từ BE thành dữ liệu phức tạp cho UI DestinationDetail
  const fullData = mapBackendHotelToFullDestination(hotelData);
  
  return {
    ...response,
    data: {
      ...response.data,
      data: fullData
    }
  } as any;
};
/**
 * Tìm kiếm khách sạn theo từ khóa (Tên hoặc Vị trí)
 */
export const getHotelsByKeyword = async (keyword: string, page = 0, size = 10): Promise<AxiosResponse<BackendResponse<PaginatedData<HighlightItem>>>> => {
  const response = await instance.get<BackendResponse<PaginatedData<BackendHotel>>>(`/hotels/search/by-keyword?keyword=${keyword}&page=${page}&size=${size}`);
  const data = response.data.data || (response.data as any).DT;

  const mappedContent: HighlightItem[] = (data?.content || []).map((hotel: BackendHotel) => ({
    id: hotel.id.toString(),
    name: hotel.name || "Đang cập nhật",
    location: hotel.location || "Đang cập nhật",
    rating: hotel.rating || 0,
    reviews: hotel.reviewCount?.toString() || "0",
    image: hotel.imageUrl || "https://placehold.co/600x400?text=Hình+ảnh+đang+cập+nhật",
    desc: hotel.description || `Mô tả về ${hotel.name} đang được cập nhật.`,
    type: "bed",
    category: hotel.category?.toLowerCase() || "khách sạn",
    price: hotel.averagePrice || 0,
    provinceId: hotel.provinceId || 0,
    previewVideo: hotel.previewVideo || undefined,
    status: hotel.status || "ACTIVE"
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
