import React, { useState, useEffect } from "react";
import { Star, CaretLeft, CaretRight, MapPin } from "phosphor-react";
import styles from "./Testimonials.module.scss";
import {
  getTestimonials,
  type TestimonialItem,
} from "../../../../services/testimonialService";

const Testimonials: React.FC = () => {
  const [reviews, setReviews] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  const fetchData = async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await getTestimonials(pageNum, 6);
      if (res && res.data && res.data.status === 200) {
        const paginatedData = res.data.data;
        if (paginatedData) {
          setReviews(paginatedData.content || []);
          if (paginatedData.page) {
            setTotalPages(paginatedData.page.totalPages);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
    // Scroll lên đầu vùng testimonials khi đổi trang cho đẹp
    const element = document.getElementById("testimonials-section");
    if (element && page > 0) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }, [page]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  if (loading && reviews.length === 0) {
    return (
      <section className={styles.testimonials} id="testimonials-section">
        <div className={styles.container}>
          <div style={{ padding: "40px", color: "#33d7d1" }}>
            <div className={styles.loadingSpinner} style={{ margin: "0 auto 10px" }}></div>
            Đang tải đánh giá...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.testimonials} id="testimonials-section">
      <div className={styles.container}>
        <div data-aos="fade-up">
          <h2 className={styles.sectionTitle}>
            Khách hàng <span className={styles.gradientText}>Nói gì?</span>
          </h2>
          <p className={styles.sectionDescription}>
            Hàng ngàn chuyến đi thành công đã được lên kế hoạch một cách hoàn
            hảo.
          </p>
        </div>

        <div className={styles.testimonialsGrid} style={{ opacity: loading ? 0.6 : 1, transition: "opacity 0.3s" }}>
          {reviews.length > 0 ? (
            reviews.map((rev, idx) => (
              <div
                key={rev.id || idx}
                className={styles.testimonialCard}
                data-aos="fade-up"
                data-aos-delay={rev.delay}
              >
                <div className={styles.serviceTag}>
                  <span className={styles.serviceName}>
                    {rev.nameService || "Travel AI Service"}
                  </span>
                  {rev.provinceName && (
                    <span className={styles.location}>
                      <MapPin size={10} weight="fill" />
                      {rev.provinceName}
                    </span>
                  )}
                </div>

                <div className={styles.stars}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} weight="fill" />
                  ))}
                </div>
                <p className={styles.reviewText}>"{rev.text}"</p>
                <div className={styles.userInfo}>
                  <div
                    className={`${styles.avatar} ${
                      styles[rev.color as keyof typeof styles] || ""
                    }`}
                  >
                    {rev.avatarUrl ? (
                      <img 
                        src={rev.avatarUrl} 
                        alt={rev.name} 
                        loading="lazy"
                        style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : null}
                    <span style={{ display: rev.avatarUrl ? 'none' : 'block' }}>{rev.initial}</span>
                  </div>
                  <div className={styles.userText}>
                    <h4>{rev.name}</h4>
                    <div className={styles.userMeta}>
                      <span className={styles.role}>{rev.role}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: "span 3", padding: "20px" }}>
              Chưa có đánh giá nào từ hệ thống.
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button 
              className={`${styles.pageBtn} ${styles.navBtn}`}
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 0 || loading}
            >
              <CaretLeft size={18} weight="bold" />
              Trước
            </button>
            
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                className={`${styles.pageBtn} ${page === index ? styles.active : ""}`}
                onClick={() => handlePageChange(index)}
                disabled={loading}
              >
                {index + 1}
              </button>
            ))}

            <button 
              className={`${styles.pageBtn} ${styles.navBtn}`}
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages - 1 || loading}
            >
              Sau
              <CaretRight size={18} weight="bold" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
