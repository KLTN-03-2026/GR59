import { useState, useEffect } from 'react';
import * as adminService from '../../../services/adminService';

// Re-export types from service so view components don't break
export type { 
  Hotel, 
  Restaurant, 
  DbUser, 
  DashboardStat, 
  RecentActivity, 
  PopularLocation 
} from '../../../services/adminService';

// ─── Generic hook ─────────────────────────────────────────────────────────────

function useCollection<T>(fetchFn: () => Promise<{ data: T[] }>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchFn();
      setData(response.data);
    } catch (err) {
      setError('Không thể kết nối tới máy chủ. Hãy chắc chắn json-server (port 8081) đang chạy.');

      console.error(`[useAdminData] Fetch failed:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [fetchFn]);

  return { data, loading, error, refetch: fetchData };
}

// ─── Specific hooks ───────────────────────────────────────────────────────────

export const useHotels = () => useCollection(adminService.fetchHotelsList);
export const useRestaurants = () => useCollection(adminService.fetchRestaurantsList);
export const useDbUsers = () => useCollection(adminService.fetchUsersList);
export const useDashboardStats = () => useCollection(adminService.fetchDashboardStats);
export const useRecentActivity = () => useCollection(adminService.fetchRecentActivity);
export const usePopularLocations = () => useCollection(adminService.fetchPopularLocations);

// ─── CRUD helpers (delegating to adminService) ────────────────────────────────

export const deleteRecord = async (endpoint: string, id: string): Promise<void> => {
  switch (endpoint) {
    case 'hotels': return (await adminService.removeHotel(id)).data;
    case 'restaurants': return (await adminService.removeRestaurant(id)).data;
    case 'users': return (await adminService.removeUser(id)).data;
    default: return (await adminService.removeAdminRecord(endpoint, id)).data;
  }
};

export const updateRecord = async <T>(endpoint: string, id: string, data: Partial<T>): Promise<T> => {
  const response = await adminService.updateAdminRecord<T>(endpoint, id, data);
  return response.data;
};

export const createRecord = async <T>(endpoint: string, data: Omit<T, 'id'>): Promise<T> => {
  const response = await adminService.createAdminRecord<T>(endpoint, data);
  return response.data;
};
