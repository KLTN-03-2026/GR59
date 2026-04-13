import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
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
import { getDestinationDetail, type Destination } from "../../services/destinationService";
import { getHotelDetail } from "../../services/hotelService";
import { getPlaces, getHighlightRestaurants } from "../../services/highlightService";
import { getHotels } from "../../services/hotelService";

const DestinationDetail: React.FC = () => {
  const { slug, id } = useParams<{ slug?: string, id?: string }>();
  const [data, setData] = useState<Destination | null>(null);
  const [nearbyServices, setNearbyServices] = useState<any[]>([]); // Danh sách dịch vụ lân cận đã lọc
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("overview");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setIsLoading(true);
        let res;
        
        if (id) {
          // Trường hợp xem chi tiết Khách sạn theo ID
          res = await getHotelDetail(id);
        } else if (slug) {
          // Trường hợp xem chi tiết Địa điểm theo Slug
          res = await getDestinationDetail(slug);
        } else {
          return;
        }

        if (res.data && res.data.status === 200 && res.data.data) {
          setData(res.data.data);
          document.title = `${res.data.data.name} - TravelAi`;
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
  }, [slug, id]);

  // Effect lấy và lọc dịch vụ lân cận khi đã có dữ liệu địa điểm hiện tại
  useEffect(() => {
    if (!data) return;

    const fetchNearby = async () => {
      try {
        const provinceName = data.location?.split(',').pop()?.trim() || "";
        if (!provinceName) return;

        let allItems: any[] = [];
        
        // Fetch đồng thời từ 3 nguồn
        const [placesRes, hotelsRes, restaurantsRes] = await Promise.all([
          getPlaces(),
          getHotels(0, 50),
          getHighlightRestaurants()
        ]);

        if (placesRes.data?.data) allItems = [...allItems, ...placesRes.data.data];
        if (hotelsRes.data?.data?.content) allItems = [...allItems, ...hotelsRes.data.data.content];
        if (restaurantsRes.data?.data) allItems = [...allItems, ...restaurantsRes.data.data];

        // Lọc theo tỉnh thành và loại bỏ bản ghi hiện tại
        const filtered = allItems.filter(item => 
          (item.location?.toLowerCase().includes(provinceName.toLowerCase())) &&
          (item.id.toString() !== (id?.toString() || data.id.toString()))
        );

        // Map sang định dạng Service để hiển thị trong Tab
        const mappedServices = filtered.slice(0, 8).map(item => ({
          id: item.id,
          name: item.name || item.title,
          location: item.location || provinceName,
          rating: Number(item.rating) || 4.5,
          image: item.image || item.img,
          type: item.type === 'bed' ? 'Khách sạn' : item.type === 'food' ? 'Nhà hàng' : 'Điểm đến',
          price: item.type === 'bed' ? 'Liên hệ' : item.type === 'food' ? '50.000đ+' : 'Miễn phí',
          unit: item.type === 'bed' ? 'đêm' : 'món',
          buttonText: item.type === 'bed' ? 'Đặt phòng' : 'Khám phá'
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