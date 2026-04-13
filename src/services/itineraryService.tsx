import instance from "../utils/AxiosCustomize";
import type { AxiosResponse } from "axios";
import type { BackendResponse } from "../types/backend";

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

const MOCK_ITINERARIES: ItineraryType[] = [
  {
    "id": "31",
    "trip_name": "Khám phá Đà Lạt mộng mơ",
    "duration": "5 ngày 4 đêm",
    "price": 3500000,
    "rating": 4.9,
    "img": "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80&w=800",
    "location": "Đà Lạt",
    "category": "nature",
    "maxPeople": 4,
    "itinerary": [
      {
        "day": 1,
        "date": "2024-05-01",
        "theme": "Sắc hoa thành phố",
        "activities": [
          { "time": "08:00", "location": "Sân bay Liên Khương", "note": "Xe đón về khách sạn", "lat": 11.7508, "lng": 108.3689 },
          { "time": "12:00", "location": "Lẩu gà lá é Tao Ngộ", "note": "Ăn trưa đặc sản", "lat": 11.9360, "lng": 108.4485 },
          { "time": "14:30", "location": "Vườn hoa Thành phố", "note": "Check-in hoa theo mùa", "lat": 11.9485, "lng": 108.4489 }
        ]
      },
      {
        "day": 2,
        "date": "2024-05-02",
        "theme": "Săn mây & Cà phê",
        "activities": [
          { "time": "04:30", "location": "Thảm gỗ săn mây", "note": "Cần đi sớm để kịp bình minh", "lat": 11.9056, "lng": 108.5492 },
          { "time": "09:00", "location": "Chùa Linh Phước", "note": "Tham quan chùa ve chai", "lat": 11.9427, "lng": 108.4981 },
          { "time": "19:00", "location": "Chợ đêm Đà Lạt", "note": "Mua quà lưu niệm, ăn đồ nướng", "lat": 11.9425, "lng": 108.4368 }
        ]
      },
      {
        "day": 3,
        "date": "2024-05-03",
        "theme": "Rừng thông & Hồ nước",
        "activities": [
          { "time": "08:30", "location": "Hồ Tuyền Lâm", "note": "Chèo thuyền Kayak", "lat": 11.8885, "lng": 108.4235 },
          { "time": "11:00", "location": "Đường hầm đất sét", "note": "Tham quan hồ Vô Cực", "lat": 11.8965, "lng": 108.4065 }
        ]
      },
      {
        "day": 4,
        "date": "2024-05-04",
        "theme": "Thử thách mạo hiểm",
        "activities": [
          { "time": "09:00", "location": "Thác Datanla", "note": "Đi máng trượt dài nhất Đông Nam Á", "lat": 11.9025, "lng": 108.4488 },
          { "time": "15:00", "location": "Dinh Bảo Đại", "note": "Tìm hiểu lịch sử", "lat": 11.9304, "lng": 108.4304 }
        ]
      },
      {
        "day": 5,
        "date": "2024-05-05",
        "theme": "Tạm biệt Đà Lạt",
        "activities": [
          { "time": "08:00", "location": "Quảng trường Lâm Viên", "note": "Chụp ảnh nụ hoa Atiso", "lat": 11.9391, "lng": 108.4447 },
          { "time": "11:00", "location": "Lên xe ra sân bay", "note": "Kết thúc hành trình", "lat": 11.7508, "lng": 108.3689 }
        ]
      }
    ]
  },
  {
    "id": "32",
    "trip_name": "Hà Giang - Vòng cung cực Bắc",
    "duration": "5 ngày 4 đêm",
    "price": 4200000,
    "rating": 4.8,
    "img": "https://images.unsplash.com/photo-1596701062351-df1f8d4543e1?q=80&w=800",
    "location": "Hà Giang",
    "category": "nature",
    "maxPeople": 6,
    "itinerary": [
      {
        "day": 1,
        "date": "2024-06-01",
        "theme": "Khởi hành từ Hà Nội",
        "activities": [
          { "time": "07:00", "location": "Bến xe Mỹ Đình", "note": "Lên xe limousine đi Hà Giang", "lat": 21.0285, "lng": 105.7821 },
          { "time": "14:00", "location": "Cột mốc số 0", "note": "Check-in điểm đầu hành trình", "lat": 22.8219, "lng": 104.9818 },
          { "time": "16:00", "location": "Cổng trời Quản Bạ", "note": "Ngắm núi đôi Cô Tiên", "lat": 23.0673, "lng": 104.9882 }
        ]
      },
      {
        "day": 2,
        "date": "2024-06-02",
        "theme": "Cao nguyên đá Đồng Văn",
        "activities": [
          { "time": "08:00", "location": "Dốc Thẩm Mã", "note": "Con đường uốn lượn biểu tượng", "lat": 23.1666, "lng": 105.1009 },
          { "time": "11:30", "location": "Nhà của Pao", "note": "Bối cảnh phim nổi tiếng", "lat": 23.2359, "lng": 105.2858 },
          { "time": "14:00", "location": "Dinh thự họ Vương", "note": "Kiến trúc nghệ thuật độc đáo", "lat": 23.2625, "lng": 105.2475 }
        ]
      },
      {
        "day": 3,
        "date": "2024-06-03",
        "theme": "Đỉnh cao Mã Pì Lèng",
        "activities": [
          { "time": "05:30", "location": "Đèo Mã Pì Lèng", "note": "Đón bình minh trên đỉnh đèo", "lat": 23.2505, "lng": 105.4194 },
          { "time": "10:00", "location": "Sông Nho Quế", "note": "Đi thuyền qua hẻm Tu Sản", "lat": 23.2685, "lng": 105.4285 },
          { "time": "19:00", "location": "Phố cổ Đồng Văn", "note": "Thưởng thức thắng cố, rượu ngô", "lat": 23.2785, "lng": 105.3585 }
        ]
      },
      {
        "day": 4,
        "date": "2024-06-04",
        "theme": "Điểm cực Bắc Lũng Cú",
        "activities": [
          { "time": "08:30", "location": "Cột cờ Lũng Cú", "note": "Chinh phục điểm cực Bắc", "lat": 23.3815, "lng": 105.3155 },
          { "time": "14:00", "location": "Làng văn hóa Lô Lô Chải", "note": "Trải nghiệm văn hóa bản địa", "lat": 23.3755, "lng": 105.3125 }
        ]
      },
      {
        "day": 5,
        "date": "2024-06-05",
        "theme": "Trở về Hà Nội",
        "activities": [
          { "time": "08:00", "location": "Thác số 6 Hà Giang", "note": "Tắm suối thư giãn", "lat": 22.8585, "lng": 104.9585 },
          { "time": "12:00", "location": "Ăn trưa tại TP Hà Giang", "note": "Mua đặc sản về làm quà", "lat": 22.8219, "lng": 104.9818 }
        ]
      }
    ]
  },
  {
    "id": "33",
    "trip_name": "Phú Quốc - Đảo Ngọc thiên đường",
    "duration": "4 ngày 3 đêm",
    "price": 5800000,
    "rating": 5.0,
    "img": "https://images.unsplash.com/photo-1589394815303-9993309a9096?q=80&w=800",
    "location": "Phú Quốc",
    "category": "beach",
    "maxPeople": 4,
    "itinerary": [
      {
        "day": 1,
        "date": "2024-07-10",
        "theme": "Chào Đảo Ngọc",
        "activities": [
          { "time": "11:00", "location": "Sân bay Phú Quốc", "note": "Xe resort đón về check-in", "lat": 10.1691, "lng": 103.9930 },
          { "time": "15:00", "location": "Bãi Sao", "note": "Tắm biển và chụp ảnh xích đu", "lat": 10.0573, "lng": 104.0375 },
          { "time": "18:00", "location": "Chợ đêm Phú Quốc", "note": "Thưởng thức hải sản tươi", "lat": 10.2183, "lng": 103.9608 }
        ]
      },
      {
        "day": 2,
        "date": "2024-07-11",
        "theme": "Khám phá Nam Đảo",
        "activities": [
          { "time": "08:30", "location": "Cáp treo Hòn Thơm", "note": "Cáp treo vượt biển dài nhất thế giới", "lat": 10.0268, "lng": 104.0078 },
          { "time": "10:00", "location": "Công viên Aquatopia", "note": "Vui chơi công viên nước", "lat": 10.0076, "lng": 104.0181 },
          { "time": "15:30", "location": "Sunset Sanato", "note": "Ngắm hoàng hôn đẹp nhất đảo", "lat": 10.1625, "lng": 103.9675 }
        ]
      },
      {
        "day": 3,
        "date": "2024-07-12",
        "theme": "VinWonders & Safari",
        "activities": [
          { "time": "09:00", "location": "Vinpearl Safari", "note": "Tham quan vườn thú mở", "lat": 10.3345, "lng": 103.8835 },
          { "time": "14:00", "location": "VinWonders", "note": "Thỏa sức vui chơi giải trí", "lat": 10.3365, "lng": 103.8565 },
          { "time": "20:00", "location": "Grand World", "note": "Xem show Tinh hoa Việt Nam", "lat": 10.3285, "lng": 103.8585 }
        ]
      },
      {
        "day": 4,
        "date": "2024-07-13",
        "theme": "Tạm biệt Phú Quốc",
        "activities": [
          { "time": "08:00", "location": "Vườn tiêu Phú Quốc", "note": "Tham quan và mua sắm", "lat": 10.2485, "lng": 103.9785 },
          { "time": "10:00", "location": "Nhà thùng nước mắm", "note": "Tìm hiểu quy trình sản xuất", "lat": 10.2225, "lng": 103.9625 }
        ]
      }
    ]
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
      "/sample_itineraries"
    );
  } catch (error) {
    console.warn("Fake API fallback cho Sample Itineraries");
    return {
      data: {
        status: 200,
        message: "Lấy dữ liệu sample mock thành công",
        data: MOCK_ITINERARIES,
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };
  }
};

export const getSampleItineraryById = async (
  id: string | number
): Promise<AxiosResponse<BackendResponse<ItineraryType>>> => {
  try {
    return await instance.get<BackendResponse<ItineraryType>>(
      `/sample_itineraries/${id}`
    );
  } catch (error) {
    console.warn(`Fake API fallback cho Sample Itinerary ID: ${id}`);
    const found = MOCK_ITINERARIES.find((it) => it.id == id);
    return {
      data: {
        status: 200,
        message: "Lấy dữ liệu sample detail mock thành công",
        data: found as ItineraryType,
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
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
