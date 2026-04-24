import React, { useEffect, useState, useCallback, useMemo } from "react";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import styles from "./Explore.module.scss";
import VideoHome from "../../assets/video/Da_Nang.mp4";
import { toast } from "react-toastify";

import ExploreHero from "./components/ExploreHero/ExploreHero";
import CategoryTabs from "./components/CategoryTabs/CategoryTabs";
import FilterBar from "./components/FilterBar/FilterBar";
import TravelCard from "./components/TravelCard/TravelCard";
import AIRecommendations from "./components/AIRecommendations/AIRecommendations";
import SkeletonCard from "../../components/Ui/SkeletonCard/SkeletonCard";

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
  addFavorite,
  removeFavorite,
  type SavedTrip,
} from "../../services/profileService";
import { getCache, setCache } from "../../utils/DataCache";

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
  const ITEMS_PER_PAGE = 9;

  // Cơ chế để xử lý Race Condition (Chạy đua dữ liệu)
  const lastRequestId = React.useRef(0);

  // 1. Xử lý Debounce cho ô tìm kiếm
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // 2. Lấy danh sách yêu thích một lần duy nhất khi vào trang
  useEffect(() => {
    const fetchSavedTrips = async () => {
      try {
        const savedRes = await getSavedTrips();
        if (savedRes.data?.data) setSavedTrips(savedRes.data.data);
      } catch (e) {
        console.warn("Lỗi tải saved trips:", e);
      }
    };
    fetchSavedTrips();
  }, []);

  // 3. Hàm fetch dữ liệu chính (Hotels, Restaurants, Attractions)
  const fetchPlaces = useCallback(async () => {
    const requestId = ++lastRequestId.current;
    const cacheKey = `explore-${activeCategory}-${debouncedSearch}-${filterProvince}`;
    const cachedData = getCache(cacheKey);

    // Nếu đã có trong cache, hiển thị ngay lập tức và thoát (không hiện loading)
    if (cachedData) {
      setPlaces(cachedData);
      setIsLoading(false);
      setError(null);
      return;
    }

    // Chỉ reset trạng thái và hiện loading khi KHÔNG có cache
    setIsLoading(true);
    setPlaces([]);
    setError(null);


    try {
      const isSearching = debouncedSearch.trim().length > 0;
      const limit = 10; 
      
      let hotelsRes, restaurantsRes, attractionsRes;
      
      if (activeCategory === "all") {
        // Tối ưu: lấy 10 mục mỗi loại cho tab Tổng hợp
        const allLimit = 10;
        [hotelsRes, restaurantsRes, attractionsRes] = await Promise.all([
          isSearching ? getHotelsByKeyword(debouncedSearch, 0, allLimit) : getHotels(0, allLimit, filterProvince),
          isSearching ? getHighlightRestaurantsByKeyword(debouncedSearch, 0, allLimit) : getHighlightRestaurants(allLimit, filterProvince),
          isSearching ? getHighlightAttractionsByKeyword(debouncedSearch, 0, allLimit) : getHighlightLocations(allLimit, filterProvince)
        ]);
      } else if (activeCategory === "bed") {
        hotelsRes = isSearching ? await getHotelsByKeyword(debouncedSearch, 0, limit) : await getHotels(0, limit, filterProvince);
      } else if (activeCategory === "food") {
        restaurantsRes = isSearching ? await getHighlightRestaurantsByKeyword(debouncedSearch, 0, limit) : await getHighlightRestaurants(limit, filterProvince);
      } else if (activeCategory === "pin") {
        attractionsRes = isSearching ? await getHighlightAttractionsByKeyword(debouncedSearch, 0, limit) : await getHighlightLocations(limit, filterProvince);
      }


      // Kiểm tra race condition
      if (requestId !== lastRequestId.current) return;

      let allItems: HighlightItem[] = [];
      if (hotelsRes?.data?.data) {
        const data = hotelsRes.data.data;
        const hContent = Array.isArray(data) ? data : (data as { content: HighlightItem[] }).content;
        if (Array.isArray(hContent)) allItems = [...allItems, ...hContent];
      }
      if (restaurantsRes?.data?.data) {
        const data = restaurantsRes.data.data;
        const rContent = Array.isArray(data) ? data : (data as { content: HighlightItem[] }).content;
        if (Array.isArray(rContent)) allItems = [...allItems, ...rContent];
      }
      if (attractionsRes?.data?.data) {
        const data = attractionsRes.data.data;
        const aContent = Array.isArray(data) ? data : (data as { content: HighlightItem[] }).content;
        if (Array.isArray(aContent)) allItems = [...allItems, ...aContent];
      }

      const uniqueItems = allItems
        .filter(item => {
          if (!item || !item.id) return false;
          const name = (item.name || "").trim();
          
          // Danh sách các tên cần loại bỏ (không có giá trị thực tế cho người dùng)
          const invalidNames = [
            "unknown attraction",
            "địa điểm tham quan",
            "be đang thiếu",
            "đang cập nhật",
            "null",
            "undefined"
          ];

          if (!name || invalidNames.some(invalid => name.toLowerCase().includes(invalid))) {
            return false;
          }
          
          return true;
        })
        .map(item => ({
          ...item,
          uniqueId: `${item.type || 'unknown'}-${item.id}`
        }));

      setCache(cacheKey, uniqueItems);

      if (activeCategory === "all" && !debouncedSearch) {
        const hotels = uniqueItems.filter(i => i.type === "bed");
        const foods = uniqueItems.filter(i => i.type === "food");
        const pins = uniqueItems.filter(i => i.type === "pin");
        if (hotels.length > 0) setCache("explore-bed-", hotels);
        if (foods.length > 0) setCache("explore-food-", foods);
        if (pins.length > 0) setCache("explore-pin-", pins);
      }

      setPlaces(uniqueItems);
    } catch (err) {
      if (requestId === lastRequestId.current) {
        console.error("Lỗi fetchPlaces:", err);
        setError("Không thể tải dữ liệu lúc này.");
      }
    } finally {
      if (requestId === lastRequestId.current) {
        setIsLoading(false);
      }
    }
  }, [debouncedSearch, activeCategory, filterProvince]);

  useEffect(() => {
    fetchPlaces();
  }, [fetchPlaces]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setFilterSubCategory("all");
    setCurrentPage(1);
  };

  const filteredData = useMemo(() => {
    return (places || [])
      .filter((item) => {
        const matchesMainCategory = activeCategory === "all" || item.type === activeCategory;
        const itemCategory = item.category?.toUpperCase() || "";
        const subCatUpper = filterSubCategory.toUpperCase();
        const matchesSubCategory = filterSubCategory === "all" || itemCategory.includes(subCatUpper);
        const itemProvinceId = item.provinceId?.toString() || "0";
        const matchesProvince = filterProvince === "all" || itemProvinceId === filterProvince;
        let matchesPrice = true;
        const itemPrice = Number(item.price) || 0;
        if (filterPriceRange === "budget") matchesPrice = itemPrice > 0 && itemPrice < 500000;
        else if (filterPriceRange === "mid") matchesPrice = itemPrice >= 500000 && itemPrice <= 2000000;
        else if (filterPriceRange === "luxury") matchesPrice = itemPrice > 2000000;
        return matchesMainCategory && matchesSubCategory && matchesProvince && matchesPrice;
      })
      .sort((a, b) => {
        if (sortBy === "rating") return (Number(b.rating) || 0) - (Number(a.rating) || 0);
        if (sortBy === "priceAsc") return (Number(a.price) || 0) - (Number(b.price) || 0);
        if (sortBy === "priceDesc") return (Number(b.price) || 0) - (Number(a.price) || 0);
        return 0;
      });
  }, [places, activeCategory, filterProvince, filterPriceRange, filterSubCategory, sortBy]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedData = useMemo(() => filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE), [filteredData, startIndex]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const range = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) range.push(i);
      else if (range[range.length - 1] !== "...") range.push("...");
    }
    return range;
  };

  const handleToggleLike = async (location: HighlightItem) => {
    const savedTrip = savedTrips.find((trip) => trip.locationId == location.id);
    const originalSavedTrips = [...savedTrips];
    
    // Map internal type to backend locationType
    const typeMap: Record<string, string> = {
      pin: "ATTRACTION",
      food: "RESTAURANT",
      bed: "HOTEL"
    };
    const locationType = typeMap[location.type] || "ATTRACTION";

    if (savedTrip) {
      // Optimistic UI: Remove from list
      setSavedTrips(savedTrips.filter((trip) => trip.locationId != location.id));
      try { 
        await removeFavorite(location.id, locationType); 
        toast.info(`Đã xóa khỏi danh sách yêu thích`);
        console.log(`Đã bỏ thích: ${location.name}`);
      } catch (err) { 
        console.error("Lỗi khi xóa yêu thích:", err);
        toast.error("Không thể xóa khỏi yêu thích");
        setSavedTrips(originalSavedTrips); 
      }
    } else {
      const favoriteData = {
        locationId: location.id,
        locationType: locationType,
        locationName: location.name,
        imageUrl: location.image,
        rating: Number(location.rating) || 0,
        address: location.location || "Đang cập nhật"
      };

      // Optimistic UI: Add to list (temp id)
      const tempTrip: SavedTrip = { 
        id: `temp-${Date.now()}`, 
        locationId: location.id,
        title: location.name, 
        image: location.image, 
        timeAgo: "Vừa xong" 
      };
      setSavedTrips([...savedTrips, tempTrip]);

      try { 
        const res = await addFavorite(favoriteData); 
        if (res.data?.data) {
          // Update temp ID with real ID from backend
          const realFavorite = res.data.data;
          setSavedTrips(prev => prev.map(t => t.locationId == location.id ? {
            ...t,
            id: realFavorite.id
          } : t));
          toast.success("Đã thêm vào danh sách yêu thích!");
          console.log(`Đã thích: ${location.name}`, realFavorite);
        }
      } catch (err) { 
        console.error("Lỗi khi thêm yêu thích:", err);
        toast.error("Không thể thêm vào yêu thích");
        setSavedTrips(originalSavedTrips); 
      }
    }
  };

  return (
    <div className={styles.explorePage}>
      <div data-aos="fade-down"><ExploreHero /></div>
      <main className={styles.mainContainer}>
        <div data-aos="fade-up" data-aos-delay="200" className={styles.filterWrapper}>
          <CategoryTabs activeCategory={activeCategory} onCategoryChange={handleCategoryChange} />
          <FilterBar
            searchTerm={searchTerm} activeTab={activeCategory} onSearchChange={handleSearchChange}
            onProvinceChange={(val) => { setFilterProvince(val); setCurrentPage(1); }}
            onCategoryChange={(val) => { setFilterSubCategory(val); setCurrentPage(1); }}
            onPriceRangeChange={(val) => { setFilterPriceRange(val); setCurrentPage(1); }}
            onSortChange={(val) => { setSortBy(val); setCurrentPage(1); }}
          />
        </div>
        <div className={styles.cardGrid}>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, i) => <div key={`skeleton-${i}`}><SkeletonCard /></div>)
          ) : error ? (
            <div className={styles.errorState}><p>{error}</p><button type="button" onClick={() => fetchPlaces()} className={styles.retryBtn}>Thử lại</button></div>
          ) : displayedData.length > 0 ? (
            displayedData.map((location, index) => (
              <div key={location.uniqueId || location.id} data-aos="fade-up" data-aos-delay={index * 50}>
                <TravelCard
                  image={location.image} title={location.name} rating={Number(location.rating)}
                  location={location.location} description={location.desc} isHot={location.isHot}
                  previewVideo={location.previewVideo || VideoHome} isLiked={savedTrips.some((t) => t.locationId == location.id)}
                  status={location.status} price={location.price} onToggleLike={() => handleToggleLike(location)}
                  onDetail={() => {
                    const path = location.type === 'bed' ? `/hotel/${location.id}` : location.type === 'food' ? `/restaurant/${location.id}` : `/attraction/${location.id}`;
                    window.location.href = path;
                  }}
                />
              </div>
            ))
          ) : (<div className={styles.noResults}><p>Không tìm thấy kết quả.</p></div>)}
        </div>
        {totalPages > 1 && (
          <div className={styles.paginationContainer} data-aos="fade-up">
            <button 
              type="button" 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1} 
              className={styles.pageNavBtn}
              title="Trang trước"
              aria-label="Trang trước"
            >
              <CaretLeft size={20} />
            </button>
            <div className={styles.pageNumbers}>
              {getPageNumbers().map((pageNum, idx) => pageNum === "..." ? <span key={idx}>...</span> : <button type="button" key={idx} onClick={() => handlePageChange(pageNum as number)} className={`${styles.pageBtn} ${currentPage === pageNum ? styles.activePage : ""}`}>{pageNum}</button>)}
            </div>
            <button 
              type="button" 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages} 
              className={styles.pageNavBtn}
              title="Trang tiếp theo"
              aria-label="Trang tiếp theo"
            >
              <CaretRight size={20} />
            </button>
          </div>
        )}
      </main>
      <div data-aos="fade-up" data-aos-delay="200"><AIRecommendations /></div>
    </div>
  );
};

export default Explore;
