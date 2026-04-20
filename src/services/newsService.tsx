import type { AxiosResponse } from "axios";
import instance from "../utils/AxiosCustomize";
import type { NewsItem } from "../pages/News/types";

// Mock data as fallback
import { dragonBridge } from "../assets/images/img";

const MOCK_NEWS: NewsItem[] = [
  {
    id: 1,
    title: "Hội An Lọt Top Những Điểm Đến Lãng Mạn Nhất Thế Giới 2024",
    excerpt: "Khám phá vẻ đẹp cổ kính và lung linh của phố Hội qua góc nhìn mới rực rỡ dưới ánh đèn lồng...",
    image: dragonBridge,
    category: "Điểm đến",
    date: "15 Th03, 2024",
    readTime: "5 phút đọc",
    isFeatured: true,
  },
  {
    id: 2,
    title: "10 Món Ăn Đường Phố Phải Thử Khi Đến Bangkok",
    excerpt: "Trải nghiệm tinh hoa ẩm thực Thái Lan qua những gian hàng rực rỡ màu sắc và hương vị khó quên...",
    image: "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800",
    category: "Ẩm thực",
    date: "10 Th03, 2024",
    readTime: "6 phút đọc",
  },
  {
    id: 3,
    title: "Bí kíp săn vé máy bay giá rẻ mùa cao điểm 2024",
    excerpt: "Đừng để chi phí vé máy bay làm cản trở chuyến đi của bạn. Hãy áp dụng ngay 5 mẹo nhỏ này...",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=800",
    category: "Mẹo du lịch",
    date: "08 Th03, 2024",
    readTime: "4 phút đọc",
  },
  {
    id: 4,
    title: "Lễ hội khinh khí cầu quốc tế tại Đà Nẵng có gì hot?",
    excerpt: "Cùng chiêm ngưỡng màn trình diễn ánh sáng và màu sắc tuyệt vời trên bầu trời Đà Nẵng tháng 4 này...",
    image: "https://images.unsplash.com/photo-1507608830114-70fbc6f5a322?q=80&w=800",
    category: "Sự kiện",
    date: "05 Th03, 2024",
    readTime: "7 phút đọc",
  },
  {
    id: 5,
    title: "Top 5 homestay view biển cực chill ở Phú Quốc",
    excerpt: "Bạn đang tìm kiếm một nơi nghỉ dưỡng yên tĩnh và có góc chụp hình sống ảo? Đây là danh sách dành cho bạn...",
    image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800",
    category: "Điểm đến",
    date: "01 Th03, 2024",
    readTime: "5 phút đọc",
  },
  {
    id: 6,
    title: "Hành trình chinh phục Fansipan bằng đường bộ",
    excerpt: "Một trải nghiệm đầy thử thách nhưng vô cùng xứng đáng cho những ai yêu thích leo núi khám phá...",
    image: "https://images.unsplash.com/photo-1504457047772-27fad17438e2?q=80&w=800",
    category: "Mẹo du lịch",
    date: "28 Th02, 2024",
    readTime: "10 phút đọc",
  },
  {
    id: 7,
    title: "Cà phê muối - Nét độc đáo của ẩm thực Huế",
    excerpt: "Vị mặn của muối hòa quyện cùng vị đắng của cà phê tạo nên một hương vị khó quên cho du khách khi đến cố đô...",
    image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800",
    category: "Ẩm thực",
    date: "25 Th02, 2024",
    readTime: "3 phút đọc",
  },
  {
    id: 8,
    title: "Flycam: Toàn cảnh vịnh Hạ Long từ trên cao",
    excerpt: "Những thước phim tuyệt đẹp khoe trọn vẻ hùng vĩ của một trong những kỳ quan thiên nhiên thế giới...",
    image: "https://images.unsplash.com/photo-1559592442-7e18ad73d631?q=80&w=800",
    category: "Điểm đến",
    date: "20 Th02, 2024",
    readTime: "5 phút đọc",
  },
  {
    id: 9,
    title: "Du lịch Nhật Bản mùa hoa anh đào: Kinh nghiệm từ A-Z",
    excerpt: "Tất cả những gì bạn cần biết để có một chuyến thưởng hoa trọn vẹn tại xứ sở mặt trời mọc...",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800",
    category: "Mẹo du lịch",
    date: "15 Th02, 2024",
    readTime: "12 phút đọc",
  },
  {
    id: 10,
    title: "Khai mạc tuần lễ văn hóa dân gian tại Sa Pa",
    excerpt: "Nhiều hoạt động văn hóa đặc sắc của các dân tộc thiểu số sẽ được tái hiện chân thực tại thị trấn mờ sương...",
    image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=800",
    category: "Sự kiện",
    date: "10 Th02, 2024",
    readTime: "6 phút đọc",
  },
];

