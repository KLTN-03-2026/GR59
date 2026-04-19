import React, { useState, useEffect } from "react";
import { Star } from "phosphor-react";
import styles from "./Testimonials.module.scss";
import {
  getTestimonials,
  type TestimonialItem,
} from "../../../../services/testimonialService";

const Testimonials: React.FC = () => {
  const [reviews, setReviews] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getTestimonials();
        if (res && res.data && res.data.EC === 0) {
          setReviews(res.data.DT!);
        }
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <section className={styles.testimonials}>
        <div className={styles.container}>
          <div style={{ padding: "40px", color: "#33d7d1" }}>
            Đang tải đánh giá...
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={styles.testimonials}>
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

        <div className={styles.testimonialsGrid}>
          {reviews.length > 0 ? (
            reviews.map((rev, idx) => (
              <div
                key={rev.id || idx}
                className={styles.testimonialCard}
                data-aos="fade-up"
                data-aos-delay={rev.delay}
              >
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
                    {rev.initial}
                  </div>
                  <div>
                    <h4>{rev.name}</h4>
                    <span>{rev.role}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: "span 3", padding: "20px" }}>
              Chưa có đánh giá nào.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
