import instance from "../utils/AxiosCustomize";
import type { AxiosResponse } from "axios";

export interface ItineraryType {
  id: string | number;
  title: string;
  img: string; // Đồng bộ với places
  price: number;
  maxPeople: number;
  location: string;
  duration: string;
  rating: number;
  category: string;
  type: string; // Thêm type
  steps: {
    time: string;
    activity: string;
    dist: string;
  }[];
}

export interface BackendResponse<T = unknown> {
  EC: number;
  EM: string;
  DT: T;
}

export const getSampleItineraries = (): Promise<
  AxiosResponse<BackendResponse<ItineraryType[]>>
> => {
  return instance.get<BackendResponse<ItineraryType[]>>(
    "/places?type=itinerary"
  );
};
