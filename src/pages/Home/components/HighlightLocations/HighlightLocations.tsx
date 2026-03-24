import React, { useState, useRef } from "react";
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

// Dữ liệu mẫu cho các Tab
const DATA = {
  locations: [
    {
      id: 1,
      title: "Phố cổ Hội An",
      location: "Quảng Nam",
      rating: "4.8",
      reviews: "1.2k",
      img: "https://images.unsplash.com/photo-1555921015-5532091f6026?auto=format&fit=crop&q=80&w=800",
      desc: "Hội An nổi tiếng với vẻ đẹp lãng mạn, cổ kính, yên bình với những ngôi nhà cổ.",
      type: "pin",
    },
    {
      id: 2,
      title: "Vịnh Hạ Long",
      location: "Quảng Ninh",
      rating: "4.9",
      reviews: "3.5k",
      img: "https://images.unsplash.com/photo-1528605105345-5344ea20e269?auto=format&fit=crop&q=80&w=800",
      desc: "Di sản thiên nhiên thế giới với hàng nghìn hòn đảo kỳ vĩ, hang động tuyệt đẹp.",
      type: "pin",
    },
    {
      id: 3,
      title: "Thành phố Đà Lạt",
      location: "Lâm Đồng",
      rating: "4.7",
      reviews: "2.8k",
      img: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&q=80&w=800",
      desc: "Thành phố ngàn hoa với khí hậu mát mẻ quanh năm và nhiều cảnh điểm lãng mạn.",
      type: "pin",
    },
  ],
  hotels: [
    {
      id: 4,
      title: "InterContinental Resort",
      location: "Đà Nẵng",
      rating: "4.9",
      reviews: "2.2k",
      img: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
      desc: "Khu nghỉ dưỡng sang trọng bậc nhất tọa lạc tại bán đảo Sơn Trà.",
      type: "bed",
    },
    {
      id: 5,
      title: "Topas Ecolodge",
      location: "Sapa",
      rating: "4.7",
      reviews: "1.8k",
      img: "https://images.unsplash.com/photo-1551882547-ff40c0d5f9af?auto=format&fit=crop&q=80&w=800",
      desc: "Trải nghiệm nghỉ dưỡng giữa thiên nhiên hoang sơ với hồ bơi vô cực.",
      type: "bed",
    },
  ],
  restaurants: [
    {
      id: 6,
      title: "Nhà hàng Gạo",
      location: "TP HCM",
      rating: "4.5",
      reviews: "950",
      img: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=800",
      desc: "Mang đến hương vị ẩm thực Việt Nam tinh tế giữa không gian Đông Dương.",
      type: "food",
    },
  ],
};
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
  const sliderRef = useRef<HTMLDivElement>(null);

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

            <div className={styles.sliderNav}>
              <button
                className={styles.sliderBtn}
                onClick={() => scrollSlider("left")}
              >
                <div className={styles.sliderIcon}>
                  <CaretLeft weight="bold" />
                </div>
              </button>
              <button
                className={styles.sliderBtn}
                onClick={() => scrollSlider("right")}
              >
                <div className={styles.sliderIcon}>
                  <CaretRight weight="bold" />
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className={styles.sliderWrap}>
          <div className={styles.sliderContent} ref={sliderRef}>
            {DATA[activeTab].map((item, idx) => (
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
                  <a href="/destination" className={styles.moreLink}>
                    Xem chi tiết <ArrowRight weight="bold" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.locationsAction} data-aos="fade-up">
          <a href="#" className={styles.btnOutlineBlue}>
            Xem Tất Cả{" "}
            {activeTab === "locations"
              ? "Địa Điểm"
              : activeTab === "hotels"
                ? "Khách Sạn"
                : "Quán Ăn"}
            <ArrowRight weight="bold" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default HighlightLocations;
