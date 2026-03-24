import React from "react";
import { Star } from "phosphor-react";
import styles from "./Testimonials.module.scss"; // Tạm thời dùng chung file styles cũ của bạn

const Testimonials: React.FC = () => {
  const reviews = [
    { name: "Hoàng Linh", role: "Travel Blogger", initial: "HL", color: styles.bgBlue, text: "Ứng dụng thực sự kì diệu! Chỉ mất 2 phút để lên xong toàn bộ lịch trình 5 ngày.", delay: "100" },
    { name: "Minh Anh", role: "Doanh nhân", initial: "MA", color: styles.bgGreen, text: "Lộ trình được sắp xếp rất logic. Quán ăn AI gợi ý rất ngon và rẻ.", delay: "300" },
    { name: "Tuấn Việt", role: "Sinh viên", initial: "TV", color: styles.bgPurple, text: "Tính năng bản đồ kéo thả hoạt động cực mượt. Có thêm cảnh báo thời tiết là điểm cộng!", delay: "500" }
  ];

  return (
    <section className={styles.testimonials}>
      <div className={styles.container}>
        <div data-aos="fade-up">
          <h2 className={styles.sectionTitle}>
            Khách hàng <span className={styles.gradientText}>Nói gì?</span>
          </h2>
          <p className={styles.sectionDescription}>
            Hàng ngàn chuyến đi thành công đã được lên kế hoạch một cách hoàn hảo.
          </p>
        </div>

        <div className={styles.testimonialsGrid}>
          {reviews.map((rev, idx) => (
            <div key={idx} className={styles.testimonialCard} data-aos="fade-up" data-aos-delay={rev.delay}>
              <div className={styles.stars}>
                {[...Array(5)].map((_, i) => <Star key={i} weight="fill" />)}
              </div>
              <p className={styles.reviewText}>"{rev.text}"</p>
              <div className={styles.userInfo}>
                <div className={`${styles.avatar} ${rev.color}`}>{rev.initial}</div>
                <div>
                  <h4>{rev.name}</h4>
                  <span>{rev.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;