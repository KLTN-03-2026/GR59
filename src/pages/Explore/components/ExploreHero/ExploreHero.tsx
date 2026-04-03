import React from "react";
import styles from "./ExploreHero.module.scss";

const ExploreHero: React.FC = () => {
  return (
    <div className={styles.hero}>
      {/* Decorative floating shapes */}
      <div className={styles.bgShapes}>
        <div className={styles.shape1} />
        <div className={styles.shape2} />
        <div className={styles.shape3} />
      </div>

      <div className={styles.content}>
        <span className={styles.badge}>
          <span className={styles.badgeDot} />
          <span className={styles.badgeText}>Khám phá ngay</span>
        </span>

        <h1 className={styles.title}>
          Tìm kiếm <span className={styles.highlight}>địa điểm</span>
          <br />
          <p className={styles.highlightText}>du lịch tuyệt vời</p>
        </h1>

        <p className={styles.subtitle}>
          Khám phá những điểm đến ấn tượng nhất, được gợi ý thông minh dựa trên
          sở thích của riêng bạn
        </p>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>2,500+</span>
            <span className={styles.statLabel}>Địa điểm</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNumber}>15K+</span>
            <span className={styles.statLabel}>Đánh giá</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.statItem}>
            <span className={styles.statNumber}>98%</span>
            <span className={styles.statLabel}>Hài lòng</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreHero;
