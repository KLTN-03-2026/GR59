import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CaretLeft,
  CaretRight,
  MapPin,
  Star,
  ArrowRight,
  Bed,
  ForkKnife,
  House,
  Fire,
} from "phosphor-react";
import styles from "./HighlightLocations.module.scss";
import {
  getHighlightLocations,
  getHighlightRestaurants,
  type HighlightItem,
} from "../../../../services/highlightService";
import { getHotels } from "../../../../services/hotelService";

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
  const [activeTab, setActiveTab] = useState<
    "all" | "locations" | "hotels" | "restaurants"
  >("all");
  const [items, setItems] = useState<HighlightItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setItems([]); // 1. Làm trống danh sách cũ để tránh nhầm lẫn dữ liệu khi chuyển tab
      
      try {
        let allFetchedItems: HighlightItem[] = [];
        
        if (activeTab === "all") {
          // Fetch tất cả dữ liệu đồng thời cho Tab "Tất cả"
          const [locationsRes, hotelsRes, restaurantsRes] = await Promise.all([
            getHighlightLocations(),
            getHotels(0, 50),
            getHighlightRestaurants()
          ]);

          if (locationsRes.data?.data) allFetchedItems = [...allFetchedItems, ...locationsRes.data.data];
          if (hotelsRes.data?.data?.content) allFetchedItems = [...allFetchedItems, ...hotelsRes.data.data.content];
          if (restaurantsRes.data?.data) allFetchedItems = [...allFetchedItems, ...restaurantsRes.data.data];
          
        } else if (activeTab === "locations") {
          const res = await getHighlightLocations();
          const rawData = res.data?.data || [];
          // 2. Lọc chủ động loại hình 'pin' cho Tab địa điểm
          allFetchedItems = rawData.filter(item => item.type === 'pin');
          
        } else if (activeTab === "hotels") {
          const res = await getHotels(0, 50);
          const rawData = res.data?.data?.content || [];
          // 3. Lọc chủ động loại hình 'bed' cho Tab khách sạn
          allFetchedItems = rawData.filter(item => item.type === 'bed');
          
        } else if (activeTab === "restaurants") {
          const res = await getHighlightRestaurants();
          const rawData = res.data?.data || [];
          // 4. Lọc chủ động loại hình 'food' cho Tab nhà hàng
          allFetchedItems = rawData.filter(item => item.type === 'food');
        }

        // 5. Áp dụng các bộ lọc chung (Rating, Tỉnh thành, ID hiện tại)
        let filtered = [...allFetchedItems];

        // Chỉ lấy từ 4.5 sao trở lên để đảm bảo là địa điểm "Nổi bật"
        filtered = filtered.filter(item => Number(item.rating) >= 4.0); // Giảm xuống 4.0 để có nhiều dữ liệu hơn nếu cần

        // Sắp xếp theo rating giảm dần
        filtered.sort((a, b) => Number(b.rating) - Number(a.rating));

        // Lọc theo tỉnh thành nếu là danh sách dịch vụ lân cận
        if (locationFilter) {
          const normalize = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
          const target = normalize(locationFilter);
          filtered = filtered.filter(item => 
            normalize(item.location || "").includes(target) || target.includes(normalize(item.location || ""))
          );
        }

        // Loại bỏ địa điểm hiện tại nếu đang ở trang chi tiết
        if (currentId) {
          filtered = filtered.filter(item => item.id.toString() !== currentId.toString());
        }

        setItems(filtered);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu Highlight:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Reset expanded state when changing tabs
    setIsExpanded(false);
  }, [activeTab]);

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
    if (type === "bed") return <Bed size={16} weight="fill" />;
    if (type === "food") return <ForkKnife size={16} weight="fill" />;
    return <MapPin size={16} weight="fill" />;
  };

  return (
    <section className={styles.locations}>
      <div className={`container ${styles.locationsContainer}`}>
        <div className={styles.headerWrapper} data-aos="fade-up">
          <div className={styles.header}>
            <div className={styles.headerTitle}>
              <h2 className={styles.sectionTitle}>
                {titlePrimary}
                <span className={styles.highlightUnderline}>
                  {titleHighlight}
                </span>
              </h2>
            </div>
            <p className={styles.sectionDescription}>{description}</p>
          </div>

          <div className={styles.controls}>
            <div className={styles.sliderTabs}>
              {(["all", "locations", "hotels", "restaurants"] as const).map((tab) => (
                <button
                  key={tab}
                  className={`${styles.sliderTab} ${activeTab === tab ? styles.active : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "all" && <House size={18} weight={activeTab === "all" ? "fill" : "bold"} />}
                  {tab === "locations" && <MapPin size={18} weight={activeTab === "locations" ? "fill" : "bold"} />}
                  {tab === "hotels" && <Bed size={18} weight={activeTab === "hotels" ? "fill" : "bold"} />}
                  {tab === "restaurants" && <ForkKnife size={18} weight={activeTab === "restaurants" ? "fill" : "bold"} />}
                  <span>
                    {tab === "all"
                      ? "Khám phá"
                      : tab === "locations"
                        ? "Địa điểm"
                        : tab === "hotels"
                          ? "Khách sạn"
                          : "Quán ăn"}
                  </span>
                </button>
              ))}
            </div>

            {!isExpanded && (
              <div className={styles.sliderNav}>
                <button
                  className={styles.sliderBtn}
                  title="Cuộn sang trái"
                  onClick={() => scrollSlider("left")}
                >
                  <div className={styles.sliderIcon}>
                    <CaretLeft weight="bold" />
                  </div>
                </button>
                <button
                  className={styles.sliderBtn}
                  title="Cuộn sang phải"
                  onClick={() => scrollSlider("right")}
                >
                  <div className={styles.sliderIcon}>
                    <CaretRight weight="bold" />
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className={styles.sliderWrap}>
          <div
            className={`${styles.sliderContent} ${isExpanded ? styles.gridContent : ""}`}
            ref={sliderRef}
          >
            {loading ? (
              <div
                style={{
                  padding: "40px",
                  textAlign: "center",
                  width: "100%",
                  color: "var(--primary-color)",
                }}
              >
                Đang tải dữ liệu...
              </div>
            ) : items && items.length > 0 ? (
              items.map((item, idx) => (
                <Link
                  key={item.id}
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
                    <div className={styles.locationImage}>
                      <img src={item.image} alt={item.name} />
                      <div className={styles.imageOverlay}></div>
                      <div className={styles.cardBadges}>
                        {item.isHot && (
                          <span className={styles.hotBadge}>
                            <Fire size={14} weight="fill" /> HOT
                          </span>
                        )}
                        <span className={styles.locationBadge}>
                          {renderIcon(item.type)} {item.location}
                        </span>
                      </div>
                      {item.price > 0 && (
                        <div className={styles.priceTag}>
                          Chỉ từ <span>{item.price.toLocaleString("vi-VN")}đ</span>
                        </div>
                      )}
                    </div>
                    <div className={styles.locationContent}>
                      <h3>{item.name}</h3>
                      <div className={styles.locationRating}>
                        <div className={styles.stars}>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              weight={
                                i < Math.floor(Number(item.rating))
                                  ? "fill"
                                  : "regular"
                              }
                            />
                          ))}
                        </div>
                        <span>
                          ({item.rating}/5 từ {item.reviews} đánh giá)
                        </span>
                      </div>
                      <p>{item.desc}</p>
                      <div className={styles.moreLink}>
                        Xem chi tiết <ArrowRight weight="bold" />
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
          <button
            className={styles.btnOutlineBlue}
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>Thu Gọn Danh Sách</>
            ) : (
              <>
                Xem Tất Cả{" "}
                {activeTab === "all" 
                  ? "Tất Cả Gợi Ý"
                  : activeTab === "locations"
                    ? "Địa Điểm"
                    : activeTab === "hotels"
                      ? "Khách Sạn"
                      : "Quán Ăn"}
              </>
            )}
            <ArrowRight
              weight="bold"
              style={{
                transform: isExpanded ? "rotate(-90deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease",
              }}
            />
          </button>
        </div>
      </div>
    </section>
  );
};

export default HighlightLocations;
