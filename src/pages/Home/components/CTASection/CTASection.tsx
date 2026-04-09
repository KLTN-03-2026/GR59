import React from "react";
import { Link } from "react-router-dom";
import styles from "./CTA.module.scss"; // Tạm thời dùng chung file styles cũ của bạn

const CTASection: React.FC = () => {
  return (
    <section className={styles.ctaSection}>
      <div className={styles.container}>
        <div className={styles.ctaCard} data-aos="zoom-in">
          <h2>
            Sẵn sàng cho chuyến đi <br /> tiếp theo của bạn?
          </h2>
          <p>
            Tham gia cùng hàng ngàn người dùng đã tạo nên những kỷ niệm tuyệt
            vời.
          </p>
          <div className={styles.ctaButtons}>
            <Link
              to="/planner"
              className={`${styles.btn} ${styles.btnPrimary}`}
            >
              Bắt đầu ngay miễn phí
            </Link>
            <Link
              to="/explore"
              className={`${styles.btn} ${styles.btnSecondary}`}
            >
              Khám phá cộng đồng
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
