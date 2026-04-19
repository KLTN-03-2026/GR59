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
  Destination,
  NewsItem,
  AdminReview
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
        const list = Array.isArray(resData) ? resData : [];
        setData(list);
        setPagination({
          totalPages: 1,
          totalElements: list.length,
          currentPage: 0
        });
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

  const toggleUserStatus = async (id: string | number, currentStatus: boolean) => {
    if (currentStatus) {
      return await adminService.lockUser(id);
    } else {
      return await adminService.unlockUser(id);
    }
  };

  return { data, pagination, loading, error, refetch: fetchData, toggleUserStatus };
}

// ─── Specific hooks ───────────────────────────────────────────────────────────

export const useAttractions = () => useCollection<adminService.Destination>((page, size, keyword) => {
  if (keyword) return adminService.searchAttractionsByKeyword(keyword, page, size);
  return adminService.fetchAttractionsList(page, size);
});

export const useRestaurants = () => useCollection<adminService.Restaurant>((page, size, keyword) => {
  if (keyword) return adminService.searchRestaurantsByKeyword(keyword, page, size);
  return adminService.fetchRestaurantsList(page, size);
});

export const useDbUsers = () => useCollection<adminService.DbUser>((page, size, keyword, isActive) => {
  if (isActive !== undefined && isActive !== null) return adminService.fetchUsersByStatus(isActive, page, size);
  if (keyword) return adminService.searchUsersByKeyword(keyword, page, size);
  return adminService.fetchUsersList(page, size);
});
export const useDashboardStats = () => useCollection<adminService.DashboardStat>(adminService.fetchDashboardStats);
export const useRecentActivity = () => useCollection<adminService.RecentActivity>(adminService.fetchRecentActivity);
export const usePopularLocations = () => useCollection<adminService.PopularLocation>(adminService.fetchPopularLocations);

export const useHotels = () => useCollection<adminService.Hotel>((page, size, keyword) => {
  if (keyword) return adminService.searchHotelsByKeyword(keyword, page, size);
  return adminService.fetchHotelsList(page, size);
});

export const useDestinations = () => useCollection<adminService.Destination>((page, size, keyword) => {
  if (keyword) return adminService.searchAttractionsByKeyword(keyword, page, size);
  return adminService.fetchAttractionsList(page, size);
});

export const useNews = () => {
  const [data, setData] = useState<adminService.NewsItem[]>([
    {
      id: 1,
      title: "10 Địa điểm không thể bỏ qua tại Đà Nẵng năm 2026",
      excerpt: "Khám phá những điểm đến mới lạ và hấp dẫn nhất tại thành phố đáng sống...",
      content: "Nội dung chi tiết bài viết 1",
      image: "https://images.unsplash.com/photo-1559592481-74488ea01937?auto=format&fit=crop&q=80&w=800",
      category: "Điểm đến",
      date: "2026-04-19",
      readTime: "5 phút đọc",
      isFeatured: true
    },
    {
      id: 2,
      title: "Hành trình ẩm thực: 24h càn quét chợ Cồn",
      excerpt: "Những món ăn vặt trứ danh mà bạn nhất định phải thử khi đến với Đà Nẵng...",
      content: "Nội dung chi tiết bài viết 2",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&q=80&w=800",
      category: "Ẩm thực",
      date: "2026-04-18",
      readTime: "3 phút đọc",
      isFeatured: false
    },
    {
      id: 3,
      title: "Mẹo tiết kiệm chi phí khi đi du lịch tự túc",
      excerpt: "Làm sao để có một chuyến đi tuyệt vời mà vẫn tối ưu được ngân sách...",
      content: "Nội dung chi tiết bài viết 3",
      image: "https://images.unsplash.com/photo-1454165833767-131ef24896c3?auto=format&fit=crop&q=80&w=800",
      category: "Mẹo du lịch",
      date: "2026-04-17",
      readTime: "7 phút đọc",
      isFeatured: false
    }
  ]);

  return { 
    data, 
    pagination: { totalPages: 1, totalElements: 3, currentPage: 0 }, 
    loading: false, 
    error: null, 
    refetch: () => {} 
  };
};

export const useAdminReviews = () => useCollection<adminService.AdminReview>((page, size) => {
  return adminService.fetchAdminReviewsList(page, size);
});

// ─── CRUD helpers (delegating to adminService) ────────────────────────────────

export const deleteRecord = async (endpoint: string, id: string | number): Promise<void> => {
  switch (endpoint) {
    case 'hotels': return (await adminService.removeHotel(id)).data as any;
    case 'restaurants': return (await adminService.removeRestaurant(id)).data as any;
    case 'users': return (await adminService.removeUser(id)).data as any;
    case 'attractions': return (await adminService.removeAttraction(id)).data as any;
    case 'news': return (await adminService.removeNews(id)).data as any;
    case 'reviews': return (await adminService.removeReview(id)).data as any;
    default: throw new Error(`Endpoint ${endpoint} không hỗ trợ xóa`);
  }
};

export const updateRecord = async <T>(endpoint: string, id: string | number, data: any): Promise<T> => {
  let response;
  if (endpoint === 'hotels') {
    response = await adminService.updateHotel(id, data);
  } else if (endpoint === 'restaurants') {
    response = await adminService.updateRestaurant(id, data);
  } else if (endpoint === 'destinations') {
    response = await adminService.updateAttraction(id, data);
  } else if (endpoint === 'users') {
    response = await adminService.updateUser(id, data);
  } else if (endpoint === 'news') {
    response = await adminService.updateNews(id, data);
  } else {
    throw new Error(`Endpoint ${endpoint} không hỗ trợ cập nhật`);
  }
  return (response.data.DT || response.data.data) as T;
};

export const createRecord = async <T>(endpoint: string, data: Omit<T, 'id'>): Promise<T> => {
  let response;
  if (endpoint === 'hotels') {
    response = await adminService.createHotel(data as any);
  } else if (endpoint === 'restaurants') {
    response = await adminService.createRestaurant(data as any);
  } else if (endpoint === 'destinations') {
    response = await adminService.createAttraction(data as any);
  } else if (endpoint === 'users') {
    response = await adminService.createUser(data);
  } else if (endpoint === 'news') {
    response = await adminService.createNews(data);
  } else {
    throw new Error(`Endpoint ${endpoint} không hỗ trợ tạo mới`);
  }
  return (response.data.DT || response.data.data) as T;
};
