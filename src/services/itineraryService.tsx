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
  previewVideo?: string; // Thêm previewVideo
  steps: {
    time: string;
    activity: string;
    dist: string;
  }[];
}

export interface BackendResponse<T = unknown> {
  status: number;
  message: string;
  data?: T;
  DT?: T;
}

const MOCK_ITINERARIES: ItineraryType[] = [
  {
    "id": "19",
    "title": "Hành trình Di sản miền Trung",
    "img": "https://images.unsplash.com/photo-1555921015-5532091f6026?q=80&w=800",
    "price": 1500000,
    "maxPeople": 5,
    "location": "Đà Nẵng",
    "duration": "3 Ngày 2 Đêm",
    "rating": 4.9,
    "category": "culture",
    "type": "itinerary",
    "steps": [
      {
        "time": "08:00",
        "activity": "Đón khách tại sân bay Đà Nẵng",
        "dist": "2km từ TT"
      },
      {
        "time": "10:00",
        "activity": "Check-in Bán đảo Sơn Trà",
        "dist": "10km từ TT"
      },
      {
        "time": "12:00",
        "activity": "Thưởng thức Mì Quảng chính gốc",
        "dist": "3km từ TT"
      }
    ],
    "previewVideo": ""
  },
  {
    "id": "20",
    "title": "Khám phá Phố Cổ Hội An",
    "img": "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=800",
    "price": 850000,
    "maxPeople": 2,
    "location": "Hội An",
    "duration": "1 Ngày",
    "rating": 4.8,
    "category": "culture",
    "type": "itinerary",
    "steps": [
      {
        "time": "15:00",
        "activity": "Di chuyển đi Hội An",
        "dist": "30km từ TT"
      },
      {
        "time": "17:00",
        "activity": "Thăm Chùa Cầu & Nhà Cổ",
        "dist": "30.5km từ TT"
      },
      {
        "time": "19:00",
        "activity": "Ăn tối & Thả đèn hoa đăng",
        "dist": "30.5km từ TT"
      }
    ],
    "previewVideo": ""
  },
  {
    "id": "21",
    "title": "Nghỉ dưỡng biển Mỹ Khê",
    "img": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800",
    "price": 2500000,
    "maxPeople": 4,
    "location": "Đà Nẵng",
    "duration": "2 Ngày 1 Đêm",
    "rating": 4.9,
    "category": "beach",
    "type": "itinerary",
    "steps": [
      {
        "time": "09:00",
        "activity": "Tắm biển & Chụp hình",
        "dist": "1km từ TT"
      },
      {
        "time": "14:00",
        "activity": "Chơi các trò chơi nước",
        "dist": "1.2km từ TT"
      }
    ],
    "previewVideo": ""
  },
  {
    "id": "22",
    "title": "Tour Tiết Kiệm Ngũ Hành Sơn",
    "img": "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=800",
    "price": 450000,
    "maxPeople": 10,
    "location": "Đà Nẵng",
    "duration": "1 Ngày",
    "rating": 4.7,
    "category": "nature",
    "type": "itinerary",
    "steps": [
      {
        "time": "08:30",
        "activity": "Thăm làng đá Non Nước",
        "dist": "12km từ TT"
      },
      {
        "time": "10:00",
        "activity": "Leo núi Ngũ Hành Sơn",
        "dist": "12km từ TT"
      }
    ],
    "previewVideo": ""
  },
  {
    "id": "23",
    "title": "Chinh phục đỉnh Bàn Cờ",
    "img": "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800",
    "price": 600000,
    "maxPeople": 2,
    "location": "Đà Nẵng",
    "duration": "Half day",
    "rating": 4.6,
    "category": "adventure",
    "type": "itinerary",
    "steps": [
      {
        "time": "05:00",
        "activity": "Đón bình minh đỉnh Bàn Cờ",
        "dist": "15km từ TT"
      },
      {
        "time": "07:30",
        "activity": "Ăn sáng cafe view biển",
        "dist": "5km từ TT"
      }
    ],
    "previewVideo": ""
  },
  {
    "id": "24",
    "title": "Lặn ngắm san hô Cù Lao Chàm",
    "img": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800",
    "price": 1200000,
    "maxPeople": 8,
    "location": "Hội An",
    "duration": "1 Ngày",
    "rating": 4.8,
    "category": "beach",
    "type": "itinerary",
    "steps": [
      {
        "time": "08:00",
        "activity": "Cano đi Cù Lao Chàm",
        "dist": "45km từ TT"
      },
      {
        "time": "10:30",
        "activity": "Lặn ngắm san hô bãi Bắc",
        "dist": "46km từ TT"
      }
    ],
    "previewVideo": ""
  },
  {
    "id": "25",
    "title": "Camping Rừng Dừa Bảy Mẫu",
    "img": "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800",
    "price": 950000,
    "maxPeople": 15,
    "location": "Hội An",
    "duration": "2 Ngày 1 Đêm",
    "rating": 4.5,
    "category": "nature",
    "type": "itinerary",
    "steps": [
      {
        "time": "14:00",
        "activity": "Check-in lều trại",
        "dist": "35km từ TT"
      },
      {
        "time": "19:00",
        "activity": "Tiệc BBQ ngoài trời",
        "dist": "35km từ TT"
      }
    ],
    "previewVideo": ""
  },
  {
    "id": "26",
    "title": "City Tour Đà Nẵng về đêm",
    "img": "https://images.unsplash.com/photo-1599708153386-efdb71593ef0?q=80&w=800",
    "price": 350000,
    "maxPeople": 4,
    "location": "Đà Nẵng",
    "duration": "4 Tiếng",
    "rating": 4.7,
    "category": "culture",
    "type": "itinerary",
    "steps": [
      {
        "time": "19:00",
        "activity": "Ngắm Cầu Rồng phun lửa",
        "dist": "0km từ TT"
      },
      {
        "time": "21:00",
        "activity": "Dạo Chợ đêm Sơn Trà",
        "dist": "1km từ TT"
      }
    ],
    "previewVideo": ""
  },
  {
    "id": "27",
    "title": "Yoga thiền tại rừng Sơn Trà",
    "img": "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800",
    "price": 700000,
    "maxPeople": 6,
    "location": "Đà Nẵng",
    "duration": "1 Ngày",
    "rating": 4.9,
    "category": "nature",
    "type": "itinerary",
    "steps": [
      {
        "time": "06:00",
        "activity": "Yoga đón bình minh",
        "dist": "12km từ TT"
      },
      {
        "time": "09:00",
        "activity": "Thiền trà thảo mộc",
        "dist": "12km từ TT"
      }
    ],
    "previewVideo": ""
  },
  {
    "id": "28",
    "title": "Trekking Suối Mơ - Ba Na",
    "img": "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=800",
    "price": 550000,
    "maxPeople": 12,
    "location": "Đà Nẵng",
    "duration": "1 Ngày",
    "rating": 4.6,
    "category": "adventure",
    "type": "itinerary",
    "steps": [
      {
        "time": "07:30",
        "activity": "Leo núi lội suối",
        "dist": "25km từ TT"
      },
      {
        "time": "12:00",
        "activity": "Ăn trưa picnic bên suối",
        "dist": "26km từ TT"
      }
    ],
    "previewVideo": ""
  },
  {
    "id": "29",
    "title": "Tham quan Thánh địa Mỹ Sơn",
    "img": "https://images.unsplash.com/photo-1590424600010-84518429661c?q=80&w=800",
    "price": 1100000,
    "maxPeople": 4,
    "location": "Hội An",
    "duration": "1 Ngày",
    "rating": 4.8,
    "category": "culture",
    "type": "itinerary",
    "steps": [
      {
        "time": "08:30",
        "activity": "Khám phá tháp cổ Chăm Pa",
        "dist": "50km từ TT"
      },
      {
        "time": "11:30",
        "activity": "Thưởng thức múa Apsara",
        "dist": "50km từ TT"
      }
    ],
    "previewVideo": ""
  },
  {
    "id": "30",
    "title": "Tiệc tối lãng mạn ven biển",
    "img": "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800",
    "price": 3200000,
    "maxPeople": 2,
    "location": "Đà Nẵng",
    "duration": "3 Tiếng",
    "rating": 5,
    "category": "beach",
    "type": "itinerary",
    "steps": [
      {
        "time": "18:00",
        "activity": "Đón hoàng hôn trên biển",
        "dist": "2km từ TT"
      },
      {
        "time": "19:30",
        "activity": "Tiệc tối 5 sao private",
        "dist": "2km từ TT"
      }
    ],
    "previewVideo": ""
  }
];

