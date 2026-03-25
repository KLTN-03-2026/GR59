import React, { useState, useEffect, useMemo } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { CaretLeft, CaretRight } from "@phosphor-icons/react";
import styles from "./News.module.scss";
import { dragonBridge } from "../../assets/images/img";
import FeaturedPost from "./components/FeaturedPost/FeaturedPost";
import NewsCard from "./components/NewsCard/NewsCard";
import Newsletter from "./components/Newsletter/Newsletter";
import CategoryTabs from "./components/CategoryTabs/CategoryTabs";
import NewsSidebar from "./components/NewsSidebar/NewsSidebar";
import type { NewsItem } from "./types";

const MOCK_NEWS: NewsItem[] = [
  {
    id: 1,
    title: "Hội An Lọt Top Những Điểm Đến Lãng Mạn Nhất Thế Giới 2024",
    excerpt:
      "Khám phá vẻ đẹp cổ kính và lung linh của phố Hội qua góc nhìn mới rực rỡ dưới ánh đèn lồng...",
    image: dragonBridge,
    category: "Điểm đến",
    date: "15 Th03, 2024",
    readTime: "5 phút đọc",
    isFeatured: true,
  },
  {
    id: 2,
    title: "10 Món Ăn Đường Phố Phải Thử Khi Đến Bangkok",
    excerpt:
      "Trải nghiệm tinh hoa ẩm thực Thái Lan qua những gian hàng rực rỡ màu sắc và hương vị khó quên...",
    image:
      "https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=800",
    category: "Ẩm thực",
    date: "10 Th03, 2024",
    readTime: "6 phút đọc",
  },
  {
    id: 3,
    title: "Bí kíp săn vé máy bay giá rẻ mùa cao điểm 2024",
    excerpt:
      "Đừng để chi phí vé máy bay làm cản trở chuyến đi của bạn. Hãy áp dụng ngay 5 mẹo nhỏ này...",
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109c0f3?q=80&w=800",
    category: "Mẹo du lịch",
    date: "08 Th03, 2024",
    readTime: "4 phút đọc",
  },
  {
    id: 4,
    title: "Lễ hội khinh khí cầu quốc tế tại Đà Nẵng có gì hot?",
    excerpt:
      "Cùng chiêm ngưỡng màn trình diễn ánh sáng và màu sắc tuyệt vời trên bầu trời Đà Nẵng tháng 4 này...",
    image:
      "https://images.unsplash.com/photo-1507608830114-70fbc6f5a322?q=80&w=800",
    category: "Sự kiện",
    date: "05 Th03, 2024",
    readTime: "7 phút đọc",
  },
  {
    id: 5,
    title: "Top 5 homestay view biển cực chill ở Phú Quốc",
    excerpt:
      "Bạn đang tìm kiếm một nơi nghỉ dưỡng yên tĩnh và có góc chụp hình sống ảo? Đây là danh sách dành cho bạn...",
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800",
    category: "Điểm đến",
    date: "01 Th03, 2024",
    readTime: "5 phút đọc",
  },
  {
    id: 6,
    title: "Hành trình chinh phục Fansipan bằng đường bộ",
    excerpt:
      "Một trải nghiệm đầy thử thách nhưng vô cùng xứng đáng cho những ai yêu thích leo núi khám phá...",
    image:
      "https://images.unsplash.com/photo-1504457047772-27fad17438e2?q=80&w=800",
    category: "Mẹo du lịch",
    date: "28 Th02, 2024",
    readTime: "10 phút đọc",
  },
  {
    id: 7,
    title: "Cà phê muối - Nét độc đáo của ẩm thực Huế",
    excerpt:
      "Vị mặn của muối hòa quyện cùng vị đắng của cà phê tạo nên một hương vị khó quên cho du khách khi đến cố đô...",
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800",
    category: "Ẩm thực",
    date: "25 Th02, 2024",
    readTime: "3 phút đọc",
  },
  {
    id: 8,
    title: "Flycam: Toàn cảnh vịnh Hạ Long từ trên cao",
    excerpt:
      "Những thước phim tuyệt đẹp khoe trọn vẻ hùng vĩ của một trong những kỳ quan thiên nhiên thế giới...",
    image:
      "https://images.unsplash.com/photo-1559592442-7e18ad73d631?q=80&w=800",
    category: "Điểm đến",
    date: "20 Th02, 2024",
    readTime: "5 phút đọc",
  },
  {
    id: 9,
    title: "Du lịch Nhật Bản mùa hoa anh đào: Kinh nghiệm từ A-Z",
    excerpt:
      "Tất cả những gì bạn cần biết để có một chuyến thưởng hoa trọn vẹn tại xứ sở mặt trời mọc...",
    image:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800",
    category: "Mẹo du lịch",
    date: "15 Th02, 2024",
    readTime: "12 phút đọc",
  },
  {
    id: 10,
    title: "Khai mạc tuần lễ văn hóa dân gian tại Sa Pa",
    excerpt:
      "Nhiều hoạt động văn hóa đặc sắc của các dân tộc thiểu số sẽ được tái hiện chân thực tại thị trấn mờ sương...",
    image:
      "https://images.unsplash.com/photo-1534073828943-f801091bb18c?q=80&w=800",
    category: "Sự kiện",
    date: "10 Th02, 2024",
    readTime: "6 phút đọc",
  },
];

const News: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
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
  }, []);

  const featured = useMemo(() => MOCK_NEWS.find((n) => n.isFeatured), []);
  
  const trendingNews = useMemo(() => 
    MOCK_NEWS.slice(0, 5) // Mock trending as first 5 items
  , []);

  const filteredNews = useMemo(() => {
    return MOCK_NEWS.filter((n) => {
      const matchesTab = activeTab === "Tất cả" || n.category === activeTab;
      const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           n.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return !n.isFeatured && matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

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
                {displayedNews.length > 0 ? (
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
