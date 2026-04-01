import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import styles from "./Explore.module.scss";
import VideoHome from "../../assets/video/Da_Nang.mp4";

import ExploreHero from "./components/ExploreHero/ExploreHero";
import CategoryTabs from "./components/CategoryTabs/CategoryTabs";
import FilterBar from "./components/FilterBar/FilterBar";
import TravelCard from "./components/TravelCard/TravelCard";
import AIRecommendations from "./components/AIRecommendations/AIRecommendations";

import { getPlaces, type HighlightItem } from "../../services/highlightService";
import {
  getSavedTrips,
  addSavedTrip,
  removeSavedTrip,
  type SavedTrip,
} from "../../services/profileService";

const Explore: React.FC = () => {
  const [places, setPlaces] = useState<HighlightItem[]>([]);
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [placesRes, savedTripsRes] = await Promise.all([
          getPlaces(),
          getSavedTrips(),
        ]);
        setPlaces(placesRes.data.DT);
        setSavedTrips(savedTripsRes.data.DT || []);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu khám phá:", err);
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    AOS.init({
      duration: 800,
      once: true,
      easing: "ease-out-quad",
      delay: 100,
    });
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1); // Reset to first page when changing category
  };

  const filteredData = places.filter((item) => {
    const matchesCategory =
      activeCategory === "all"
        ? item.type !== "itinerary"
        : item.type === activeCategory;
    const matchesSearch = item.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedData = filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const handleToggleLike = async (location: HighlightItem) => {
    const savedTrip = savedTrips.find((trip) => trip.id == location.id);
    const originalSavedTrips = [...savedTrips];

    if (savedTrip) {
      // Optimistically remove
      setSavedTrips(savedTrips.filter((trip) => trip.id != location.id));
      try {
        await removeSavedTrip(savedTrip.id);
      } catch (error) {
        console.error("Lỗi khi bỏ lưu chuyến đi:", error);
        // Revert on error
        setSavedTrips(originalSavedTrips);
      }
    } else {
      const newTrip: SavedTrip = {
        id: location.id,
        title: location.title,
        image: location.img,
        timeAgo: "Vừa xong",
      };
      // Optimistically add
      setSavedTrips([...savedTrips, newTrip]);
      try {
        await addSavedTrip(newTrip);
      } catch (error) {
        console.error("Lỗi khi lưu chuyến đi:", error);
        // Revert on error
        setSavedTrips(originalSavedTrips);
      }
    }
  };

  return (
    <div className={styles.explorePage}>
      <div data-aos="fade-down">
        <ExploreHero />
      </div>

      <main className={styles.mainContainer}>
        <div data-aos="fade-up" data-aos-delay="200">
          <CategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
          <FilterBar
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
          />
        </div>

        <div className={styles.cardGrid}>
          {isLoading ? (
            <div className={styles.loadingState}>
              <div className={styles.spinner}></div>
              <p>Đang tải dữ liệu khám phá...</p>
            </div>
          ) : error ? (
            <div className={styles.errorState}>
              <p>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className={styles.retryBtn}
              >
                Thử lại
              </button>
            </div>
          ) : displayedData.length > 0 ? (
            displayedData.map((location, index) => (
              <div
                key={location.id}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <TravelCard
                  image={location.img}
                  title={location.title}
                  rating={Number(location.rating)}
                  distance="800km" // Giả định khoảng cách
                  description={location.desc}
                  isHot={location.isHot}
                  previewVideo={location.previewVideo || VideoHome}
                  isLiked={savedTrips.some((t) => t.id == location.id)}
                  onToggleLike={() => handleToggleLike(location)}
                />
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              <p>Không tìm thấy kết quả phù hợp với yêu cầu của bạn.</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className={styles.paginationContainer} data-aos="fade-up">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={styles.pageBtn}
              aria-label="Trang trước"
              title="Trang trước"
            >
              <CaretLeft size={20} />
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => handlePageChange(idx + 1)}
                className={`${styles.pageBtn} ${currentPage === idx + 1 ? styles.active : ""}`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={styles.pageBtn}
              aria-label="Trang tiếp theo"
              title="Trang tiếp theo"
            >
              <CaretRight size={20} />
            </button>
          </div>
        )}
      </main>

      <div data-aos="fade-up" data-aos-delay="200">
        <AIRecommendations />
      </div>
    </div>
  );
};

export default Explore;
