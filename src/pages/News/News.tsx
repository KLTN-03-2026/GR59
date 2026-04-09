import React, { useState, useEffect, useMemo } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import styles from "./News.module.scss";

import FeaturedPost from "./components/FeaturedPost/FeaturedPost";
import NewsCard from "./components/NewsCard/NewsCard";
import Newsletter from "./components/Newsletter/Newsletter";
import CategoryTabs from "./components/CategoryTabs/CategoryTabs";
import NewsSidebar from "./components/NewsSidebar/NewsSidebar";
import type { NewsItem } from "./types";

import { getNewsList } from "../../services/newsService";



const News: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [newsData, setNewsData] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const ITEMS_PER_PAGE = 6;
  const categories = [
    "Tất cả",
    "Điểm đến",
    "Ẩm thực",
    "Mẹo du lịch",
    "Sự kiện",
  ];

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-quad",
    });

    const fetchNews = async () => {
      setIsLoading(true);
      try {
        const res = await getNewsList();
        if (res.data && res.data.status === 200) {
          setNewsData(res.data.data);
        }
      } catch (error) {
        console.error("Lỗi khi tải tin tức:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const featured = useMemo(() => newsData.find((n) => n.isFeatured), [newsData]);
  
  const trendingNews = useMemo(() => 
    newsData.slice(0, 5) // Mock trending as first 5 items
  , [newsData]);

  const filteredNews = useMemo(() => {
    return newsData.filter((n) => {
      const matchesTab = activeTab === "Tất cả" || n.category === activeTab;
      const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           n.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return !n.isFeatured && matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery, newsData]);

  const totalPages = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedNews = filteredNews.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 500, behavior: "smooth" });
  };

  const handleTabChange = (cat: string) => {
    setActiveTab(cat);
    setCurrentPage(1);
  };

  return (
    <div className={styles.newsPage}>
      <header className={styles.pageHeader}>
        <div className={styles.container}>
          <h1 data-aos="fade-down">
            Tin tức & <span>Cảm hứng</span>
          </h1>
          <p data-aos="fade-up" data-aos-delay="200">
            Cập nhật những thông tin mới nhất và những câu chuyện thú vị về du
            lịch khắp thế giới.
          </p>
        </div>
      </header>

      {featured && (
        <div className={styles.featuredSection}>
          <div className={styles.container}>
            <FeaturedPost data={featured} />
          </div>
        </div>
      )}

      <div className={styles.contentSection}>
        <div className={styles.container}>
          <CategoryTabs 
            categories={categories} 
            activeCategory={activeTab} 
            onCategoryChange={handleTabChange} 
          />

          <div className={styles.layoutWrapper}>
            <main className={styles.mainGrid}>
              <div className={styles.grid}>
                {isLoading ? (
                  <div className={styles.loadingState}>
                    <p>Đang tải dữ liệu...</p>
                  </div>
                ) : displayedNews.length > 0 ? (
                  displayedNews.map((item, index) => (
                    <div
                      key={item.id}
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                    >
                      <NewsCard item={item} />
                    </div>
                  ))
                ) : (
                  <div className={styles.noResults} data-aos="zoom-in">
                    <p>😞 Không tìm thấy tin tức nào phù hợp.</p>
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
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          className={`${styles.pageBtn} ${
                            currentPage === page ? styles.activePage : ""
                          }`}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </button>
                      ),
                    )}
                  </div>

                  <button
                    className={styles.pageNavBtn}
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Sau <CaretRight size={18} weight="bold" />
                  </button>
                </div>
              )}
            </main>

            <NewsSidebar 
              trendingNews={trendingNews}
              categories={categories}
              activeCategory={activeTab}
              onCategoryChange={handleTabChange}
              onSearch={setSearchQuery}
            />
          </div>
        </div>
      </div>

      <Newsletter />
    </div>
  );
};

export default News;