export interface PageInfo {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface NewsResponse {
  content: NewsItem[];
  page: PageInfo;
}

export interface BackendResponse<T = unknown> {
  status: number;
  message: string;
  data?: T;
  DT?: T;
}

// Helper to format date
const formatDate = (isoString: string) => {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return isoString;
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day} Th${month}, ${year}`;
};

export const getNewsList = async (page = 0, size = 100, category?: string, keyword?: string): Promise<AxiosResponse<BackendResponse<NewsResponse>>> => {
  try {
    let url = `/news?page=${page}&size=${size}`;
    
    if (keyword && keyword.trim() !== "") {
      url = `/news/search?keyword=${encodeURIComponent(keyword)}&page=${page}&size=${size}`;
    } else if (category && category !== "Tất cả") {
      url = `/news/category/${encodeURIComponent(category)}?page=${page}&size=${size}`;
    }
    
    const response = await instance.get<BackendResponse<NewsResponse>>(url);
    
    // Map dates and fallback images if needed
    if (response.data && response.data.data && response.data.data.content) {
      response.data.data.content = response.data.data.content.map(item => ({
        ...item,
        date: item.createdAt ? formatDate(item.createdAt) : "",
        image: item.image || "https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=800"
      }));
    }
    
    return response;
  } catch (error) {
    // Fallback if API fails
    console.warn("Fake API fallback cho News");
    const mockContent = MOCK_NEWS.map(item => ({
      ...item,
      content: item.excerpt,
      createdAt: new Date().toISOString(),
      isFeatured: !!item.isFeatured
    }));
    return {
      data: {
        status: 200,
        message: "Lấy dữ liệu mock thành công",
        data: {
          content: mockContent,
          page: {
            size: 100,
            number: 0,
            totalElements: mockContent.length,
            totalPages: 1
          }
        }
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };
  }
};

export const getFeaturedNewsList = async (page = 0, size = 5): Promise<AxiosResponse<BackendResponse<NewsResponse>>> => {
  try {
    const response = await instance.get<BackendResponse<NewsResponse>>(`/news/featured?page=${page}&size=${size}`);
    
    // Map dates and fallback images if needed
    if (response.data && response.data.data && response.data.data.content) {
      response.data.data.content = response.data.data.content.map(item => ({
        ...item,
        date: item.createdAt ? formatDate(item.createdAt) : "",
        image: item.image || "https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=800"
      }));
    }
    
    return response;
  } catch (error) {
    // Fallback if API fails
    console.warn("Fake API fallback cho Featured News");
    const mockContent = MOCK_NEWS.filter(item => item.isFeatured).map(item => ({
      ...item,
      content: item.excerpt,
      createdAt: new Date().toISOString(),
      isFeatured: !!item.isFeatured
    }));
    return {
      data: {
        status: 200,
        message: "Lấy dữ liệu mock thành công",
        data: {
          content: mockContent.slice(0, size),
          page: {
            size,
            number: page,
            totalElements: mockContent.length,
            totalPages: Math.ceil(mockContent.length / size) || 1
          }
        }
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };
  }
};

export const getNewsDetail = async (id: number | string): Promise<AxiosResponse<BackendResponse<NewsItem>>> => {
  try {
    const response = await instance.get<BackendResponse<NewsItem>>(`/news/${id}`);
    
    if (response.data && response.data.data) {
      const item = response.data.data;
      response.data.data = {
        ...item,
        date: item.createdAt ? formatDate(item.createdAt) : "",
        image: item.image || "https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=800"
      };
    }
    
    return response;
  } catch (error) {
    console.warn(`Fake API fallback cho News Detail id: ${id}`);
    const mockItem = MOCK_NEWS.find(n => n.id.toString() === id.toString()) || MOCK_NEWS[0];
    const detailItem = {
      ...mockItem,
      content: mockItem.excerpt,
      createdAt: new Date().toISOString(),
      isFeatured: !!mockItem.isFeatured
    };
    
    return {
      data: {
        status: 200,
        message: "Lấy chi tiết mock thành công",
        data: detailItem
      },
      status: 200,
      statusText: "OK",
      headers: {},
      config: {} as any,
    };
  }
};
