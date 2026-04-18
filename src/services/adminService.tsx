import instance from "../utils/AxiosCustomize";
import type { AxiosResponse } from "axios";

// ─── Interfaces ────────────────────────────────────────────────────────────

export interface Hotel {
  id: string | number;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  category: string | null;
  status: "ACTIVE" | "MAINTENANCE" | string;
  imageUrl: string;
  gallery: string[];
  averagePrice: number;
  estimatedDuration: number;
  provinceId: number;
  description: string;
  previewVideo?: string | null;
}

export interface Restaurant {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: string;
  cuisine: string;
  status: "ĐANG MỞ" | "TẠM ĐÓNG";
  image: string;
  previewVideo?: string;
  description: string;
  priceRange: string;
  gallery: string[];
  features: string[];
}

export interface ItineraryStep {
  time: string;
  activity: string;
  dist: string;
}

export interface Destination {
  id: string;
  title: string;
  location: string;
  heroImage: string; // Used in DestinationDetail
  img?: string; // Compatibility for db.json
  rating: string;
  reviews: string;
  distance: string;
  price: string;
  time: string;
  category: string;
  description: string;
  gallery: string[];
  status: "HOẠT ĐỘNG" | "BẢO TRÌ" | "ĐÓNG CỬA";
  previewVideo?: string;
  // Geo
  coordinates: {
    lat: number;
    lng: number;
  };
  travelTimeFromHanoi: string;
  mapScreenshot: string;
  // Detailed sections
  weatherCurrent: {
    temp: number;
    description: string;
    icon: string;
  };
  travelTips: {
    icon: string;
    title: string;
    content: string;
  }[];
  quickInfo: {
    id: number;
    label: string;
    value: string;
  }[];
  services: {
    id: number;
    type: string;
    name: string;
    location: string;
    price: string;
    unit: string;
    rating: number;
    image: string;
    buttonText: string;
  }[];
  // Itinerary fields
  type?: "pin" | "itinerary" | string;
  maxPeople?: number;
  duration?: string;
  steps?: ItineraryStep[];
}

export interface DbUser {
  id: string;
  username: string;
  email: string;
  password?: string;
  role: string;
  status: string;
  createdAt: string;
}

export interface DashboardStat {
  id: string;
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: string;
  colorClass: string;
  footerText?: string;
}

export interface RecentActivity {
  id: string;
  time: string;
  date: string;
  user: string;
  email: string;
  action: string;
  status: string;
  color: string;
  avatarId: number;
}

export interface PopularLocation {
  id: string;
  name: string;
  value: string;
  pct: number;
  color: string;
}

export interface BackendResponse<T = unknown> {
  status: number;
  message: string;
  data?: T;
  DT?: T;
}

// ─── Mock Data ─────────────────────────────────────────────────────────────

const MOCK_DASHBOARD_STATS: DashboardStat[] = [
  {
    id: "1",
    label: "TỔNG LƯỢT TRUY CẬP",
    value: "1.28M",
    trend: "+12% so với T9",
    trendUp: true,
    icon: "Eye",
    colorClass: "bgBlue",
  },
  {
    id: "2",
    label: "NGƯỜI DÙNG HOẠT ĐỘNG",
    value: "85,200",
    trend: "+8.4% so với T9",
    trendUp: true,
    icon: "Users",
    colorClass: "bgEmerald",
  },
  {
    id: "3",
    label: "CHUYẾN ĐI ĐÃ TẠO",
    value: "456k",
    trend: "+21% so với T9",
    trendUp: true,
    icon: "AirplaneTilt",
    colorClass: "bgOrange",
  },
  {
    id: "4",
    label: "ĐÁNH GIÁ MỚI",
    value: "12,480",
    trend: "+5% so với T9",
    trendUp: true,
    icon: "Star",
    colorClass: "bgPurple",
  },
];