const MOCK_SAVED_PLANS = [
  {
    id: "plan-1",
    destination: "Đà Nẵng",
    travelDate: "20/05/2026 - 25/05/2026",
    interests: ["Ẩm thực", "Biển"],
    budget: "5 - 10 triệu",
    peopleGroup: "2",
    createdAt: "2026-04-07T07:30:00.000Z"
  }
];

// Dữ liệu dùng cho Detail Page nếu là AI Generated
const MOCK_AI_ROUTE: any[] = [
  {
    id: 'ai-1',
    name: 'Bán đảo Sơn Trà',
    lat: 16.1214,
    lng: 108.277,
    time: '08:30',
    type: 'attraction',
    description: 'Bán đảo Sơn Trà là "lá phổi xanh" của Đà Nẵng với hệ sinh thái đa dạng và cảnh quan ngoạn mục.',
    day: 1
  },
  {
    id: 'ai-2',
    name: 'Chùa Linh Ứng',
    lat: 16.1004,
    lng: 108.277,
    time: '10:00',
    type: 'attraction',
    description: 'Nơi có tượng Phật Bà Quan Âm cao nhất Việt Nam, hướng nhìn ra biển Đông.',
    day: 1
  },
  {
    id: 'ai-3',
    name: 'Bà Nà Hills',
    lat: 15.9975,
    lng: 107.992,
    time: '09:00',
    type: 'attraction',
    description: 'Trải nghiệm cáp treo và không khí 4 mùa tại Bà Nà.',
    day: 2
  },
  {
    id: 'ai-4',
    name: 'Phố cổ Hội An',
    lat: 15.8794,
    lng: 108.3283,
    time: '16:00',
    type: 'attraction',
    description: 'Khám phá vẻ đẹp cổ kính của phố Hội về đêm.',
    day: 3
  }
];

