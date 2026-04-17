import { useState, useEffect } from 'react';
import * as adminService from '../../../services/adminService';

// Re-export types from service so view components don't break
export type { 
  Hotel, 
  Restaurant, 
  DbUser, 
  DashboardStat, 
  RecentActivity, 
  PopularLocation,
  Destination 
} from '../../../services/adminService';

// ─── Generic hook ─────────────────────────────────────────────────────────────

function useCollection<T>(fetchFn: (...args: any[]) => Promise<any>) {
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState({ totalPages: 1, totalElements: 0, currentPage: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (...args: any[]) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchFn(...args);
      
      const resData = response.data?.DT || response.data?.data || response.data;
      
      // Kiểm tra nếu là dữ liệu phân trang (có content) hay mảng đơn thuần
      if (resData && typeof resData === 'object' && 'content' in resData) {
        setData(resData.content || []);
        if (resData.page) {
          setPagination({
            totalPages: resData.page.totalPages || 1,
            totalElements: resData.page.totalElements || 0,
            currentPage: resData.page.number || 0
          });
        }
      } else {
        setData(Array.isArray(resData) ? resData : []);
      }
    } catch (err) {
      setError('Không thể kết nối tới máy chủ.');
      console.error(`[useAdminData] Fetch failed:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Chỉ gọi lần đầu, việc fetch phân trang sẽ do View gọi refetch với args

  return { data, pagination, loading, error, refetch: fetchData };
}

// ─── Specific hooks ───────────────────────────────────────────────────────────

export const useHotels = () => useCollection<adminService.Hotel>(adminService.fetchHotelsList);
export const useRestaurants = () => useCollection<adminService.Restaurant>(adminService.fetchRestaurantsList);
export const useDbUsers = () => useCollection<adminService.DbUser>(adminService.fetchUsersList);
export const useDashboardStats = () => useCollection<adminService.DashboardStat>(adminService.fetchDashboardStats);
export const useRecentActivity = () => useCollection<adminService.RecentActivity>(adminService.fetchRecentActivity);
export const usePopularLocations = () => useCollection<adminService.PopularLocation>(adminService.fetchPopularLocations);
export const useDestinations = () => useCollection<adminService.Destination>(adminService.fetchDestinationsList);

// ─── CRUD helpers (delegating to adminService) ────────────────────────────────

export const deleteRecord = async (endpoint: string, id: string): Promise<void> => {
  switch (endpoint) {
    case 'hotels': return (await adminService.removeHotel(id)).data as any;
    case 'restaurants': return (await adminService.removeRestaurant(id)).data as any;
    case 'users': return (await adminService.removeUser(id)).data as any;
    case 'destinations': return (await adminService.removeDestination(id)).data as any;
    default: return (await adminService.removeAdminRecord(endpoint, id)).data as any;
  }
};

export const updateRecord = async <T>(endpoint: string, id: string, data: Partial<T>): Promise<T> => {
  const response = await adminService.updateAdminRecord<T>(endpoint, id, data);
  return (response.data.DT || response.data.data) as T;
};

export const createRecord = async <T>(endpoint: string, data: Omit<T, 'id'>): Promise<T> => {
  let response;
  if (endpoint === 'hotels') {
    response = await adminService.createHotel(data as any);
  } else {
    response = await adminService.createAdminRecord<T>(endpoint, data);
  }
  return (response.data.DT || response.data.data) as T;
};