const MOCK_RECENT_ACTIVITY: RecentActivity[] = [
  {
    id: "1",
    time: "14:20",
    date: "24/03/2026",
    user: "Nguyễn Văn An",
    email: "an.nguyen@email.com",
    action: 'Tạo chuyến đi "Hà Nội → Sapa 3N2Đ"',
    status: "Hoàn tất",
    color: "bgEmerald",
    avatarId: 1,
  },
  {
    id: "2",
    time: "13:55",
    date: "24/03/2026",
    user: "Trần Thị Mai",
    email: "mai.tran@email.com",
    action: "Cập nhật đánh giá Vinpearl Nha Trang",
    status: "Đang xử lý",
    color: "bgBlue",
    avatarId: 2,
  },
  {
    id: "3",
    time: "12:10",
    date: "24/03/2026",
    user: "Lê Minh Quân",
    email: "quan.lm@email.com",
    action: "Đăng ký tài khoản mới — xác minh email",
    status: "Hoàn tất",
    color: "bgEmerald",
    avatarId: 3,
  },
];

const MOCK_POPULAR_LOCATIONS: PopularLocation[] = [
  { id: "1", name: "Đà Nẵng", value: "85k", pct: 85, color: "#2563eb" },
  { id: "2", name: "Hà Nội", value: "72k", pct: 72, color: "#3b82f6" },
  { id: "3", name: "Phú Quốc", value: "64k", pct: 64, color: "#8b5cf6" },
];

const MOCK_HOTELS: Hotel[] = [
  {
    id: "AZ-1024",
    name: "Grand Azure Resort",
    location: "Đà Nẵng, Việt Nam",
    rating: 4.9,
    reviews: "2.4k",
    type: "RESORT",
    status: "HOẠT ĐỘNG",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=80&h=80&fit=crop",
    description:
      "Trải nghiệm nghỉ dưỡng đẳng cấp 5 sao bên bờ biển Đà Nẵng với dịch vụ spa chuyên nghiệp và hồ bơi vô cực.",
    price: "3.500.000đ",
    unit: "đêm",
    gallery: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
    ],
    amenities: ["Hồ bơi", "Spa", "Gym", "Nhà hàng", "Wifi miễn phí"],
  },
  {
    id: "AZ-2051",
    name: "Slate Heritage Palace",
    location: "Hà Nội, Việt Nam",
    rating: 4.7,
    reviews: "1.8k",
    type: "CỔ ĐIỂN",
    status: "BẢO TRÌ",
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=80&h=80&fit=crop",
    description:
      "Khách sạn mang phong cách kiến trúc Pháp cổ kính nằm ngay trung tâm phố cổ Hà Nội.",
    price: "2.200.000đ",
    unit: "đêm",
    gallery: [
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800",
    ],
    amenities: ["Bar", "Nhà hàng", "Phòng họp", "Dịch vụ phòng"],
  },
];

const MOCK_RESTAURANTS: Restaurant[] = [
  {
    id: "RS-4821",
    name: "The Azure Kitchen",
    location: "Quận 1, TP. Hồ Chí Minh",
    rating: 4.8,
    reviews: "1.2k",
    cuisine: "VIỆT NAM",
    status: "ĐANG MỞ",
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=80&h=80&fit=crop",
    description:
      "Nhà hàng chuyên các món ăn Việt Nam truyền thống với phong cách chế biến hiện đại.",
    priceRange: "500.000đ - 2.000.000đ",
    gallery: [
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800",
    ],
    features: ["Chỗ để xe", "Phòng VIP", "Thanh toán thẻ", "View đẹp"],
  },
];

