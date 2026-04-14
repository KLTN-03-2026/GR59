import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

import { 
  getAttractions, 
  getHighlightRestaurants,
  type HighlightItem 
} from "../../services/highlightService";
import { getHotels } from "../../services/hotelService";
import { getRestaurants } from "../../services/restaurantService";
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
  const [filterProvince, setFilterProvince] = useState("all");
  const [filterPriceRange, setFilterPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const ITEMS_PER_PAGE = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Gọi đồng thời 3 API để tối ưu tốc độ
        const [attractionsRes, hotelsRes, restaurantsRes] = await Promise.all([
          getAttractions(0, 100), // Tăng số lượng để lọc mượt hơn
          getHotels(0, 100),
          getRestaurants(0, 100)
        ]);

        let allItems: HighlightItem[] = [];

        // 1. Xử lý Địa điểm (Atractions)
        if (attractionsRes.data && attractionsRes.data.data && attractionsRes.data.data.content) {
          allItems = [...allItems, ...attractionsRes.data.data.content];
        }

        // 2. Xử lý Khách sạn (Hotels)
        if (hotelsRes.data && hotelsRes.data.data && hotelsRes.data.data.content) {
          allItems = [...allItems, ...hotelsRes.data.data.content];
        }

        // 3. Xử lý Nhà hàng (Restaurants)
        if (restaurantsRes.data && restaurantsRes.data.data && restaurantsRes.data.data.content) {
          allItems = [...allItems, ...restaurantsRes.data.data.content];
        }

        setPlaces(allItems);

        // 4. Lấy danh sách đã lưu
        try {
          const savedTripsRes = await getSavedTrips();
          if (savedTripsRes.data && savedTripsRes.data.data) {
            setSavedTrips(savedTripsRes.data.data);
          }
        } catch (err) {
          console.warn("Lỗi API saved-trips:", err);
        }

      } catch (err: any) {
        console.error("Lỗi tổng quát khi tải dữ liệu khám phá:", err);
        setError("Không thể tải dữ liệu từ Backend. Vui lòng kiểm tra kết nối.");
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
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1);
  };

  const filteredData = (places || [])
    .filter((item) => {
      // 1. Lọc theo danh mục chính (Tab)
      const matchesCategory =
        activeCategory === "all"
          ? true
          : item.type === activeCategory;

      // 2. Lọc theo từ khóa tìm kiếm
      const matchesSearch = item.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      // 3. Lọc theo khu vực (Province)
      const matchesProvince = 
        filterProvince === "all" 
          ? true 
          : item.provinceId.toString() === filterProvince;

      // 4. Lọc theo khoảng giá
      let matchesPrice = true;
      if (filterPriceRange === "budget") matchesPrice = item.price < 500000;
      else if (filterPriceRange === "mid") matchesPrice = item.price >= 500000 && item.price <= 2000000;
      else if (filterPriceRange === "luxury") matchesPrice = item.price > 2000000;

      return matchesCategory && matchesSearch && matchesProvince && matchesPrice;
    })
    .sort((a, b) => {
      // Sắp xếp dữ liệu
      if (sortBy === "rating") return Number(b.rating) - Number(a.rating);
      if (sortBy === "priceAsc") return a.price - b.price;
      if (sortBy === "priceDesc") return b.price - a.price;
      return 0;
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
        title: location.name,
        image: location.image,
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
            onProvinceChange={(val) => { setFilterProvince(val); setCurrentPage(1); }}
            onPriceRangeChange={(val) => { setFilterPriceRange(val); setCurrentPage(1); }}
            onSortChange={(val) => { setSortBy(val); setCurrentPage(1); }}
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
                <Link 
                  to={
                    location.type === 'bed' 
                      ? `/hotel/${location.id}` 
                      : location.type === 'food' 
                        ? `/restaurant/${location.id}` 
                        : `/attraction/${location.id}`
                  }
                  style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                >
                  <TravelCard
                    image={location.image}
                    title={location.name}
                    rating={Number(location.rating)}
                    description={location.desc}
                    isHot={location.isHot}
                    previewVideo={location.previewVideo || VideoHome}
                    isLiked={savedTrips.some((t) => t.id == location.id)}
                    onToggleLike={() => handleToggleLike(location)}
                  />
                </Link>
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
              className={styles.pageNavBtn}
              aria-label="Trang trước"
              title="Trang trước"
            >
              <CaretLeft size={20} />
            </button>
            <div className={styles.pageNumbers}>
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePageChange(idx + 1)}
                  className={`${styles.pageBtn} ${currentPage === idx + 1 ? styles.activePage : ""}`}
                >
                  {idx + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={styles.pageNavBtn}
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
