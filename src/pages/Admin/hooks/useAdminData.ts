import { useState, useEffect } from "react";
import * as adminService from "../../../services/adminService";

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
  AdminReview,
} from "../../../services/adminService";

// ─── Generic hook ─────────────────────────────────────────────────────────────

function useCollection<T, Args extends any[] = any[]>(
  fetchFn: (...args: Args) => Promise<unknown>,
) {
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    totalElements: 0,
    currentPage: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (...args: Args) => {
    try {
      setLoading(true);
      setError(null);
      const response = (await fetchFn(...args)) as {
        data?:
          | { DT?: unknown; data?: unknown; [key: string]: unknown }
          | unknown;
      };

      const responseData = response?.data as
        | Record<string, unknown>
        | undefined;
      const resData =
        responseData?.DT || responseData?.data || response?.data || response;

      // Kiểm tra nếu là dữ liệu phân trang (có content) hay mảng đơn thuần
      if (resData && typeof resData === "object" && "content" in resData) {
        const pagedData = resData as {
          content: T[];
          page?: {
            totalPages?: number;
            totalElements?: number;
            number?: number;
          };
        };
        setData(pagedData.content || []);
        if (pagedData.page) {
          setPagination({
            totalPages: pagedData.page.totalPages || 1,
            totalElements: pagedData.page.totalElements || 0,
            currentPage: pagedData.page.number || 0,
          });
        }
      } else {
        const list = Array.isArray(resData) ? resData : [];
        setData(list as T[]);
        setPagination({
          totalPages: 1,
          totalElements: list.length,
          currentPage: 0,
        });
      }
    } catch (err) {
      setError("Không thể kết nối tới máy chủ.");
      console.error(`[useAdminData] Fetch failed:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(...([] as unknown as Args));
  }, []); // Chỉ gọi lần đầu, việc fetch phân trang sẽ do View gọi refetch với args

  const toggleUserStatus = async (
    id: string | number,
    currentStatus: boolean,
  ) => {
    if (currentStatus) {
      return await adminService.lockUser(id);
    } else {
      return await adminService.unlockUser(id);
    }
  };

  return {
    data,
    pagination,
    loading,
    error,
    refetch: fetchData,
    toggleUserStatus,
  };
}

// ─── Specific hooks ───────────────────────────────────────────────────────────

export const useAttractions = () =>
  useCollection<adminService.Destination>((page?: number, size?: number, keyword?: string) => {
    if (keyword)
      return adminService.searchAttractionsByKeyword(keyword, page, size);
    return adminService.fetchAttractionsList(page, size);
  });

export const useRestaurants = () =>
  useCollection<adminService.Restaurant>((page?: number, size?: number, keyword?: string) => {
    if (keyword)
      return adminService.searchRestaurantsByKeyword(keyword, page, size);
    return adminService.fetchRestaurantsList(page, size);
  });

export const useDbUsers = () =>
  useCollection<adminService.DbUser>((page?: number, size?: number, keyword?: string, isActive?: boolean) => {
    if (isActive !== undefined && isActive !== null)
      return adminService.fetchUsersByStatus(isActive, page, size);
    if (keyword) return adminService.searchUsersByKeyword(keyword, page, size);
    return adminService.fetchUsersList(page, size);
  });
export const useDashboardStats = () =>
  useCollection<adminService.DashboardStat>(adminService.fetchDashboardStats);
export const useRecentActivity = () =>
  useCollection<adminService.RecentActivity>(adminService.fetchRecentActivity);
export const usePopularLocations = () =>
  useCollection<adminService.PopularLocation>(
    adminService.fetchPopularLocations,
  );

export const useHotels = () =>
  useCollection<adminService.Hotel>((page?: number, size?: number, keyword?: string) => {
    if (keyword) return adminService.searchHotelsByKeyword(keyword, page, size);
    return adminService.fetchHotelsList(page, size);
  });

export const useDestinations = () =>
  useCollection<adminService.Destination>((page?: number, size?: number, keyword?: string) => {
    if (keyword)
      return adminService.searchAttractionsByKeyword(keyword, page, size);
    return adminService.fetchAttractionsList(page, size);
  });

export const useNews = () =>
  useCollection<adminService.NewsItem>((page?: number, size?: number) => {
    return adminService.fetchNewsList(page, size);
  });

export const useAdminReviews = () =>
  useCollection<adminService.AdminReview>((page?: number, size?: number) => {
    return adminService.fetchAdminReviewsList(page, size);
  });

// ─── CRUD helpers (delegating to adminService) ────────────────────────────────

export const deleteRecord = async (
  endpoint: string,
  id: string | number,
): Promise<void> => {
  switch (endpoint) {
    case "hotels":
      await adminService.removeHotel(id);
      return;
    case "restaurants":
      await adminService.removeRestaurant(id);
      return;
    case "users":
      await adminService.removeUser(id);
      return;
    case "attractions":
      await adminService.removeAttraction(id);
      return;
    case "news":
      await adminService.removeNews(id);
      return;
    case "reviews":
      await adminService.removeReview(id);
      return;
    default:
      throw new Error(`Endpoint ${endpoint} không hỗ trợ xóa`);
  }
};

export const updateRecord = async <T>(
  endpoint: string,
  id: string | number,
  data: FormData | Record<string, unknown>,
): Promise<T> => {
  let response;
  if (endpoint === "hotels") {
    response = await adminService.updateHotel(id, data as FormData);
  } else if (endpoint === "restaurants") {
    response = await adminService.updateRestaurant(id, data as FormData);
  } else if (endpoint === "destinations") {
    response = await adminService.updateAttraction(id, data as FormData);
  } else if (endpoint === "users") {
    response = await adminService.updateUser(id, data);
  } else if (endpoint === "news") {
    response = await adminService.updateNews(id, data as FormData);
  } else {
    throw new Error(`Endpoint ${endpoint} không hỗ trợ cập nhật`);
  }
  const typedResponse = response as { data: { DT?: unknown; data?: unknown } };
  return (typedResponse.data?.DT || typedResponse.data?.data) as T;
};

export const createRecord = async <T>(
  endpoint: string,
  data: FormData | Record<string, unknown>,
): Promise<T> => {
  let response;
  if (endpoint === "hotels") {
    response = await adminService.createHotel(data as FormData);
  } else if (endpoint === "restaurants") {
    response = await adminService.createRestaurant(data as FormData);
  } else if (endpoint === "destinations") {
    response = await adminService.createAttraction(data as FormData);
  } else if (endpoint === "users") {
    response = await adminService.createUser(data);
  } else if (endpoint === "news") {
    response = await adminService.createNews(data as FormData);
  } else {
    throw new Error(`Endpoint ${endpoint} không hỗ trợ tạo mới`);
  }
  const typedResponse = response as { data: { DT?: unknown; data?: unknown } };
  return (typedResponse.data?.DT || typedResponse.data?.data) as T;
};

export const toggleNewsFeatured = async (
  id: string | number,
): Promise<void> => {
  await adminService.toggleNewsFeatured(id);
};
