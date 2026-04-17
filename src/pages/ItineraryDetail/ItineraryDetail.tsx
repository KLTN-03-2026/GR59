import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import styles from './ItineraryDetail.module.scss';
import ItinerarySidebar from './Components/ItinerarySidebar/ItinerarySidebar';
import ItineraryMap from './Components/ItineraryMap/ItineraryMap';
import AddSpotModal from './Components/AddSpotModal/AddSpotModal';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { toast } from 'react-toastify';
import { 
  getAISuggestedRoute, 
  getTravelMetrics, 
  updateTravelPlan,
  getSampleItineraryById 
} from '../../services/itineraryService';
import PlaceDetailPanel from './Components/PlaceDetailPanel/PlaceDetailPanel';
import NavigationModal from './Components/NavigationModal/NavigationModal';

export interface RoutePoint {
  id: string;
  name: string;
  lat: number;
  lng: number;
  time: string; // HH:mm format
  type: 'hotel' | 'restaurant' | 'attraction' | 'shopping' | 'other';
  imageUrl?: string;
  description?: string;
  note?: string;
  day: number; // Thêm trường ngày
}

const INITIAL_POINTS: RoutePoint[] = [
  {
    id: 'p1',
    name: 'Cầu Rồng Đà Nẵng',
    lat: 16.0614,
    lng: 108.227,
    time: '09:00',
    type: 'attraction',
    imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=400&auto=format&fit=crop',
    description: 'Cầu Rồng không chỉ là biểu tượng kiến trúc vĩ đại của Đà Nẵng mà còn là điểm đến không thể bỏ qua với màn phun lửa và phun nước ngoạn mục vào mỗi tối cuối tuần.',
    day: 1
  },
  {
    id: 'p2',
    name: 'Biển Mỹ Khê',
    lat: 16.0544,
    lng: 108.249,
    time: '11:45',
    type: 'attraction',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=400&auto=format&fit=crop',
    description: 'Được tạp chí Forbes bình chọn là một trong những bãi biển quyén rũ nhất hành tinh, Mỹ Khê thu hút du khách bởi bãi cát trắng mịn, bờ biển uốn lượn, nước trong xanh.',
    day: 1
  },
  {
    id: 'p3',
    name: 'Bà Nà Hills',
    lat: 15.9975,
    lng: 107.992,
    time: '13:00',
    type: 'attraction',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=400&auto=format&fit=crop',
    description: 'Bà Nà Hills mang đến trải nghiệm thời tiết 4 mùa trong 1 ngày kỳ diệu. Bạn sẽ được ngoạn cảnh trên tuyến cáp treo đạt nhiều kỷ lục thế giới.',
    day: 2
  },
  {
    id: 'p5',
    name: 'Phố cổ Hội An',
    lat: 15.8794,
    lng: 108.3283,
    time: '15:00',
    type: 'attraction',
    imageUrl: 'https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=400&auto=format&fit=crop',
    description: 'Hội An lung linh sắc đèn lồng về đêm, nơi bạn sẽ được thả đèn hoa đăng và thưởng thức ẩm thực đường phố đặc sắc.',
    day: 3
  }
];

import Navbar from '../../components/Layout/Navbar/Navbar';

