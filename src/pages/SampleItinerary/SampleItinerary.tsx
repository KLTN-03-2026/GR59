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
import { getSampleItineraries } from "../../services/itineraryService";


const SampleItinerary: React.FC = () => {
  const [itineraries, setItineraries] = useState<ItineraryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    location: "all",
    priceRange: "all",
    people: 1,
  });

  const [activeCategory, setActiveCategory] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const fetchItineraries = async () => {
      try {
        setIsLoading(true);
        const response = await getSampleItineraries();
        setItineraries(response.data.DT || response.data.data || []);
      } catch (err) {
        console.error("Lỗi khi lấy lộ trình mẫu:", err);
        setError("Không thể tải dữ liệu lộ trình. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchItineraries();
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-quad",
    });
  }, []);

  const filteredData = useMemo(() => {
    if (!itineraries) return [];
    return itineraries.filter((item) => {
      const matchLoc = filters.location === "all" || item.location === filters.location;
      const matchPeople = item.maxPeople >= filters.people;
      
      let matchPrice = true;
      if (filters.priceRange === "low") matchPrice = item.price < 600000;
      else if (filters.priceRange === "mid") matchPrice = item.price >= 600000 && item.price <= 1200000;
      else if (filters.priceRange === "high") matchPrice = item.price > 1200000;

      const matchCat = activeCategory === "all" || item.category === activeCategory;

      return matchLoc && matchPeople && matchPrice && matchCat;
    });
  }, [filters, activeCategory, itineraries]);

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

  const getPageNumbers = () => {
    const delta = 1;
    const range = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage > 1 + delta + 1) {
      range.unshift("...");
    }
    if (currentPage < totalPages - delta - 1) {
      range.push("...");
    }

    range.unshift(1);
    if (totalPages > 1) range.push(totalPages);

    return range;
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
            {isLoading ? (
              <div className={styles.loadingState}>
                <div className={styles.spinner}></div>
                <p>Đang tải dữ liệu lộ trình...</p>
              </div>
            ) : error ? (
              <div className={styles.errorState}>
                <p>{error}</p>
                <button onClick={() => window.location.reload()} className={styles.retryBtn}>Thử lại</button>
              </div>
            ) : displayedData.length > 0 ? (
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
                {getPageNumbers().map((pageNum, idx) => (
                  pageNum === "..." ? (
                    <span key={`dots-${idx}`} className={styles.paginationDots}>...</span>
                  ) : (
                    <button
                      key={idx}
                      className={`${styles.pageBtn} ${currentPage === pageNum ? styles.activePage : ""}`}
                      onClick={() => handlePageChange(pageNum as number)}
                    >
                      {pageNum}
                    </button>
                  )
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
