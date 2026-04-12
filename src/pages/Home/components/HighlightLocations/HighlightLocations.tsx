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
} from "phosphor-react";
import styles from "./HighlightLocations.module.scss";
import {
  getHighlightLocations,
  getHighlightHotels,
  getHighlightRestaurants,
  type HighlightItem,
} from "../../../../services/highlightService";

// Thêm Interface cho Props
interface HighlightLocationsProps {
  titlePrimary: string; // Ví dụ: "Gợi ý"
  titleHighlight: string; // Ví dụ: "nổi bật"
  description?: string; // Mô tả nhỏ bên dưới tiêu đề
}
const HighlightLocations: React.FC<HighlightLocationsProps> = ({
  titlePrimary,
  titleHighlight,
  description,
}) => {
  const [activeTab, setActiveTab] = useState<
    "locations" | "hotels" | "restaurants"
  >("locations");
  const [items, setItems] = useState<HighlightItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let res;
        if (activeTab === "locations") {
          res = await getHighlightLocations();
        } else if (activeTab === "hotels") {
          res = await getHighlightHotels();
        } else {
          res = await getHighlightRestaurants();
        }

        if (res && res.data && (res.data.status === 200 || res.data.status === 201)) {
          setItems(res.data.data || res.data.DT || []);
        }
      } catch (error) {
        console.error("Error fetching highlight data:", error);
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
              {(["locations", "hotels", "restaurants"] as const).map((tab) => (
                <button
                  key={tab}
                  className={`${styles.sliderTab} ${activeTab === tab ? styles.active : ""}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab === "locations"
                    ? "Địa điểm"
                    : tab === "hotels"
                      ? "Khách sạn"
                      : "Quán ăn"}
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
                <div
                  key={item.id}
                  className={styles.locationCard}
                  data-aos="fade-up"
                  data-aos-delay={idx * 100}
                >
                  <div className={styles.locationImage}>
                    <img src={item.img} alt={item.title} />
                    <span className={styles.locationBadge}>
                      {renderIcon(item.type)} {item.location}
                    </span>
                  </div>
                  <div className={styles.locationContent}>
                    <h3>{item.title}</h3>
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
                    <Link to={`/destination/${item.slug}`} className={styles.moreLink}>
                      Xem chi tiết <ArrowRight weight="bold" />
                    </Link>
                  </div>
                </div>
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
                {activeTab === "locations"
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
