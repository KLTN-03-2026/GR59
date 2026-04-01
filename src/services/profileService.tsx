import type { AxiosResponse } from "axios";
import instance from "../utils/AxiosCustomize";

// --- Interfaces ---
export interface SavedTrip {
  id: number;
  title: string;
  image: string;
  timeAgo: string;
}

export interface ProfileData {
  name: string;
  email: string;
  phone: string;
  address: string;
  bio: string;
  avatar: string;
  cover: string;
  badge: string;
  joinDate: string;
  location: string;
  savedTrips: SavedTrip[];
}

export interface BackendResponse<T = unknown> {
  EC: number;
  EM: string;
  DT: T;
}

// Lấy thông tin profile
export const getProfile = (): Promise<AxiosResponse<BackendResponse<ProfileData>>> => {
  return instance.get<BackendResponse<ProfileData>>("/profile");
};
