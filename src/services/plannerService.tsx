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
  status: number;
  message: string;
  data?: T;
  DT?: T;
}

// Lưu lịch trình mới
export const postTravelPlan = async (
  data: PlannerFormData,
): Promise<AxiosResponse<BackendResponse<TravelPlan>>> => {
  const payload = {
    ...data,
    createdAt: new Date().toISOString(),
    userId: localStorage.getItem("username") || "Guest",
  };
  try {
    return await instance.post<BackendResponse<TravelPlan>>("/travel-plans", payload);
  } catch {
    console.warn("Fake API fallback cho postTravelPlan");
    return {
      data: { 
        status: 201, 
        message: "Lên lịch trình giả lập thành công", 
        DT: { ...payload, id: Date.now() } as TravelPlan, 
        data: { ...payload, id: Date.now() } as TravelPlan 
      },
      status: 201, 
      statusText: "Created", 
      headers: {}, 
      config: {} as import("axios").InternalAxiosRequestConfig
    };
  }
};

// Lấy danh sách lịch trình
export const getTravelPlans = async (): Promise<
  AxiosResponse<BackendResponse<TravelPlan[]>>
> => {
  try {
    return await instance.get<BackendResponse<TravelPlan[]>>("/travel-plans");
  } catch {
    console.warn("Fake API fallback cho getTravelPlans");
    return {
      data: { status: 200, message: "Mock data", DT: [], data: [] },
      status: 200, statusText: "OK", headers: {}, config: {} as import("axios").InternalAxiosRequestConfig
    };
  }
};
