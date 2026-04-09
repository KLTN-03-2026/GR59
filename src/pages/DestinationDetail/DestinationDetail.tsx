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

const DestinationDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<Destination | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("overview");

  useEffect(() => {
    const fetchDetail = async () => {
      if (!slug) return;
      try {
        setIsLoading(true);
        const res = await getDestinationDetail(slug);
        if (res.data && res.data.status === 200) {
          setData(res.data.data);
          document.title = `${res.data.data.title} - AI Travel Planner`;
        }
      } catch (err) {
        console.error("Lỗi khi tải chi tiết địa điểm:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
    AOS.init({ duration: 800, once: true });
    window.scrollTo(0, 0);
  }, [slug]);

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
          {activeTab === "services" && <ServicesTab services={data.services} />}
          {activeTab === "reviews" && <ReviewsTab reviews={data.reviewsData} />}
          {activeTab === "tips" && <TipsTab tips={data.travelTips} />}
        </div>
        
        <Sidebar data={data} />
      </div>

      <HighlightLocations
        titlePrimary="Địa điểm"
        titleHighlight="liên quan"
        description={`Những địa điểm tương tự như ${data.title} dành cho bạn.`}
      />
    </main>
  );
};

export default DestinationDetail;