const MOCK_DESTINATIONS: Destination[] = [
  {
    id: "1",
    title: "Vịnh Hạ Long",
    location: "QUẢNG NINH, VIỆT NAM",
    heroImage:
      "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800",
    img: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800",
    rating: "4.8",
    reviews: "2.3k",
    distance: "165 km",
    price: "1.5tr - 5tr VNĐ",
    time: "2-3 ngày",
    category: "Di sản",
    description:
      "Vịnh Hạ Long là di sản thiên nhiên thế giới nổi tiếng với hàng ngàn đảo đá vôi kỳ vĩ.",
    gallery: [
      "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800",
    ],
    status: "HOẠT ĐỘNG",
    coordinates: { lat: 20.9101, lng: 107.1839 },
    travelTimeFromHanoi: "2h 30m",
    mapScreenshot:
      "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?q=80&w=600",
    previewVideo: "",
    type: "pin",
    weatherCurrent: {
      temp: 28,
      description: "Trời nắng đẹp",
      icon: "CloudSun",
    },
    travelTips: [
      {
        icon: "Camera",
        title: "Máy ảnh & Ống kính",
        content: "Nên mang theo máy ảnh để ghi lại cảnh đẹp.",
      },
    ],
    quickInfo: [{ id: 1, label: "Giờ mở cửa", value: "24/7" }],
    services: [
      {
        id: 1,
        type: "Khách sạn",
        name: "Vinpearl Resort",
        location: "Hạ Long",
        price: "2.500.000đ",
        unit: "đêm",
        rating: 4.9,
        image:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400",
        buttonText: "Đặt ngay",
      },
    ],
  },
  {
    id: "19",
    title: "Hành trình Di sản miền Trung",
    location: "Miền Trung, Việt Nam",
    heroImage:
      "https://images.unsplash.com/photo-1555921015-5532091f6026?q=80&w=800",
    img: "https://images.unsplash.com/photo-1555921015-5532091f6026?q=80&w=800",
    rating: "4.9",
    reviews: "1.5k",
    distance: "50 km",
    price: "1.500.000đ",
    time: "3 ngày 2 đêm",
    category: "Văn hóa",
    description: "Khám phá các di sản văn hóa tại miền Trung Việt Nam.",
    gallery: [
      "https://images.unsplash.com/photo-1555921015-5532091f6026?q=80&w=800",
    ],
    status: "HOẠT ĐỘNG",
    coordinates: { lat: 16.0471, lng: 108.2062 },
    travelTimeFromHanoi: "1h 15m bay",
    mapScreenshot: "",
    previewVideo: "",
    type: "itinerary",
    maxPeople: 5,
    duration: "3 Ngày 2 Đêm",
    weatherCurrent: { temp: 25, description: "Mát mẻ", icon: "Sun" },
    travelTips: [],
    quickInfo: [],
    services: [],
    steps: [
      {
        time: "08:00",
        activity: "Đón khách tại sân bay Đà Nẵng",
        dist: "2km từ TT",
      },
    ],
  },
];

const MOCK_USERS: DbUser[] = [
  {
    id: "06ba",
    username: "nguyễn quang long",
    email: "nguyenquanglong100285@gmail.com",
    role: "ADMIN",
    status: "ACTIVE",
    createdAt: "2026-03-28T03:43:40.064Z",
  },
];

// ─── API Methods ───────────────────────────────────────────────────────────

// Standard function declaration avoids JSX-related generic issues in .tsx files
function wrapMockRes<T>(mockData: T): AxiosResponse<BackendResponse<T>> {
  return {
    data: { status: 200, message: "Mock data", DT: mockData, data: mockData },
    status: 200,
    statusText: "OK",
    headers: {},
    config: {} as AxiosResponse<unknown>["config"],
  };
}

// Dashboard
export const fetchDashboardStats = (): Promise<
  AxiosResponse<BackendResponse<DashboardStat[]>>
> =>
  instance
    .get<BackendResponse<DashboardStat[]>>("/dashboard_stats")
    .catch(() => wrapMockRes(MOCK_DASHBOARD_STATS));

export const fetchRecentActivity = (): Promise<
  AxiosResponse<BackendResponse<RecentActivity[]>>
> =>
  instance
    .get<BackendResponse<RecentActivity[]>>("/recent_activity")
    .catch(() => wrapMockRes(MOCK_RECENT_ACTIVITY));

export const fetchPopularLocations = (): Promise<
  AxiosResponse<BackendResponse<PopularLocation[]>>
> =>
  instance
    .get<BackendResponse<PopularLocation[]>>("/popular_locations")
    .catch(() => wrapMockRes(MOCK_POPULAR_LOCATIONS));

// Hotels
export const fetchHotelsList = (page = 0, size = 10): Promise<
  AxiosResponse<BackendResponse<{ content: Hotel[]; page: any }>>
> =>
  instance
    .get<BackendResponse<{ content: Hotel[]; page: any }>>(`/hotels?page=${page}&size=${size}`)
    .catch(() => wrapMockRes({ content: MOCK_HOTELS as any[], page: { totalElements: MOCK_HOTELS.length, totalPages: 1 } }));

export const removeHotel = (
  id: string | number,
): Promise<AxiosResponse<BackendResponse<unknown>>> =>
  instance
    .delete<BackendResponse<unknown>>(`/hotels/${id}`)
    .catch(() => wrapMockRes({}));

