import React, { useState, useEffect, useMemo } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import styles from "./SampleItinerary.module.scss";

// Import Components
import ItineraryHero from "./components/ItineraryHero/ItineraryHero";
import FilterSection from "./components/FilterSection/FilterSection";
import ItineraryCard from "./components/ItineraryCard/ItineraryCard";
import CategoryTabs from "./components/CategoryTabs/CategoryTabs";
import AICustomCTA from "./components/AICustomCTA/AICustomCTA";

// Import Types
import type { ItineraryType, FilterState } from "./types";

// Dữ liệu mẫu (12 mục)
const MOCK_ITINERARIES: ItineraryType[] = [
  {
    id: 1,
    title: "Hành trình Di sản miền Trung",
    image: "https://images.unsplash.com/photo-1559592490-67245a494447?q=80&w=800",
    price: 1500000,
    maxPeople: 5,
    location: "Đà Nẵng",
    duration: "3 Ngày 2 Đêm",
    rating: 4.9,
    category: "culture",
    steps: [
      { time: "08:00", activity: "Đón khách tại sân bay Đà Nẵng", dist: "2km từ TT" },
      { time: "10:00", activity: "Check-in Bán đảo Sơn Trà", dist: "10km từ TT" },
      { time: "12:00", activity: "Thưởng thức Mì Quảng chính gốc", dist: "3km từ TT" },
    ],
  },
  {
    id: 2,
    title: "Khám phá Phố Cổ Hội An",
    image: "https://images.unsplash.com/photo-1589308078059-be1415eab4c3?q=80&w=800",
    price: 850000,
    maxPeople: 2,
    location: "Hội An",
    duration: "1 Ngày",
    rating: 4.8,
    category: "culture",
    steps: [
      { time: "15:00", activity: "Di chuyển đi Hội An", dist: "30km từ TT" },
      { time: "17:00", activity: "Thăm Chùa Cầu & Nhà Cổ", dist: "30.5km từ TT" },
      { time: "19:00", activity: "Ăn tối & Thả đèn hoa đăng", dist: "30.5km từ TT" },
    ],
  },
  {
    id: 3,
    title: "Nghỉ dưỡng biển Mỹ Khê",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800",
    price: 2500000,
    maxPeople: 4,
    location: "Đà Nẵng",
    duration: "2 Ngày 1 Đêm",
    rating: 4.9,
    category: "beach",
    steps: [
      { time: "09:00", activity: "Tắm biển & Chụp hình", dist: "1km từ TT" },
      { time: "14:00", activity: "Chơi các trò chơi nước", dist: "1.2km từ TT" },
    ],
  },
  {
    id: 4,
    title: "Tour Tiết Kiệm Ngũ Hành Sơn",
    image: "https://images.unsplash.com/photo-1506461883276-594a12b11cf3?q=80&w=800",
    price: 450000,
    maxPeople: 10,
    location: "Đà Nẵng",
    duration: "1 Ngày",
    rating: 4.7,
    category: "nature",
    steps: [
      { time: "08:30", activity: "Thăm làng đá Non Nước", dist: "12km từ TT" },
      { time: "10:00", activity: "Leo núi Ngũ Hành Sơn", dist: "12km từ TT" },
    ],
  },
  {
    id: 5,
    title: "Chinh phục đỉnh Bàn Cờ",
    image: "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=800",
    price: 600000,
    maxPeople: 2,
    location: "Đà Nẵng",
    duration: "Half day",
    rating: 4.6,
    category: "adventure",
    steps: [
      { time: "05:00", activity: "Đón bình minh đỉnh Bàn Cờ", dist: "15km từ TT" },
      { time: "07:30", activity: "Ăn sáng cafe view biển", dist: "5km từ TT" },
    ],
  },
  {
    id: 6,
    title: "Lặn ngắm san hô Cù Lao Chàm",
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800",
    price: 1200000,
    maxPeople: 8,
    location: "Hội An",
    duration: "1 Ngày",
    rating: 4.8,
    category: "beach",
    steps: [
      { time: "08:00", activity: "Cano đi Cù Lao Chàm", dist: "45km từ TT" },
      { time: "10:30", activity: "Lặn ngắm san hô bãi Bắc", dist: "46km từ TT" },
    ],
  },
  {
    id: 7,
    title: "Camping Rừng Dừa Bảy Mẫu",
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=800",
    price: 950000,
    maxPeople: 15,
    location: "Hội An",
    duration: "2 Ngày 1 Đêm",
    rating: 4.5,
    category: "nature",
    steps: [
      { time: "14:00", activity: "Check-in lều trại", dist: "35km từ TT" },
      { time: "19:00", activity: "Tiệc BBQ ngoài trời", dist: "35km từ TT" },
    ],
  },
  {
    id: 8,
    title: "City Tour Đà Nẵng về đêm",
    image: "https://images.unsplash.com/photo-1599708153386-efdb71593ef0?q=80&w=800",
    price: 350000,
    maxPeople: 4,
    location: "Đà Nẵng",
    duration: "4 Tiếng",
    rating: 4.7,
    category: "culture",
    steps: [
      { time: "19:00", activity: "Ngắm Cầu Rồng phun lửa", dist: "0km từ TT" },
      { time: "21:00", activity: "Dạo Chợ đêm Sơn Trà", dist: "1km từ TT" },
    ],
  },
  {
    id: 9,
    title: "Yoga thiền tại rừng Sơn Trà",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800",
    price: 700000,
    maxPeople: 6,
    location: "Đà Nẵng",
    duration: "1 Ngày",
    rating: 4.9,
    category: "nature",
    steps: [
      { time: "06:00", activity: "Yoga đón bình minh", dist: "12km từ TT" },
      { time: "09:00", activity: "Thiền trà thảo mộc", dist: "12km từ TT" },
    ],
  },
  {
    id: 10,
    title: "Trekking Suối Mơ - Ba Na",
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=800",
    price: 550000,
    maxPeople: 12,
    location: "Đà Nẵng",
    duration: "1 Ngày",
    rating: 4.6,
    category: "adventure",
    steps: [
      { time: "07:30", activity: "Leo núi lội suối", dist: "25km từ TT" },
      { time: "12:00", activity: "Ăn trưa picnic bên suối", dist: "26km từ TT" },
    ],
  },
  {
    id: 11,
    title: "Tham quan Thánh địa Mỹ Sơn",
    image: "https://images.unsplash.com/photo-1590424600010-84518429661c?q=80&w=800",
    price: 1100000,
    maxPeople: 4,
    location: "Hội An",
    duration: "1 Ngày",
    rating: 4.8,
    category: "culture",
    steps: [
      { time: "08:30", activity: "Khám phá tháp cổ Chăm Pa", dist: "50km từ TT" },
      { time: "11:30", activity: "Thưởng thức múa Apsara", dist: "50km từ TT" },
    ],
  },
  {
    id: 12,
    title: "Tiệc tối lãng mạn ven biển",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?q=80&w=800",
    price: 3200000,
    maxPeople: 2,
    location: "Đà Nẵng",
    duration: "3 Tiếng",
    rating: 5.0,
    category: "beach",
    steps: [
      { time: "18:00", activity: "Đón hoàng hôn trên biển", dist: "2km từ TT" },
      { time: "19:30", activity: "Tiệc tối 5 sao private", dist: "2km từ TT" },
    ],
  },
];

