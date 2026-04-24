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
import { getAttractionDetail, type Destination, getNearbyServices, type NearbyService } from "../../services/destinationService";

const DestinationDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<Destination | null>(null);
  const [nearbyServices, setNearbyServices] = useState<NearbyService[]>([]); 
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("overview");

  useEffect(() => {
    const fetchAllData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        
        const isHotel = window.location.pathname.includes('/hotel/');
        const isRestaurant = window.location.pathname.includes('/restaurant/');
        const isAttraction = window.location.pathname.includes('/attraction/');

        let detailRes;
        if (isHotel) detailRes = await getHotelDetail(id);
        else if (isRestaurant) detailRes = await getRestaurantDetail(id);
        else if (isAttraction) detailRes = await getAttractionDetail(id);
        else return;

        if (detailRes.data && detailRes.data.status === 200 && detailRes.data.data) {
          const mainData = detailRes.data.data;
          setData(mainData);
          document.title = `${mainData.name} - TravelAi`;
          
          // Fetch nearby services using locationId
          try {
            const nearbyRes = await getNearbyServices(id);
            if (nearbyRes.status === 200 && nearbyRes.data) {
              setNearbyServices(nearbyRes.data);
            }
          } catch (err) {
            console.error("Lỗi khi tải dịch vụ lân cận:", err);
          }
        }
      } catch (err) {
        console.error("Lỗi khi tải thông tin chi tiết:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
    AOS.init({ duration: 800, once: true });
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoading) return <div className={styles.loading}>Đang tải dữ liệu...</div>;
  if (!data) return <div className={styles.error}>Không tìm thấy thông tin địa điểm.</div>;

  // Chuẩn hóa dữ liệu cũ sang định dạng NearbyService để không bị lỗi Type
  const normalizedServices: NearbyService[] = nearbyServices.length > 0 
    ? nearbyServices 
    : (data.services || []).map(s => ({
        id: Number(s.id),
        locationId: Number(id),
        serviceType: s.type === "Khách sạn" ? "HOTEL" : s.type === "Nhà hàng" ? "RESTAURANT" : "OTHER",
        serviceName: s.name,
        description: "",
        address: s.location,
        latitude: 0,
        longitude: 0,
        distanceKm: 0,
        phoneNumber: null,
        openingHours: "",
        rating: s.rating,
        reviewCount: 0,
        imageUrl: s.image,
        priceLevel: s.price,
        status: "ACTIVE"
      }));

  return (
    <main className={styles.destMain}>
      <DestHero data={data} />
      <QuickStats data={data} />
      <DestTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <div className={styles.destContentGrid}>
        <div className={styles.destLeft}>
          {activeTab === "overview" && <OverviewTab data={data} />}
          {activeTab === "services" && (
            <ServicesTab services={normalizedServices} />
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