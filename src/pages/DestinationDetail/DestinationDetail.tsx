import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

// Import các Component con
import styles from "./DestinationDetail.module.scss";
import DestHero from "./components/DestHero/DestHero";
import QuickStats from "./components/QuickStats/QuickStats";
import DestTabs from "./components/DestTabs/DestTabs";
import OverviewTab from "./components/OverviewTab/OverviewTab";
import Sidebar from "./components/Sidebar/Sidebar";
import ServicesTab from "./components/ServicesTab/ServicesTab";
import ReviewsTab from "./components/ReviewsTab/ReviewsTab";
import TipsTab from "./components/TipsTab/TipsTab";
import HighlightLocations from "../Home/components/HighlightLocations/HighlightLocations";
import { getHotelDetail, getHotels } from "../../services/hotelService";
import { getHighlightRestaurants } from "../../services/highlightService";
import { getRestaurantDetail } from "../../services/restaurantService";
import { getAttractionDetail, type Destination } from "../../services/destinationService";

const DestinationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<Destination | null>(null);
  const [nearbyServices, setNearbyServices] = useState<any[]>([]); // Danh sách dịch vụ lân cận đã lọc
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("overview");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);

        // Kiểm tra Token cho trường hợp Khách sạn (yêu cầu từ BE)
        if (id) {
          const token = localStorage.getItem("token");
          if (!token) {
            console.warn("Truy cập trang khách sạn yêu cầu đăng nhập.");
            navigate("/auth?mode=login");
            return;
          }
        }
        
        let res;
        const isHotel = window.location.pathname.includes('/hotel/');
        const isRestaurant = window.location.pathname.includes('/restaurant/');
        const isAttraction = window.location.pathname.includes('/attraction/');
        
        if (isHotel && id) {
          res = await getHotelDetail(id);
        } else if (isRestaurant && id) {
          res = await getRestaurantDetail(id);
        } else if (isAttraction && id) {
          res = await getAttractionDetail(id);
        } else {
          return;
        }

        if (res.data && res.data.status === 200 && (res.data.data || (res.data as any).DT)) {
          const detailData = res.data.data || (res.data as any).DT;
          setData(detailData);
          document.title = `${detailData.name} - TravelAi`;
        }
      } catch (err) {
        console.error("Lỗi khi tải thông tin chi tiết:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
    AOS.init({ duration: 800, once: true });
    window.scrollTo(0, 0);
  }, [id]);

  // Effect lấy và lọc dịch vụ lân cận khi đã có dữ liệu địa điểm hiện tại
  useEffect(() => {
    if (!data) return;

    const fetchNearby = async () => {
      try {
        // Hàm chuẩn hóa chuỗi để so sánh chính xác hơn
        const normalize = (str: string) => 
          str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();

        // 1. Trích xuất tên tỉnh thành từ location của địa điểm hiện tại
        // Thường là phần cuối sau dấu phẩy, hoặc chính là chuỗi đó nếu không có dấu phấy
        const locationParts = data.location?.split(',') || [];
        const rawProvince = locationParts.length > 0 ? locationParts[locationParts.length - 1].trim() : "";
        const targetProvinceNorm = normalize(rawProvince);

        if (!targetProvinceNorm) return;

        let allItems: any[] = [];
        
        // 2. Fetch đồng thời với số lượng lớn hơn để đảm bảo tập dữ liệu lọc
        const [hotelsRes, restaurantsRes] = await Promise.all([
          getHotels(0, 100), // Tăng size lên 100
          getHighlightRestaurants()
        ]);

        if (hotelsRes.data?.data?.content) allItems = [...allItems, ...hotelsRes.data.data.content];
        if (restaurantsRes.data?.data) allItems = [...allItems, ...restaurantsRes.data.data];

        // 3. Lọc theo tỉnh thành và loại bỏ bản ghi hiện tại
        // Kết hợp kiểm tra provinceId (nếu có) và so sánh chuỗi chuẩn hóa
        const filtered = allItems.filter(item => {
          const isSameItem = item.id.toString() === (id?.toString() || data.id.toString());
          if (isSameItem) return false;

          // Ưu tiên so sánh qua provinceId nếu trùng khớp (giả định provinceId của data cũng có thể lấy được)
          const currentProvinceId = (data as any).provinceId;
          if (currentProvinceId && item.provinceId && currentProvinceId === item.provinceId) return true;

          // Fallback: So sánh chuỗi location đã chuẩn hóa
          const itemLocationNorm = normalize(item.location || "");
          return itemLocationNorm.includes(targetProvinceNorm) || targetProvinceNorm.includes(itemLocationNorm);
        });

        // 4. Map sang định dạng Service để hiển thị trong Tab
        const mappedServices = filtered.slice(0, 8).map(item => ({
          id: item.id,
          name: item.name || item.title,
          location: item.location || rawProvince,
          rating: Number(item.rating) || 4.5,
          image: item.image || item.img,
          type: item.type === 'bed' ? 'Khách sạn' : item.type === 'food' ? 'Nhà hàng' : 'Điểm đến',
          price: item.type === 'bed' ? 'Liên hệ' : item.type === 'food' ? 'Giá từ 50k' : 'Miễn phí',
          unit: item.type === 'bed' ? 'đêm' : 'món',
          buttonText: "Khám phá" // Đổi tất cả thành Khám phá/Xem chi tiết theo yêu cầu
        }));

        setNearbyServices(mappedServices);
      } catch (error) {
        console.error("Lỗi khi fetch dịch vụ lân cận:", error);
      }
    };

    fetchNearby();
  }, [data, id]);

  if (isLoading) return <div className={styles.loading}>Đang tải dữ liệu...</div>;
  if (!data) return <div className={styles.error}>Không tìm thấy thông tin địa điểm.</div>;

  return (
    <main className={styles.destMain}>
      <DestHero data={data} />
      <QuickStats data={data} />
      <DestTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className={styles.destContentGrid}>
        <div className={styles.destLeft}>
          {activeTab === "overview" && <OverviewTab data={data} />}
          {activeTab === "services" && (
            <ServicesTab services={nearbyServices.length > 0 ? nearbyServices : data.services} />
          )}
          {activeTab === "reviews" && <ReviewsTab reviews={data.reviewsData} />}
          {activeTab === "tips" && <TipsTab tips={data.travelTips} />}
        </div>
        
        <Sidebar data={data} />
      </div>

      <HighlightLocations
        titlePrimary="Địa điểm"
        titleHighlight="liên quan"
        description={`Những địa điểm tương tự như ${data.name} dành cho bạn.`}
      />
    </main>
  );
};

export default DestinationDetail;