const ItineraryDetail: React.FC = () => {
  const [points, setPoints] = useState<RoutePoint[]>([]);
  const [activePointId, setActivePointId] = useState<string | null>(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [previewPoint, setPreviewPoint] = useState<RoutePoint | null>(null);
  const [metrics, setMetrics] = useState<Record<string, { distance: string; duration: number }>>({});
  
  // Navigation Modal State
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [navDestination, setNavDestination] = useState<{lat: number, lng: number, name: string} | null>(null);
  const [userLocation, setUserLocation] = useState<string | null>(null);
  
  const [activeDay, setActiveDay] = useState(1);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const planData = location.state?.planData;
  const itineraryDataFromState = location.state?.itineraryData;

  // Calculate metrics between consecutive points for both Sidebar and Map
  useEffect(() => {
    const fetchMetrics = async () => {
      const segmentRequests = [];
      const keys: string[] = [];

      for (let i = 0; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        const key = `${p1.id}-${p2.id}`;
        
        if (!metrics[key]) {
          keys.push(key);
          segmentRequests.push(
            getTravelMetrics(
              { lat: p1.lat, lng: p1.lng },
              { lat: p2.lat, lng: p2.lng }
            )
          );
        }
      }

      if (segmentRequests.length > 0) {
        try {
          const results = await Promise.all(segmentRequests);
          const newMetrics = { ...metrics };
          results.forEach((res, index) => {
            newMetrics[keys[index]] = res;
          });
          setMetrics(newMetrics);
        } catch (err) {
          console.error("Error fetching metrics in parallel:", err);
        }
      }
    };

    if (points.length > 1) {
      fetchMetrics();
    } else {
      setMetrics({});
    }
  }, [points]);
  
  // Login Protection (Bỏ qua nếu là xem lộ trình mẫu)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && !id) {
      toast.warning('Vui lòng đăng nhập để sử dụng tính năng này!');
      navigate('/auth');
    }
  }, [navigate, id]);

  // Lấy vị trí hiện tại để làm điểm bắt đầu chỉ đường
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation(`${position.coords.latitude},${position.coords.longitude}`);
        },
        (error) => {
          console.error("Error getting location for navigation:", error);
        }
      );
    }
  }, []);

  // Fetch AI Suggested Route or Sample Itinerary
  useEffect(() => {
    const fetchData = async () => {
      // 1. Trường hợp có id (Xem lộ trình mẫu)
      if (id) {
        setIsOptimizing(true);
        try {
          let sampleData = itineraryDataFromState;
          if (!sampleData) {
            const res = await getSampleItineraryById(id);
            sampleData = res.data.DT || res.data.data;
          }

          if (sampleData && sampleData.itinerary) {
            // Chuyển đổi cấu trúc lồng ngày sang RoutePoint phẳng
            const flattenedPoints: RoutePoint[] = [];
            sampleData.itinerary.forEach((dayPlan: any) => {
              dayPlan.activities.forEach((act: any, idx: number) => {
                flattenedPoints.push({
                  id: `sample-${sampleData.id}-${dayPlan.day}-${idx}`,
                  name: act.location,
                  lat: act.lat || 11.94, // Real coordinate from data or fallback to central city
                  lng: act.lng || 108.44,
                  time: act.time,
                  type: 'attraction',
                  note: act.note,
                  day: dayPlan.day,
                  description: act.note,
                  imageUrl: sampleData.img // Dùng ảnh bìa trip làm ảnh tạm cho activity
                });
              });
            });
            setPoints(flattenedPoints);
          }
          setIsOptimizing(false);
        } catch (error) {
          console.error("Lỗi lấy lộ trình mẫu:", error);
          setPoints(INITIAL_POINTS);
          setIsOptimizing(false);
        }
        return;
      }

      // 2. Trường hợp từ Planner (AI gợi ý)
      if (planData) {
        setIsOptimizing(true);
        try {
          const res = await getAISuggestedRoute(planData);
          if (res.data.status === 200 && res.data.data) {
            setPoints(res.data.data);
            setTimeout(() => {
              setIsOptimizing(false);
              toast.success(`Lộ trình tại ${planData.destination} đã được tối ưu hóa!`);
            }, 3000);
          }
        } catch (error) {
          console.error("Lỗi lấy lộ trình AI:", error);
          setPoints(INITIAL_POINTS);
          setIsOptimizing(false);
        }
      } else {
        setPoints(INITIAL_POINTS);
      }
    };

    fetchData();
  }, [id, planData, itineraryDataFromState]);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    AOS.refresh();
  }, []);

  const handleAddSpot = (newPoint: Omit<RoutePoint, 'id'>) => {
    // Lấy ngày hiện tại đang xem từ Sidebar (truyền qua state hoặc giả định ở đây)
    // Để tiện nhất, tôi sẽ mặc định lấy từ state của Tab đang mở
    const point: RoutePoint = {
      ...newPoint,
      id: Math.random().toString(36).substr(2, 9),
      day: 1 // Mặc định là ngày 1 nếu không ép cụ thể
    };
    
    const newPoints = [...points, point].sort((a, b) => {
      const timeA = parseInt(a.time.replace(':', ''), 10);
      const timeB = parseInt(b.time.replace(':', ''), 10);
      return timeA - timeB;
    });

    setPoints(newPoints);
    setActivePointId(point.id);
    setPreviewPoint(null); // Clear preview when added

    // Sync with Backend (Giả sử chúng ta đang cập nhật planId 'current')
    const syncData = async () => {
      try {
        const res = await updateTravelPlan('current-plan', newPoints);
        if (res.data.status === 200) {
          toast.success("Đã đồng bộ lịch trình với máy chủ!");
        }
      } catch (err) {
        console.error("Lỗi đồng bộ:", err);
      }
    };
    syncData();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setPreviewPoint(null); // Clear preview when closing modal
  };

  return (
    <div className={styles.detailPageContainer}>
      <Navbar />
      
      {/* Loading Overlay */}
      {isOptimizing && (
        <div className={styles.optimizingOverlay}>
          <div className={styles.loaderContent}>
            <div className={styles.brainIcon}>
              <i className="ph-fill ph-sparkle"></i>
              <i className="ph-fill ph-brain"></i>
            </div>
            <h2>AI đang tối ưu hóa lộ trình cho bạn...</h2>
            <p>Dựa trên địa điểm <b>{planData?.destination}</b>, ngân sách <b>{planData?.budget}</b> và <b>{planData?.peopleGroup} người</b>.</p>
            <div className={styles.progressBar}>
              <div className={styles.progressInner}></div>
            </div>
          </div>
        </div>
      )}

      <div className={styles.splitViewContainer}>
        <ItinerarySidebar 
          points={points} 
          activePointId={activePointId}
          onPointClick={(id) => setActivePointId(id)}
          isPreviewing={isPreviewing}
          onTogglePreview={() => setIsPreviewing(!isPreviewing)}
          onOpenAddModal={() => setIsModalOpen(true)}
          planData={planData}
          metrics={metrics}
          activeDay={activeDay}
          setActiveDay={setActiveDay}
          onOpenNavigation={(lat, lng, name) => {
            setNavDestination({ lat, lng, name });
            setIsNavOpen(true);
          }}
        />
        
        <ItineraryMap 
          points={points.filter(p => (p.day || 1) === activeDay)} 
          activePointId={activePointId}
          onPointClick={(id) => setActivePointId(id)}
          isPreviewing={isPreviewing}
          previewPoint={previewPoint}
          metrics={metrics}
          onOpenNavigation={(lat, lng, name) => {
            setNavDestination({ lat, lng, name });
            setIsNavOpen(true);
          }}
        />

        {isModalOpen && (
          <AddSpotModal 
            onClose={handleCloseModal}
            onAdd={handleAddSpot}
            onPreviewSpot={(p) => setPreviewPoint(p as RoutePoint)}
          />
        )}

        <PlaceDetailPanel 
          pointId={activePointId} 
          points={points} 
          onClose={() => setActivePointId(null)} 
          onOpenNavigation={(lat, lng, name) => {
            setNavDestination({ lat, lng, name });
            setIsNavOpen(true);
          }}
        />

        {isNavOpen && navDestination && (
          <NavigationModal 
            onClose={() => setIsNavOpen(false)}
            destination={navDestination}
            userLocation={userLocation}
          />
        )}
      </div>
    </div>
  );
};

export default ItineraryDetail;