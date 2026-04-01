import type { AxiosResponse } from "axios";
import instance from "../utils/AxiosCustomize";

// --- Interfaces ---
export interface PlannerFormData {
  destination: string;
  travelDate: string;
  interests: string[];
  budget: string;
  peopleGroup: string;
}

export interface TravelPlan extends PlannerFormData {
  id: number | string;
  createdAt: string;
  userId: string | null;
}

export interface BackendResponse<T = unknown> {
  EC: number;
  EM: string;
  DT: T;
}

// Lưu lịch trình mới
export const postTravelPlan = (
  data: PlannerFormData,
): Promise<AxiosResponse<BackendResponse<TravelPlan>>> => {
  const payload = {
    ...data,
    createdAt: new Date().toISOString(),
    userId: localStorage.getItem("username") || "Guest", // Lưu tạm theo username hoặc id
  };
  return instance.post<BackendResponse<TravelPlan>>("/travel-plans", payload);
};

// Lấy danh sách lịch trình
export const getTravelPlans = (): Promise<
  AxiosResponse<BackendResponse<TravelPlan[]>>
> => {
  return instance.get<BackendResponse<TravelPlan[]>>("/travel-plans");
};
