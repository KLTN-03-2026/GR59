import React from "react";
import { Star, StarHalf } from "@phosphor-icons/react";
import styles from "./ReviewsTab.module.scss";
import type { Destination } from "../../DestinationDetail";

interface ReviewsTabProps {
  reviews: Destination["reviewsData"];
}

const ReviewsTab: React.FC<ReviewsTabProps> = ({ reviews }) => {
  return (
    <div className={styles.reviewsContainer} data-aos="fade-up">
      <div className={styles.reviewBtn}>
        <span>Đánh giá từ cộng đồng</span>

        <button
          className={styles.btn}
          onClick={() => alert("đang phát triển ở trang reviewTab")}
        >
          Đánh giá ngay
        </button>
      </div>
      <div className={styles.ratingSummary}>
        <div className={styles.scoreBig}>
          <h2>{reviews.average}</h2>
          <div className={styles.starsRow}>
            {/* Render sao tùy vào reviews.average */}
            <Star weight="fill" color="#f59e0b" size={18} />
            <Star weight="fill" color="#f59e0b" size={18} />
            <Star weight="fill" color="#f59e0b" size={18} />
            <Star weight="fill" color="#f59e0b" size={18} />
            <StarHalf weight="fill" color="#f59e0b" size={18} />
          </div>
          <p>{reviews.total} đánh giá</p>
        </div>

        <div className={styles.ratingBars}>
          {reviews.breakdown.map(
            (item: { stars: number; percentage: number }) => (
              <div key={item.stars} className={styles.barRow}>
                <span>{item.stars} sao</span>
                <div className={styles.barContainer}>
                  <div
                    className={styles.barFill}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
                <span className={styles.percentText}>{item.percentage}%</span>
              </div>
            ),
          )}
        </div>
      </div>

      <div className={styles.reviewsList}>
        {reviews.list.map(
          (rev: Destination["reviewsData"]["list"][0], idx: number) => (
            <div key={idx} className={styles.reviewItem}>
              <div className={styles.reviewerHeader}>
                <img src={rev.avatar} className={styles.avatar} alt="" />
                <div className={styles.reviewerInfo}>
                  <h4>{rev.user}</h4>
                  <div className={styles.revMeta}>
                    <div className={styles.miniStars}>
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} weight="fill" />
                      ))}
                    </div>
                    <span>{rev.date}</span>
                    <span className={styles.tag}>{rev.tag}</span>
                  </div>
                </div>
              </div>
              <p className={styles.revContent}>{rev.content}</p>
              {rev.images && (
                <div className={styles.revGallery}>
                  {rev.images.map((img: string, i: number) => (
                    <img key={i} src={img} alt="" />
                  ))}
                </div>
              )}
            </div>
          ),
        )}
      </div>
      <button
        className={styles.btnLoadMore}
        onClick={() => alert("đang phát triển ở trang reviewTab")}
      >
        Xem thêm {reviews.total - 2} đánh giá
      </button>
    </div>
  );
};

export default ReviewsTab;
