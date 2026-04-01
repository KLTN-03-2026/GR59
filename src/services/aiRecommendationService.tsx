import type { AxiosResponse } from "axios";
import instance from "../utils/AxiosCustomize";

export interface AIRecommendation {
  id: number;
  title: string;
  matchPercentage: number;
  image: string;
}

export interface BackendResponse<T = unknown> {
  EC: number;
  EM: string;
  DT: T;
}

export const getAIRecommendations = (): Promise<AxiosResponse<BackendResponse<AIRecommendation[]>>> => {
  return instance.get<BackendResponse<AIRecommendation[]>>("/aiRecommendations");
};
