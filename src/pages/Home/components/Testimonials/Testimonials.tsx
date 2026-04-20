import React, { useState, useEffect } from "react";
import { Star, MapPin } from "phosphor-react";
import styles from "./Testimonials.module.scss";
import Marquee from "../../../../components/Ui/Marquee/Marquee";
import {
  getTestimonials,
  type TestimonialItem,
} from "../../../../services/testimonialService";

const Testimonials: React.FC = () => {
  const [reviews, setReviews] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Lấy nhiều đánh giá hơn để chạy marquee mượt hơn (ví dụ 20 cái)
      const res = await getTestimonials(0, 20);
      if (res && res.data && res.data.status === 200) {
        const paginatedData = res.data.data;
        if (paginatedData) {
          setReviews(paginatedData.content || []);
        }
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const firstColumn = reviews.slice(0, Math.ceil(reviews.length / 2));
  const secondColumn = reviews.slice(Math.ceil(reviews.length / 2));

  const TestimonialCard = ({ rev }: { rev: TestimonialItem }) => (
    <div className={styles.testimonialCard}>
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
  );

  return (
    <section className={styles.testimonials} id="testimonials-section">
      <div className={styles.container}>
        <div data-aos="fade-up">
          <h2 className={styles.sectionTitle}>
            Khách hàng <span className={styles.gradientText}>Nói gì?</span>
          </h2>
          <p className={styles.sectionDescription}>
            Hàng ngàn chuyến đi thành công đã được lên kế hoạch một cách hoàn hảo.
          </p>
        </div>

        <div className={styles.marqueeWrapper}>
          {loading ? (
            <div className={styles.loadingWrapper}>
              <div className={styles.loadingSpinner}></div>
              <span>Đang tải đánh giá...</span>
            </div>
          ) : reviews.length > 0 ? (
            <div className={styles.marqueeContent}>
              <Marquee pauseOnHover duration="40s" className={styles.marqueeRow}>
                {firstColumn.map((rev) => (
                  <TestimonialCard key={rev.id} rev={rev} />
                ))}
              </Marquee>
              <Marquee reverse pauseOnHover duration="45s" className={styles.marqueeRow}>
                {secondColumn.map((rev) => (
                  <TestimonialCard key={rev.id} rev={rev} />
                ))}
              </Marquee>
              
              {/* Fade gradients - Left and Right */}
              <div className={styles.fadeLeft}></div>
              <div className={styles.fadeRight}></div>
            </div>
          ) : (
            <div className={styles.noResults}>
              Chưa có đánh giá nào từ hệ thống.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
