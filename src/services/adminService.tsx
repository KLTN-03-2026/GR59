import instance from "../utils/AxiosCustomize";
import type { AxiosResponse } from "axios";

// ─── Interfaces ────────────────────────────────────────────────────────────

export interface Hotel {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: string;
  type: string;
  status: string;
  image: string;
}

export interface Restaurant {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: string;
  cuisine: string;
  status: string;
  image: string;
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
  { "id": "1", "label": "TỔNG LƯỢT TRUY CẬP", "value": "1.28M", "trend": "+12% so với T9", "trendUp": true, "icon": "Eye", "colorClass": "bgBlue" },
  { "id": "2", "label": "NGƯỜI DÙNG HOẠT ĐỘNG", "value": "85,200", "trend": "+8.4% so với T9", "trendUp": true, "icon": "Users", "colorClass": "bgEmerald" },
  { "id": "3", "label": "CHUYẾN ĐI ĐÃ TẠO", "value": "456k", "trend": "+21% so với T9", "trendUp": true, "icon": "AirplaneTilt", "colorClass": "bgOrange" },
  { "id": "4", "label": "ĐÁNH GIÁ MỚI", "value": "12,480", "trend": "+5% so với T9", "trendUp": true, "icon": "Star", "colorClass": "bgPurple" }
];

const MOCK_RECENT_ACTIVITY: RecentActivity[] = [
  { "id": "1", "time": "14:20", "date": "24/03/2026", "user": "Nguyễn Văn An", "email": "an.nguyen@email.com", "action": "Tạo chuyến đi \"Hà Nội → Sapa 3N2Đ\"", "status": "Hoàn tất", "color": "bgEmerald", "avatarId": 1 },
  { "id": "2", "time": "13:55", "date": "24/03/2026", "user": "Trần Thị Mai", "email": "mai.tran@email.com", "action": "Cập nhật đánh giá Vinpearl Nha Trang", "status": "Đang xử lý", "color": "bgBlue", "avatarId": 2 },
  { "id": "3", "time": "12:10", "date": "24/03/2026", "user": "Lê Minh Quân", "email": "quan.lm@email.com", "action": "Đăng ký tài khoản mới — xác minh email", "status": "Hoàn tất", "color": "bgEmerald", "avatarId": 3 }
];

const MOCK_POPULAR_LOCATIONS: PopularLocation[] = [
  { "id": "1", "name": "Đà Nẵng", "value": "85k", "pct": 85, "color": "#2563eb" },
  { "id": "2", "name": "Hà Nội", "value": "72k", "pct": 72, "color": "#3b82f6" },
  { "id": "3", "name": "Phú Quốc", "value": "64k", "pct": 64, "color": "#8b5cf6" }
];

const MOCK_HOTELS: Hotel[] = [
  { "id": "AZ-1024", "name": "Grand Azure Resort", "location": "Đà Nẵng, Việt Nam", "rating": 4.9, "reviews": "2.4k", "type": "RESORT", "status": "HOẠT ĐỘNG", "image": "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=80&h=80&fit=crop" },
  { "id": "AZ-2051", "name": "Slate Heritage Palace", "location": "Hà Nội, Việt Nam", "rating": 4.7, "reviews": "1.8k", "type": "CỔ ĐIỂN", "status": "BẢO TRÌ", "image": "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=80&h=80&fit=crop" }
];

const MOCK_RESTAURANTS: Restaurant[] = [
  { "id": "RS-4821", "name": "The Azure Kitchen", "location": "Quận 1, TP. Hồ Chí Minh", "rating": 4.8, "reviews": "1.2k", "cuisine": "VIỆT NAM", "status": "ĐANG MỞ", "image": "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=80&h=80&fit=crop" }
];

const MOCK_USERS: DbUser[] = [
  { "id": "06ba", "username": "nguyễn quang long", "email": "nguyenquanglong100285@gmail.com", "role": "ADMIN", "status": "ACTIVE", "createdAt": "2026-03-28T03:43:40.064Z" }
];

// ─── API Methods ───────────────────────────────────────────────────────────

// Standard function declaration avoids JSX-related generic issues in .tsx files
function wrapMockRes<T>(mockData: T): AxiosResponse<BackendResponse<T>> {
  return {
    data: { status: 200, message: "Mock data", DT: mockData, data: mockData },
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {} as any
  };
}

// Dashboard
export const fetchDashboardStats = (): Promise<AxiosResponse<BackendResponse<DashboardStat[]>>> => 
  instance.get<BackendResponse<DashboardStat[]>>("/dashboard_stats").catch(() => wrapMockRes(MOCK_DASHBOARD_STATS));

export const fetchRecentActivity = (): Promise<AxiosResponse<BackendResponse<RecentActivity[]>>> => 
  instance.get<BackendResponse<RecentActivity[]>>("/recent_activity").catch(() => wrapMockRes(MOCK_RECENT_ACTIVITY));

export const fetchPopularLocations = (): Promise<AxiosResponse<BackendResponse<PopularLocation[]>>> => 
  instance.get<BackendResponse<PopularLocation[]>>("/popular_locations").catch(() => wrapMockRes(MOCK_POPULAR_LOCATIONS));

// Hotels
export const fetchHotelsList = (): Promise<AxiosResponse<BackendResponse<Hotel[]>>> => 
  instance.get<BackendResponse<Hotel[]>>("/hotels").catch(() => wrapMockRes(MOCK_HOTELS));

export const removeHotel = (id: string): Promise<AxiosResponse<BackendResponse<any>>> => 
  instance.delete<BackendResponse<any>>(`/hotels/${id}`).catch(() => wrapMockRes({}));

// Restaurants
export const fetchRestaurantsList = (): Promise<AxiosResponse<BackendResponse<Restaurant[]>>> => 
  instance.get<BackendResponse<Restaurant[]>>("/restaurants").catch(() => wrapMockRes(MOCK_RESTAURANTS));

export const removeRestaurant = (id: string): Promise<AxiosResponse<BackendResponse<any>>> => 
  instance.delete<BackendResponse<any>>(`/restaurants/${id}`).catch(() => wrapMockRes({}));

// Users
export const fetchUsersList = (): Promise<AxiosResponse<BackendResponse<DbUser[]>>> => 
  instance.get<BackendResponse<DbUser[]>>("/users").catch(() => wrapMockRes(MOCK_USERS));

export const removeUser = (id: string): Promise<AxiosResponse<BackendResponse<any>>> => 
  instance.delete<BackendResponse<any>>(`/users/${id}`).catch(() => wrapMockRes({}));

// Generic CRUD
export function updateAdminRecord<T>(endpoint: string, id: string, data: Partial<T>): Promise<AxiosResponse<BackendResponse<T>>> {
  return instance.patch<BackendResponse<T>>(`/${endpoint}/${id}`, data).catch(() => wrapMockRes(data as T));
}

export function createAdminRecord<T>(endpoint: string, data: Omit<T, 'id'>): Promise<AxiosResponse<BackendResponse<T>>> {
  return instance.post<BackendResponse<T>>(`/${endpoint}`, data).catch(() => wrapMockRes({ ...data, id: 'mock-' + Date.now() } as any));
}

export function removeAdminRecord(endpoint: string, id: string): Promise<AxiosResponse<BackendResponse<any>>> {
  return instance.delete<BackendResponse<any>>(`/${endpoint}/${id}`).catch(() => wrapMockRes({}));
}
