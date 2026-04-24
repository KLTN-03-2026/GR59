import instance from "../utils/AxiosCustomize";
import type { AxiosResponse } from "axios";

// ─── Interfaces ────────────────────────────────────────────────────────────

export interface Hotel {
  id: string | number;
  name: string;
  location: string;
  addressDetailed: string | null;
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
  addressDetailed: string | null;
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
  addressDetailed: string | null;
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
  id: number;
  email: string;
  fullName: string;
  address: string | null;
  phone: string | null;
  avatarUrl: string | null;
  bio: string | null;
  roleId: number;
  roleName: string;
  isActive: boolean;
  isEmailVerified: boolean;
  googleId: string | null;
  facebookId: string | null;
  isGoogleLinked: boolean;
  isFacebookLinked: boolean;
  createdAt: string;
  updatedAt: string;
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
  color: string;
}

export interface PageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
  isFeatured: boolean;
  authorId?: number;
  authorName?: string;
}

export interface AdminReview {
  id: number;
  userId: number;
  userName: string;
  userImage: string;
  hotelId: number | null;
  restaurantId: number | null;
  attractionId: number | null;
  type: "HOTEL" | "RESTAURANT" | "ATTRACTION" | "WEBSITE" | "TRIP";
  rating: number;
  comment: string;
  status: "ACTIVE" | "HIDDEN";
  createdAt: string;
  updatedAt: string;
  images: string[];
  provinceName?: string;
  nameService?: string;
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
  AxiosResponse<BackendResponse<{ content: Hotel[]; page: PageInfo }>>
> => instance.get<BackendResponse<{ content: Hotel[]; page: PageInfo }>>(`/hotels?page=${page}&size=${size}`);

export const searchHotelsByKeyword = (keyword: string, page = 0, size = 10): Promise<
  AxiosResponse<BackendResponse<{ content: Hotel[]; page: PageInfo }>>
> => instance.get<BackendResponse<{ content: Hotel[]; page: PageInfo }>>(`/hotels/search/by-keyword?keyword=${keyword}&page=${page}&size=${size}`);

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

export const fetchHotelDetail = (
  id: string | number,
): Promise<AxiosResponse<BackendResponse<Hotel>>> =>
  instance.get<BackendResponse<Hotel>>(`/hotels/${id}`);

// Restaurants
export const fetchRestaurantsList = (page = 0, size = 10): Promise<
  AxiosResponse<BackendResponse<{ content: Restaurant[]; page: PageInfo }>>
> => instance.get<BackendResponse<{ content: Restaurant[]; page: PageInfo }>>(`/restaurants?page=${page}&size=${size}`);

export const searchRestaurantsByKeyword = (keyword: string, page = 0, size = 10): Promise<
  AxiosResponse<BackendResponse<{ content: Restaurant[]; page: PageInfo }>>
> => instance.get<BackendResponse<{ content: Restaurant[]; page: PageInfo }>>(`/restaurants/search/by-keyword?keyword=${keyword}&page=${page}&size=${size}`);

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

export const fetchRestaurantDetail = (
  id: string | number,
): Promise<AxiosResponse<BackendResponse<Restaurant>>> =>
  instance.get<BackendResponse<Restaurant>>(`/restaurants/${id}`);

// Users
export const fetchUsersList = (page = 0, size = 10): Promise<
  AxiosResponse<BackendResponse<{ content: DbUser[]; page: PageInfo }>>
> => {
  const token = localStorage.getItem("accessToken");
  return instance.get<BackendResponse<{ content: DbUser[]; page: PageInfo }>>(`/admin/users?page=${page}&size=${size}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const searchUsersByKeyword = (keyword: string, page = 0, size = 10): Promise<
  AxiosResponse<BackendResponse<{ content: DbUser[]; page: PageInfo }>>
> => {
  const token = localStorage.getItem("accessToken");
  return instance.get<BackendResponse<{ content: DbUser[]; page: PageInfo }>>(
    `/admin/users/search?keyword=${keyword}&page=${page}&size=${size}`, 
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

export const fetchUsersByStatus = (isActive: boolean, page = 0, size = 10): Promise<
  AxiosResponse<BackendResponse<{ content: DbUser[]; page: PageInfo }>>
> => {
  const token = localStorage.getItem("accessToken");
  return instance.get<BackendResponse<{ content: DbUser[]; page: PageInfo }>>(
    `/admin/users/filter/status?isActive=${isActive}&page=${page}&size=${size}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
};

export const fetchUserDetail = (
  id: string | number,
): Promise<AxiosResponse<BackendResponse<DbUser>>> => {
  const token = localStorage.getItem("accessToken");
  return instance.get<BackendResponse<DbUser>>(`/admin/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const createUser = (
  data: Partial<DbUser>,
): Promise<AxiosResponse<BackendResponse<DbUser>>> => {
  const token = localStorage.getItem("accessToken");
  return instance.post<BackendResponse<DbUser>>("/admin/users", data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const updateUser = (
  id: string | number,
  data: Partial<DbUser>,
): Promise<AxiosResponse<BackendResponse<DbUser>>> => {
  const token = localStorage.getItem("accessToken");
  return instance.put<BackendResponse<DbUser>>(`/admin/users/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const lockUser = (id: string | number): Promise<AxiosResponse<BackendResponse<unknown>>> => {
  const token = localStorage.getItem("accessToken");
  return instance.put(`/admin/users/${id}/lock`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const unlockUser = (id: string | number): Promise<AxiosResponse<BackendResponse<unknown>>> => {
  const token = localStorage.getItem("accessToken");
  return instance.put(`/admin/users/${id}/unlock`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const removeUser = (
  id: string | number,
): Promise<AxiosResponse<BackendResponse<unknown>>> => {
  const token = localStorage.getItem("accessToken");
  return instance.delete<BackendResponse<unknown>>(`/admin/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

// Attractions (Địa điểm)
export const fetchAttractionsList = (page = 0, size = 10): Promise<
  AxiosResponse<BackendResponse<{ content: Destination[]; page: PageInfo }>>
> => instance.get<BackendResponse<{ content: Destination[]; page: PageInfo }>>(`/attractions?page=${page}&size=${size}`);

export const searchAttractionsByKeyword = (keyword: string, page = 0, size = 10): Promise<
  AxiosResponse<BackendResponse<{ content: Destination[]; page: PageInfo }>>
> => instance.get<BackendResponse<{ content: Destination[]; page: PageInfo }>>(`/attractions/search/by-keyword?keyword=${keyword}&page=${page}&size=${size}`);

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

export const fetchAttractionDetail = (
  id: string | number,
): Promise<AxiosResponse<BackendResponse<Destination>>> =>
  instance.get<BackendResponse<Destination>>(`/attractions/${id}`);



// News / Posts
export const fetchNewsList = (page = 0, size = 10): Promise<
  AxiosResponse<BackendResponse<{ content: NewsItem[]; page: PageInfo }>>
> => {
  const token = localStorage.getItem("accessToken");
  return instance.get<BackendResponse<{ content: NewsItem[]; page: PageInfo }>>(`/news/admin/all?page=${page}&size=${size}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const createNews = (
  formData: FormData,
): Promise<AxiosResponse<BackendResponse<NewsItem>>> => {
  const token = localStorage.getItem("accessToken");
  return instance.post<BackendResponse<NewsItem>>("/news", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`
    }
  });
};

export const updateNews = (
  id: string | number,
  formData: FormData,
): Promise<AxiosResponse<BackendResponse<NewsItem>>> => {
  const token = localStorage.getItem("accessToken");
  return instance.put<BackendResponse<NewsItem>>(`/news/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`
    }
  });
};

export const removeNews = (
  id: string | number,
): Promise<AxiosResponse<BackendResponse<unknown>>> =>
  instance.delete<BackendResponse<unknown>>(`/news/${id}`);

export const toggleNewsFeatured = (
  id: string | number,
): Promise<AxiosResponse<BackendResponse<unknown>>> => {
  const token = localStorage.getItem("accessToken");
  return instance.patch<BackendResponse<unknown>>(`/news/${id}/featured`, {}, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Reviews
export const fetchAdminReviewsList = (page = 0, size = 10): Promise<
  AxiosResponse<BackendResponse<{ content: AdminReview[]; page: PageInfo }>>
> => {
  const token = localStorage.getItem("accessToken");
  return instance.get<BackendResponse<{ content: AdminReview[]; page: PageInfo }>>(
    `/admin/reviews?page=${page}&size=${size}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

export const fetchReviewDetail = (
  id: string | number
): Promise<AxiosResponse<BackendResponse<AdminReview>>> => {
  const token = localStorage.getItem("accessToken");
  return instance.get<BackendResponse<AdminReview>>(`/admin/reviews/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

export const updateReviewStatus = (
  id: string | number,
  status: "ACTIVE" | "HIDDEN"
): Promise<AxiosResponse<BackendResponse<AdminReview>>> => {
  const token = localStorage.getItem("accessToken");
  return instance.patch<BackendResponse<AdminReview>>(
    `/admin/reviews/${id}/status`,
    null,
    { 
      params: { status },
      headers: { Authorization: `Bearer ${token}` } 
    }
  );
};

export const removeReview = (
  id: string | number,
): Promise<AxiosResponse<BackendResponse<unknown>>> => {
  const token = localStorage.getItem("accessToken");
  return instance.delete<BackendResponse<unknown>>(`/admin/reviews/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};


export const fetchReviewsByTarget = (
  type: "hotel" | "restaurant" | "attraction",
  id: string | number,
  page = 0,
  size = 10
): Promise<AxiosResponse<BackendResponse<{ content: AdminReview[]; page: PageInfo }>>> => {
  const token = localStorage.getItem("accessToken");
  return instance.get<BackendResponse<{ content: AdminReview[]; page: PageInfo }>>(
    `/admin/reviews/${type}/${id}?page=${page}&size=${size}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
};

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
