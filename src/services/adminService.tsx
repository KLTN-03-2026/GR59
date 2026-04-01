import axios from 'axios';

const ADMIN_BASE_URL = 'http://127.0.0.1:8081';


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

// ─── API Methods ───────────────────────────────────────────────────────────

// Dashboard
export const fetchDashboardStats = () => axios.get<DashboardStat[]>(`${ADMIN_BASE_URL}/dashboard_stats`);
export const fetchRecentActivity = () => axios.get<RecentActivity[]>(`${ADMIN_BASE_URL}/recent_activity`);
export const fetchPopularLocations = () => axios.get<PopularLocation[]>(`${ADMIN_BASE_URL}/popular_locations`);

// Hotels
export const fetchHotelsList = () => axios.get<Hotel[]>(`${ADMIN_BASE_URL}/hotels`);
export const removeHotel = (id: string) => axios.delete(`${ADMIN_BASE_URL}/hotels/${id}`);

// Restaurants
export const fetchRestaurantsList = () => axios.get<Restaurant[]>(`${ADMIN_BASE_URL}/restaurants`);
export const removeRestaurant = (id: string) => axios.delete(`${ADMIN_BASE_URL}/restaurants/${id}`);

// Users
export const fetchUsersList = () => axios.get<DbUser[]>(`${ADMIN_BASE_URL}/users`);
export const removeUser = (id: string) => axios.delete(`${ADMIN_BASE_URL}/users/${id}`);

// Generic CRUD (for future use)
export const updateAdminRecord = <T,>(endpoint: string, id: string, data: Partial<T>) => 
  axios.patch<T>(`${ADMIN_BASE_URL}/${endpoint}/${id}`, data);

export const createAdminRecord = <T,>(endpoint: string, data: Omit<T, 'id'>) => 
  axios.post<T>(`${ADMIN_BASE_URL}/${endpoint}`, data);

export const removeAdminRecord = (endpoint: string, id: string) => 
  axios.delete(`${ADMIN_BASE_URL}/${endpoint}/${id}`);
