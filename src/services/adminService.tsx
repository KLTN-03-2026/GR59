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
  id: string | number;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  category: string | null;
  status: string;
  imageUrl: string;
  gallery: string[];
  averagePrice: number;
  estimatedDuration: number;
  provinceId: number;
  description: string;
  previewVideo?: string | null;
}

export interface ItineraryStep {
  time: string;
  activity: string;
  dist: string;
}

export interface Destination {
  id: string | number;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  category: string | null;
  status: string;
  imageUrl: string;
  gallery: string[];
  averagePrice: number;
  estimatedDuration: number;
  provinceId: number;
  description: string;
  previewVideo?: string | null;
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

// ─── API Methods ───────────────────────────────────────────────────────────

// Dashboard
export const fetchDashboardStats = (): Promise<
  AxiosResponse<BackendResponse<DashboardStat[]>>
> => instance.get<BackendResponse<DashboardStat[]>>("/dashboard_stats");

export const fetchRecentActivity = (): Promise<
  AxiosResponse<BackendResponse<RecentActivity[]>>
> => instance.get<BackendResponse<RecentActivity[]>>("/recent_activity");

export const fetchPopularLocations = (): Promise<
  AxiosResponse<BackendResponse<PopularLocation[]>>
> => instance.get<BackendResponse<PopularLocation[]>>("/popular_locations");

// Hotels
export const fetchHotelsList = (page = 0, size = 10): Promise<
  AxiosResponse<BackendResponse<{ content: Hotel[]; page: any }>>
> => instance.get<BackendResponse<{ content: Hotel[]; page: any }>>(`/hotels?page=${page}&size=${size}`);

export const searchHotelsByKeyword = (keyword: string, page = 0, size = 10): Promise<
  AxiosResponse<BackendResponse<{ content: Hotel[]; page: any }>>
> => instance.get<BackendResponse<{ content: Hotel[]; page: any }>>(`/hotels/search/by-keyword?keyword=${keyword}&page=${page}&size=${size}`);

export const removeHotel = (
  id: string | number,
): Promise<AxiosResponse<BackendResponse<unknown>>> =>
  instance.delete<BackendResponse<unknown>>(`/hotels/${id}`);

export const createHotel = (
  formData: FormData,
): Promise<AxiosResponse<BackendResponse<Hotel>>> =>
  instance.post<BackendResponse<Hotel>>("/hotels", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateHotel = (
  id: string | number,
  formData: FormData,
): Promise<AxiosResponse<BackendResponse<Hotel>>> =>
  instance.put<BackendResponse<Hotel>>(`/hotels/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

// Restaurants
export const fetchRestaurantsList = (page = 0, size = 10): Promise<
  AxiosResponse<BackendResponse<{ content: Restaurant[]; page: any }>>
> => instance.get<BackendResponse<{ content: Restaurant[]; page: any }>>(`/restaurants?page=${page}&size=${size}`);

export const searchRestaurantsByKeyword = (keyword: string, page = 0, size = 10): Promise<
  AxiosResponse<BackendResponse<{ content: Restaurant[]; page: any }>>
> => instance.get<BackendResponse<{ content: Restaurant[]; page: any }>>(`/restaurants/search/by-keyword?keyword=${keyword}&page=${page}&size=${size}`);

export const createRestaurant = (
  formData: FormData,
): Promise<AxiosResponse<BackendResponse<Restaurant>>> =>
  instance.post<BackendResponse<Restaurant>>("/restaurants", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateRestaurant = (
  id: string | number,
  formData: FormData,
): Promise<AxiosResponse<BackendResponse<Restaurant>>> =>
  instance.put<BackendResponse<Restaurant>>(`/restaurants/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const removeRestaurant = (
  id: string | number,
): Promise<AxiosResponse<BackendResponse<unknown>>> =>
  instance.delete<BackendResponse<unknown>>(`/restaurants/${id}`);

// Users
export const fetchUsersList = (page = 0, size = 10): Promise<
  AxiosResponse<BackendResponse<{ content: DbUser[]; page: any }>>
> => instance.get<BackendResponse<{ content: DbUser[]; page: any }>>(`/users?page=${page}&size=${size}`);

export const removeUser = (
  id: string | number,
): Promise<AxiosResponse<BackendResponse<unknown>>> =>
  instance.delete<BackendResponse<unknown>>(`/users/${id}`);

// Attractions (Địa điểm)
export const fetchAttractionsList = (page = 0, size = 10): Promise<
  AxiosResponse<BackendResponse<{ content: Destination[]; page: any }>>
> => instance.get<BackendResponse<{ content: Destination[]; page: any }>>(`/attractions?page=${page}&size=${size}`);

export const searchAttractionsByKeyword = (keyword: string, page = 0, size = 10): Promise<
  AxiosResponse<BackendResponse<{ content: Destination[]; page: any }>>
> => instance.get<BackendResponse<{ content: Destination[]; page: any }>>(`/attractions/search/by-keyword?keyword=${keyword}&page=${page}&size=${size}`);

export const createAttraction = (
  formData: FormData,
): Promise<AxiosResponse<BackendResponse<Destination>>> =>
  instance.post<BackendResponse<Destination>>("/attractions", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateAttraction = (
  id: string | number,
  formData: FormData,
): Promise<AxiosResponse<BackendResponse<Destination>>> =>
  instance.put<BackendResponse<Destination>>(`/attractions/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const removeAttraction = (
  id: string | number,
): Promise<AxiosResponse<BackendResponse<unknown>>> =>
  instance.delete<BackendResponse<unknown>>(`/attractions/${id}`);


export const uploadAdminImage = async (
  file: File,
): Promise<AxiosResponse<BackendResponse<{ imageUrl: string }>>> => {
  const formData = new FormData();
  formData.append("file", file);
  return await instance.post<BackendResponse<{ imageUrl: string }>>(
    "/users/avatar",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};
