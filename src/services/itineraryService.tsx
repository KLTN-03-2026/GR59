import instance from "../utils/AxiosCustomize";
import type { AxiosResponse } from "axios";
import type { BackendResponse } from "../types/backend";
import axios from "axios";

export interface ItineraryActivity {
  time: string;
  location: string;
  note: string;
  lat?: number;
  lng?: number;
}

export interface DayItinerary {
  day: number;
  date: string;
  theme: string;
  activities: ItineraryActivity[];
}

export interface ItineraryType {
  id: string | number;
  trip_name: string;
  img: string; 
  price: number;
  maxPeople: number;
  location: string;
  duration: string;
  rating: number;
  category: string;
  type?: string; 
  previewVideo?: string; 
  itinerary: DayItinerary[];
}

export const getSampleItineraries = async (): Promise<
  AxiosResponse<BackendResponse<ItineraryType[]>>
> => {
  return await instance.get<BackendResponse<ItineraryType[]>>("/travel/itineraries/demo");
};

export const getSampleItineraryById = async (
  id: string | number
): Promise<AxiosResponse<BackendResponse<ItineraryType>>> => {
  return await instance.get<BackendResponse<ItineraryType>>(`/travel/itineraries/demo/${id}`);
};

export const saveTravelPlan = async (planData: Partial<ItineraryType>): Promise<
  AxiosResponse<BackendResponse<ItineraryType>>
> => {
  return await instance.post<BackendResponse<ItineraryType>>("/travel-plans", planData);
};

export const updateTravelPlan = async (id: string | number, points: ItineraryActivity[]): Promise<
  AxiosResponse<BackendResponse<ItineraryType>>
> => {
  return await instance.put<BackendResponse<ItineraryType>>(`/travel-plans/${id}`, { points });
};

/**
 * Tính toán khoảng cách và thời gian di chuyển bằng OSRM
 */
export const getTravelMetrics = async (p1: {lat: number, lng: number}, p2: {lat: number, lng: number}) => {
  try {
    const response = await axios.get(
      `https://router.project-osrm.org/route/v1/driving/${p1.lng},${p1.lat};${p2.lng},${p2.lat}?overview=false`,
      { timeout: 5000 }
    );
    
    if (response.data && response.data.routes && response.data.routes.length > 0) {
      const route = response.data.routes[0];
      return {
        distance: (route.distance / 1000).toFixed(1), // km
        duration: Math.round(route.duration / 60)   // minutes
      };
    }
    throw new Error("No route found");
  } catch {
    // Fallback: Haversine distance
    const R = 6371; // Earth radius in km
    const dLat = (p2.lat - p1.lat) * Math.PI / 180;
    const dLon = (p2.lng - p1.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const dist = R * c;
    
    return {
      distance: dist.toFixed(1),
      duration: Math.round(dist * 2) 
    };
  }
};

export const getAISuggestedRoute = async (planData: Partial<ItineraryType>): Promise<
  AxiosResponse<BackendResponse<ItineraryType[]>>
> => {
  return await instance.post<BackendResponse<ItineraryType[]>>("/travel-plans-ai", planData);
};

export const getTravelPlans = async (): Promise<
  AxiosResponse<BackendResponse<ItineraryType[]>>
> => {
  return await instance.get<BackendResponse<ItineraryType[]>>("/travel-plans");
};