export const createHotel = (
  formData: FormData,
): Promise<AxiosResponse<BackendResponse<Hotel>>> =>
  instance.post<BackendResponse<Hotel>>("/hotels", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateHotel = (
  id: string | number,
  formData: FormData,
): Promise<AxiosResponse<BackendResponse<Hotel>>> =>
  instance.put<BackendResponse<Hotel>>(`/hotels/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Restaurants
export const fetchRestaurantsList = (): Promise<
  AxiosResponse<BackendResponse<Restaurant[]>>
> =>
  instance
    .get<BackendResponse<Restaurant[]>>("/restaurants")
    .catch(() => wrapMockRes(MOCK_RESTAURANTS));

export const createRestaurant = (
  formData: FormData,
): Promise<AxiosResponse<BackendResponse<Restaurant>>> =>
  instance.post<BackendResponse<Restaurant>>("/restaurants", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateRestaurant = (
  id: string | number,
  formData: FormData,
): Promise<AxiosResponse<BackendResponse<Restaurant>>> =>
  instance.put<BackendResponse<Restaurant>>(`/restaurants/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const removeRestaurant = (
  id: string,
): Promise<AxiosResponse<BackendResponse<unknown>>> =>
  instance
    .delete<BackendResponse<unknown>>(`/restaurants/${id}`)
    .catch(() => wrapMockRes({}));

// Users
export const fetchUsersList = (): Promise<
  AxiosResponse<BackendResponse<DbUser[]>>
> =>
  instance
    .get<BackendResponse<DbUser[]>>("/users")
    .catch(() => wrapMockRes(MOCK_USERS));

export const removeUser = (
  id: string,
): Promise<AxiosResponse<BackendResponse<unknown>>> =>
  instance
    .delete<BackendResponse<unknown>>(`/users/${id}`)
    .catch(() => wrapMockRes({}));

// Attractions (Địa điểm)
export const fetchAttractionsList = (): Promise<
  AxiosResponse<BackendResponse<Destination[]>>
> =>
  instance
    .get<BackendResponse<Destination[]>>("/attractions")
    .catch(() => wrapMockRes(MOCK_DESTINATIONS));

export const createAttraction = (
  formData: FormData,
): Promise<AxiosResponse<BackendResponse<Destination>>> =>
  instance.post<BackendResponse<Destination>>("/attractions", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const updateAttraction = (
  id: string | number,
  formData: FormData,
): Promise<AxiosResponse<BackendResponse<Destination>>> =>
  instance.put<BackendResponse<Destination>>(`/attractions/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

export const removeAttraction = (
  id: string,
): Promise<AxiosResponse<BackendResponse<unknown>>> =>
  instance
    .delete<BackendResponse<unknown>>(`/attractions/${id}`)
    .catch(() => wrapMockRes({}));

// Generic CRUD
export function updateAdminRecord<T>(
  endpoint: string,
  id: string,
  data: Partial<T>,
): Promise<AxiosResponse<BackendResponse<T>>> {
  return instance
    .patch<BackendResponse<T>>(`/${endpoint}/${id}`, data)
    .catch(() => wrapMockRes(data as T));
}

export function createAdminRecord<T>(
  endpoint: string,
  data: Omit<T, "id">,
): Promise<AxiosResponse<BackendResponse<T>>> {
  return instance
    .post<BackendResponse<T>>(`/${endpoint}`, data)
    .catch(() =>
      wrapMockRes({ ...data, id: "mock-" + Date.now() } as unknown as T),
    );
}

export function removeAdminRecord(
  endpoint: string,
  id: string,
): Promise<AxiosResponse<BackendResponse<unknown>>> {
  return instance
    .delete<BackendResponse<unknown>>(`/${endpoint}/${id}`)
    .catch(() => wrapMockRes({}));
}

export const uploadAdminImage = async (
  file: File,
): Promise<AxiosResponse<BackendResponse<{ imageUrl: string }>>> => {
  const formData = new FormData();
  formData.append("file", file);
  return await instance.post<BackendResponse<{ imageUrl: string }>>(
    "/users/avatar", // Sử dụng endpoint upload tập trung
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
};
