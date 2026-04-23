import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CaretLeft,
  CaretRight,
  MapPin,
  Star,
  BedIcon,
  ForkKnife,
  
} from "@phosphor-icons/react";
import styles from "./HighlightLocations.module.scss";
import AnimatedButton from "../../../../components/Ui/AnimatedButton/AnimatedButton";
import {
  getFeaturedAttractions,
  type HighlightItem,
} from "../../../../services/highlightService";

import SkeletonCard from "../../../../components/Ui/SkeletonCard/SkeletonCard";

// Thêm Interface cho Props
interface HighlightLocationsProps {
  titlePrimary: string; // Ví dụ: "Gợi ý"
  titleHighlight: string; // Ví dụ: "nổi bật"
  description?: string; // Mô tả nhỏ bên dưới tiêu đề
  locationFilter?: string; // Tên khu vực/tỉnh thành để lọc lân cận
  currentId?: string | number; // ID của địa điểm đang xem để loại bỏ khỏi danh sách gợi ý
}
const HighlightLocations: React.FC<HighlightLocationsProps> = ({
  titlePrimary,
  titleHighlight,
  description,
  locationFilter,
  currentId
}) => {
  const [items, setItems] = useState<HighlightItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  
  // Cơ chế Cache cho trang chủ
  const cacheRef = useRef<Record<string, HighlightItem[]>>({});

  // Chỉ tải dữ liệu khi component xuất hiện trên màn hình (Intersection Observer)
  const [hasInView, setHasInView] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);



  useEffect(() => {
    if (!hasInView) return;

    const controller = new AbortController();
    
    const fetchData = async () => {
      setLoading(true);
      setItems([]); 

      if (cacheRef.current["featured"]) {
        setItems(cacheRef.current["featured"]);
        setLoading(false);
        return;
      }
      
      try {
        const res = await getFeaturedAttractions(10);
        const allFetchedItems = res.data?.data || [];

        if (controller.signal.aborted) return;

        let filtered = [...allFetchedItems];
        filtered = filtered.filter(item => Number(item.rating) >= 4.0);
        filtered.sort((a, b) => Number(b.rating) - Number(a.rating));

        if (locationFilter) {
          const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
          const target = normalize(locationFilter);
          filtered = filtered.filter(item => 
            normalize(item.location || "").includes(target) || target.includes(normalize(item.location || ""))
          );
        }

        if (currentId) {
          filtered = filtered.filter(item => item.id.toString() !== currentId.toString());
        }

        cacheRef.current["featured"] = filtered;
        setItems(filtered);
      } catch (error) {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error("Lỗi khi tải dữ liệu Highlight:", error);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    setIsExpanded(false);

    return () => controller.abort();
  }, [locationFilter, currentId, hasInView]);



  const scrollSlider = (direction: "left" | "right") => {
    if (sliderRef.current) {
      const scrollAmount = 400;
      sliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const renderIcon = (type: string) => {
    if (type === "bed") return <BedIcon size={16} weight="fill" />;
    if (type === "food") return <ForkKnife size={16} weight="fill" />;
    return <MapPin size={16} weight="fill" />;
  };

  return (
    <section className={styles.locations} ref={sectionRef}>

      <div className={styles.locationsContainer}>
        <div className={styles.headerWrapper} data-aos="fade-up">
          <div className={styles.header}>
            <div className={styles.headerTitle}>
              <h2 className={styles.sectionTitle}>
                <span>{titlePrimary}</span>
                <span className={styles.highlightUnderline}>
                  {titleHighlight}
                </span>
              </h2>
            </div>
            <p className={styles.sectionDescription}>{description}</p>
          </div>

          <div className={styles.controls}>
            {/* Controls now empty as buttons moved to sides */}
          </div>
        </div>

        <div className={styles.sliderWrap}>
          {!isExpanded && (
            <div className={styles.sliderNav}>
              <button
                className={`${styles.sliderBtn} ${styles.prevBtn}`}
                title="Cuộn sang trái"
                onClick={() => scrollSlider("left")}
              >
                <CaretLeft weight="bold" />
              </button>
              <button
                className={`${styles.sliderBtn} ${styles.nextBtn}`}
                title="Cuộn sang phải"
                onClick={() => scrollSlider("right")}
              >
                <CaretRight weight="bold" />
              </button>
            </div>
          )}
          <div
            className={`${styles.sliderContent} ${isExpanded ? styles.gridContent : ""}`}
            ref={sliderRef}
          >
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={`skeleton-home-${i}`} style={{ minWidth: '320px', flex: '0 0 auto' }}>
                  <SkeletonCard />
                </div>
              ))
            ) : items && items.length > 0 ? (
              items.map((item, idx) => (
                <Link
                  key={`${item.type}-${item.id}`}
                  to={
                    item.type === 'bed' 
                      ? `/hotel/${item.id}` 
                      : item.type === 'food' 
                        ? `/restaurant/${item.id}` 
                        : `/attraction/${item.id}`
                  }
                  className={styles.cardWrapperLink}
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                >
                  <div className={styles.locationCard}>
                    <div className={styles.imageContainer}>
                      <img src={item.image} alt={item.name} loading="lazy" />
                      <div className={styles.imageOverlay}></div>
                      <div className={styles.statusBadge}>
                        <span className={`${styles.ribbon} ${styles[item.status?.toLowerCase() || 'active']}`}>
                          {item.status === 'ACTIVE' || item.status === 'OPEN' ? 'Đang mở cửa' : 
                           item.status === 'MAINTENANCE' ? 'Đang bảo trì' : 'Đã đóng cửa'}
                        </span>
                      </div>
                      {item.isHot && (
                        <div className={styles.hotTag}>
                          HOT
                        </div>
                      )}
                      {item.price > 0 && (
                        <div className={styles.floatingPrice}>
                          {item.price.toLocaleString("vi-VN")}đ
                        </div>
                      )}
                    </div>
                    
                    <div className={styles.cardInfo}>
                      <div className={styles.infoHead}>
                        <div className={styles.typeBadge}>
                          {renderIcon(item.type)} {item.type === 'bed' ? 'Khách sạn' : item.type === 'food' ? 'Ẩm thực' : 'Địa điểm'}
                        </div>
                        <div className={styles.ratingBadge}>
                          <Star size={14} weight="fill" /> {item.rating}
                        </div>
                      </div>
                      
                      <h3>{item.name}</h3>
                      <p>{item.desc}</p>
                      
                      <div className={styles.infoFooter}>
                        <div className={styles.locationName}>
                          <MapPin size={14} weight="fill" /> {item.location}
                        </div>
                        <div className={styles.viewDetail}>
                          <AnimatedButton text="XEM THÊM" size="mini" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div style={{ padding: "40px", textAlign: "center", width: "100%" }}>
                Không tìm thấy dữ liệu.
              </div>
            )}
          </div>
        </div>

        <div className={styles.locationsAction} data-aos="fade-up">
          <AnimatedButton 
            onClick={() => setIsExpanded(!isExpanded)}
            text={isExpanded ? "THU GỌN" : "XEM TẤT CẢ GỢI Ý"}
          />
        </div>
      </div>
    </section>
  );
};

export default HighlightLocations;
