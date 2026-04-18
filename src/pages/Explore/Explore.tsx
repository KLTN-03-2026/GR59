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
  getHighlightLocations, 
  getHighlightRestaurants, 
  getHighlightAttractionsByKeyword,
  getHighlightRestaurantsByKeyword,
  type HighlightItem 
} from "../../services/highlightService";
import { getHotels, getHotelsByKeyword } from "../../services/hotelService";
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
  const [filterSubCategory, setFilterSubCategory] = useState("all");
  const [sortBy, setSortBy] = useState("rating");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const ITEMS_PER_PAGE = 6;

  // Xử lý Debounce cho ô tìm kiếm
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchPlaces = async () => {
    setIsLoading(true);
    try {
      const isSearching = debouncedSearch.trim().length > 0;
      
      // Gọi đồng thời 3 API
      const [hotelsRes, restaurantsRes, attractionsRes] = await Promise.all([
        isSearching 
          ? getHotelsByKeyword(debouncedSearch, 0, 50) 
          : getHotels(0, 50),
        isSearching 
          ? getHighlightRestaurantsByKeyword(debouncedSearch, 0, 50) 
          : getHighlightRestaurants(),
        isSearching 
          ? getHighlightAttractionsByKeyword(debouncedSearch, 0, 50) 
          : getHighlightLocations()
      ]);

      let allItems: HighlightItem[] = [];

      // 1. Xử lý Khách sạn (An toàn)
      const hotelsData = hotelsRes.data?.data;
      if (hotelsData) {
        const hContent = Array.isArray(hotelsData) ? hotelsData : (hotelsData as any).content;
        if (Array.isArray(hContent)) allItems = [...allItems, ...hContent];
      }

      // 2. Xử lý Nhà hàng (An toàn)
      const restaurantsData = restaurantsRes.data?.data;
      if (restaurantsData) {
        const rContent = Array.isArray(restaurantsData) ? restaurantsData : (restaurantsData as any).content;
        if (Array.isArray(rContent)) allItems = [...allItems, ...rContent];
      }

      // 3. Xử lý Địa điểm (An toàn)
      const attractionsData = attractionsRes.data?.data;
      if (attractionsData) {
        const aContent = Array.isArray(attractionsData) ? attractionsData : (attractionsData as any).content;
        if (Array.isArray(aContent)) allItems = [...allItems, ...aContent];
      }

      // Đảm bảo ID duy nhất và loại bỏ item null
      const uniqueItems = allItems
        .filter(item => item && item.id)
        .map(item => ({
          ...item,
          uniqueId: `${item.type || 'unknown'}-${item.id}`
        }));

      setPlaces(uniqueItems);

      // Lấy danh sách yêu thích
      try {
        const savedRes = await getSavedTrips();
        if (savedRes.data?.data) setSavedTrips(savedRes.data.data);
      } catch (e) {
        console.warn("Lỗi tải saved trips:", e);
      }

    } catch (err) {
      console.error("Lỗi fetchPlaces:", err);
      setError("Không thể tìm kiếm lúc này. Vui lòng thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchPlaces();
    AOS.init({ duration: 800, once: true });
  }, [debouncedSearch]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setFilterSubCategory("all"); // Reset lọc chi tiết khi đổi tab chính
    setCurrentPage(1);
  };

  const filteredData = (places || [])
    .filter((item) => {
      // 1. Lọc theo danh mục chính (Tab: all, pin, bed, food)
      const matchesMainCategory =
        activeCategory === "all" || item.type === activeCategory;

      // 2. Lọc theo danh mục chi tiết (Dropdown)
      const itemCategory = item.category?.toUpperCase() || "";
      const subCatUpper = filterSubCategory.toUpperCase();
      
      const matchesSubCategory = 
        filterSubCategory === "all" || 
        itemCategory === subCatUpper ||
        itemCategory.includes(subCatUpper);

      // 3. Lọc theo khu vực (Province ID)
      const itemProvinceId = item.provinceId?.toString() || "0";
      const matchesProvince = 
        filterProvince === "all" || itemProvinceId === filterProvince;

      // 4. Lọc theo khoảng giá (Cần kiểm tra kỹ giá trị số)
      let matchesPrice = true;
      const itemPrice = Number(item.price) || 0;

      if (filterPriceRange === "budget") {
        matchesPrice = itemPrice > 0 && itemPrice < 500000;
      } else if (filterPriceRange === "mid") {
        matchesPrice = itemPrice >= 500000 && itemPrice <= 2000000;
      } else if (filterPriceRange === "luxury") {
        matchesPrice = itemPrice > 2000000;
      }

      // Lưu ý: matchesSearch đã được xử lý ở tầng API (fetchPlaces)
      return matchesMainCategory && matchesSubCategory && matchesProvince && matchesPrice;
    })
    .sort((a, b) => {
      // Sắp xếp dữ liệu dựa trên rating hoặc giá
      const ratingA = Number(a.rating) || 0;
      const ratingB = Number(b.rating) || 0;
      const priceA = Number(a.price) || 0;
      const priceB = Number(b.price) || 0;

      if (sortBy === "rating") return ratingB - ratingA;
      if (sortBy === "priceAsc") return priceA - priceB;
      if (sortBy === "priceDesc") return priceB - priceA;
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
        <div data-aos="fade-up" data-aos-delay="200" className={styles.filterWrapper}>
          <CategoryTabs
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
          />
          <FilterBar
            searchTerm={searchTerm}
            activeTab={activeCategory}
            onSearchChange={handleSearchChange}
            onProvinceChange={(val) => { setFilterProvince(val); setCurrentPage(1); }}
            onCategoryChange={(val) => { setFilterSubCategory(val); setCurrentPage(1); }}
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
                key={location.uniqueId || location.id}
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <TravelCard
                  image={location.image}
                  title={location.name}
                  rating={Number(location.rating)}
                  location={location.location}
                  description={location.desc}
                  isHot={location.isHot}
                  previewVideo={location.previewVideo || VideoHome}
                  isLiked={savedTrips.some((t) => t.id == location.id)}
                  status={location.status}
                  price={location.price}
                  onToggleLike={() => handleToggleLike(location)}
                  onDetail={() => {
                    const path = location.type === 'bed' 
                      ? `/hotel/${location.id}` 
                      : location.type === 'food' 
                        ? `/restaurant/${location.id}` 
                        : `/attraction/${location.id}`;
                    window.location.href = path;
                  }}
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
              className={styles.pageNavBtn}
              aria-label="Trang trước"
              title="Trang trước"
            >
              <CaretLeft size={20} />
            </button>
            <div className={styles.pageNumbers}>
              {getPageNumbers().map((pageNum, idx) => (
                pageNum === "..." ? (
                  <span key={`dots-${idx}`} className={styles.paginationDots}>...</span>
                ) : (
                  <button
                    key={idx}
                    onClick={() => handlePageChange(pageNum as number)}
                    className={`${styles.pageBtn} ${currentPage === pageNum ? styles.activePage : ""}`}
                  >
                    {pageNum}
                  </button>
                )
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