export const getSampleItineraries = async (): Promise<
  AxiosResponse<BackendResponse<ItineraryType[]>>
> => {
  try {
    return await instance.get<BackendResponse<ItineraryType[]>>(
      "/places?type=itinerary"
    );
  } catch (error) {
    console.warn("Fake API fallback cho Sample Itineraries");
    return {
      data: { status: 200, message: "Mock data", data: MOCK_ITINERARIES },
      status: 200, statusText: "OK", headers: {}, config: {} as any
    };
  }
};

export const saveTravelPlan = async (planData: any): Promise<
  AxiosResponse<BackendResponse<any>>
> => {
  try {
    return await instance.post<BackendResponse<any>>("/travel-plans", planData);
  } catch (error) {
    console.warn("Fake API fallback cho Save Travel Plan");
    return {
      data: { status: 201, message: "Lịch trình đã được lưu vào hệ thống (giả lập)", data: planData },
      status: 201, statusText: "Created", headers: {}, config: {} as any
    };
  }
};

export const updateTravelPlan = async (id: string | number, points: any[]): Promise<
  AxiosResponse<BackendResponse<any>>
> => {
  try {
    return await instance.put<BackendResponse<any>>(`/travel-plans/${id}`, { points });
  } catch (error) {
    console.warn("Fake API fallback cho Update Travel Plan");
    return {
      data: { status: 200, message: "Đã cập nhật thay đổi (giả lập)", data: { id, points } },
      status: 200, statusText: "OK", headers: {}, config: {} as any
    };
  }
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
  } catch (error) {
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
      duration: Math.round(dist * 2) // Giả định trung bình 30km/h trong đô thị
    };
  }
};

import axios from "axios";

export const getAISuggestedRoute = async (planData: any): Promise<
  AxiosResponse<BackendResponse<any[]>>
> => {
  try {
    return await instance.post<BackendResponse<any[]>>("/travel-plans-ai", planData);
  } catch (error) {
    console.warn("Fake API fallback cho AI Suggested Route");
    return {
      data: { status: 200, message: "Lộ trình AI đã sẵn sàng", data: MOCK_AI_ROUTE },
      status: 200, statusText: "OK", headers: {}, config: {} as any
    };
  }
};

export const getTravelPlans = async (): Promise<
  AxiosResponse<BackendResponse<any[]>>
> => {
  try {
    return await instance.get<BackendResponse<any[]>>("/travel-plans");
  } catch (error) {
    console.warn("Fake API fallback cho Get Travel Plans");
    return {
      data: { status: 200, message: "Mock data", data: MOCK_SAVED_PLANS },
      status: 200, statusText: "OK", headers: {}, config: {} as any
    };
  }
};
