import type { AxiosResponse } from "axios";
import instance from "../utils/AxiosCustomize";

export interface AIRecommendation {
  id: number;
  name: string;
  matchPercentage: number;
  image: string;
}

export interface BackendResponse<T = unknown> {
  status: number;
  message: string;
  data?: T;
  DT?: T;
}

const MOCK_RECOMMENDATIONS: AIRecommendation[] = [
  {
    "id": 1,
    "name": "Địa điểm HOT #1",
    "matchPercentage": 98,
    "image": "https://picsum.photos/200/120?sig=1"
  },
  {
    "id": 2,
    "name": "Địa điểm HOT #2",
    "matchPercentage": 95,
    "image": "https://picsum.photos/200/120?sig=2"
  },
  {
    "id": 3,
    "name": "Địa điểm HOT #3",
    "matchPercentage": 92,
    "image": "https://picsum.photos/200/120?sig=3"
  },
  {
    "id": 4,
    "name": "Địa điểm HOT #4",
    "matchPercentage": 90,
    "image": "https://picsum.photos/200/120?sig=4"
  },
  {
    "id": 5,
    "name": "Địa điểm HOT #5",
    "matchPercentage": 88,
    "image": "https://picsum.photos/200/120?sig=5"
  },
  {
    "id": 6,
    "name": "Địa điểm HOT #6",
    "matchPercentage": 85,
    "image": "https://picsum.photos/200/120?sig=6"
  },
  {
    "id": 7,
    "name": "Địa điểm HOT #7",
    "matchPercentage": 82,
    "image": "https://picsum.photos/200/120?sig=7"
  },
  {
    "id": 8,
    "name": "Địa điểm HOT #8",
    "matchPercentage": 80,
    "image": "https://picsum.photos/200/120?sig=8"
  }
];

export const getAIRecommendations = async (): Promise<AxiosResponse<BackendResponse<AIRecommendation[]>>> => {
  try {
    return await instance.get<BackendResponse<AIRecommendation[]>>("/aiRecommendations");
  } catch {
    console.warn("Fake API fallback cho AI Recommendations");
    return {
      data: { status: 200, message: "Mock data", DT: MOCK_RECOMMENDATIONS, data: MOCK_RECOMMENDATIONS },
      status: 200, statusText: "OK", headers: {}, config: {} as import("axios").InternalAxiosRequestConfig
    };
  }
};