const SampleItinerary: React.FC = () => {
  const [filters, setFilters] = useState<FilterState>({
    location: "all",
    priceRange: "all",
    people: 1,
  });

  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-quad",
    });
  }, []);

  const filteredData = useMemo(() => {
    return MOCK_ITINERARIES.filter((item) => {
      const matchLoc = filters.location === "all" || item.location === filters.location;
      const matchPeople = item.maxPeople >= filters.people;
      
      let matchPrice = true;
      if (filters.priceRange === "low") matchPrice = item.price < 600000;
      else if (filters.priceRange === "mid") matchPrice = item.price >= 600000 && item.price <= 1200000;
      else if (filters.priceRange === "high") matchPrice = item.price > 1200000;

      const matchCat = activeCategory === "all" || item.category === activeCategory;

      return matchLoc && matchPeople && matchPrice && matchCat;
    });
  }, [filters, activeCategory]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedData = filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    setCurrentPage(1);
  };

  return (
    <div className={styles.pageWrapper}>
      <ItineraryHero />
      <FilterSection filters={filters} onFilterChange={setFilters} />
      <main className={styles.mainContent}>
        <div className={styles.container}>
          <div data-aos="fade-up" data-aos-delay="200">
            <CategoryTabs 
              activeCategory={activeCategory} 
              onCategoryChange={handleCategoryChange} 
            />
          </div>

          <div className={styles.itineraryGrid}>
            {displayedData.length > 0 ? (
              displayedData.map((itinerary, index) => (
                <div key={itinerary.id} data-aos="fade-up" data-aos-delay={index * 100}>
                  <ItineraryCard data={itinerary} />
                </div>
              ))
            ) : (
              <div className={styles.noResults} data-aos="zoom-in">
                <p>😞 Không tìm thấy lộ trình phù hợp với tiêu chí của bạn.</p>
                <button
                  onClick={() => {
                    setFilters({ location: "all", priceRange: "all", people: 1 });
                    setActiveCategory("all");
                  }}
                  className={styles.resetBtn}
                >
                  Đặt lại tất cả bộ lọc
                </button>
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className={styles.paginationContainer} data-aos="fade-up">
              <button
                className={styles.pageNavBtn}
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                <CaretLeft size={18} weight="bold" /> Trước
              </button>
              
              <div className={styles.pageNumbers}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={`${styles.pageBtn} ${currentPage === page ? styles.activePage : ""}`}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                className={styles.pageNavBtn}
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                Sau <CaretRight size={18} weight="bold" />
              </button>
            </div>
          )}

          <AICustomCTA />
        </div>
      </main>
    </div>
  );
};

export default SampleItinerary;
