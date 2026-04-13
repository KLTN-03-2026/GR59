import React, { useState, useEffect } from "react";
import StarRating from "./component/StarRating";
import styles from "./Review.module.scss";
import { X, Camera, PaperPlaneTilt } from "@phosphor-icons/react";
import AOS from "aos";
import "aos/dist/aos.css"; // Đảm bảo đã import CSS của AOS
import { getReviews, postReview, type ReviewItem } from "../../services/reviewService";

const Review: React.FC = () => {
  // Khởi tạo AOS khi component mount
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true, // Hiệu ứng chỉ chạy 1 lần khi scroll qua
    });
  }, []);
  // --- States ---
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100&q=80",
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80",
    "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&q=80",
  ]);

  const [recentReviews, setRecentReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Lấy dữ liệu API lúc đầu
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const res = await getReviews();
        if (res.data && res.data.status === 200) {
          const fetchedData = res.data.data || res.data.DT;
          setRecentReviews(Array.isArray(fetchedData) ? fetchedData : []);
        }
      } catch (err) {
        console.error("Lỗi khi tải đánh giá:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReviews();
  }, []);

  // --- Handlers ---
  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Vui lòng chọn mức độ đánh giá sao!");
      return;
    }
    try {
      const res = await postReview({
        rating,
        comment,
        images: uploadedImages,
      });
      if (res.data && res.data.status === 201) {
        alert("Cảm ơn bạn đã gửi đánh giá! Ý kiến của bạn đã được ghi nhận.");
        setRating(0);
        setComment("");
        setUploadedImages([]);
      }
    } catch (err) {
      console.error("Lỗi khi gửi đánh giá:", err);
      alert("Đã xảy ra lỗi khi gửi đánh giá. Vui lòng thử lại!");
    }
  };

  return (
    <main className={`container ${styles.reviewMain}`}>
      {/* 1. Header Section - Hiệu ứng Fade Down */}
      <section className={styles.reviewIntro} data-aos="fade-down">
        <h1 className={styles.reviewTitle}>Chia sẻ trải nghiệm của bạn</h1>
        <p className={styles.reviewSubtitle}>
          Ý kiến của bạn giúp chúng tôi hoàn thiện hành trình cho mọi người.
        </p>
      </section>

      <div className={styles.reviewLayout}>
        {/* 2. Left Panel - Hiệu ứng Fade Right (từ trái sang) */}
        <aside
          className={styles.reviewStatsCard}
          data-aos="fade-right"
          data-aos-delay="200"
        >
          <h3>Mức độ hài lòng</h3>
          <div className={styles.overallRating}>
            <span className={styles.ratingValue}>4.8</span>
            <div className={styles.starsDisplay}>
              <StarRating initialRating={5} isEditable={false} />
            </div>
          </div>
          <p className={styles.ratingSub}>Dựa trên 1,240 đánh giá</p>

          <div className={styles.metricBars}>
            <MetricBar label="Lịch trình tối ưu" percent={95} delay={300} />
            <MetricBar label="Giá cả hợp lý" percent={88} delay={400} />
            <MetricBar
              label="Độ chính xác thông tin"
              percent={92}
              delay={500}
            />
          </div>

          <div
            className={styles.thankYouBox}
            data-aos="zoom-in"
            data-aos-delay="600"
          >
            <h4>Cảm ơn bạn!</h4>
            <p>
              Mỗi phản hồi là một món quà giúp chúng tôi nỗ lực hơn mỗi ngày.
            </p>
          </div>
        </aside>

        {/* 3. Right Panel - Hiệu ứng Fade Left (từ phải sang) */}
        <section
          className={styles.feedbackFormCard}
          data-aos="fade-left"
          data-aos-delay="400"
        >
          {/* ... Các form group giữ nguyên ... */}
          <div className={styles.formGroup}>
            <h4>Bạn đánh giá thế nào về trải nghiệm này?</h4>
            <StarRating onChange={(val) => setRating(val)} />
          </div>

          <div className={styles.formGroup}>
            <h4>Chi tiết phản hồi</h4>
            <textarea
              placeholder="Hãy cho chúng tôi biết điều gì bạn thích hoặc cần cải thiện..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          {/* ... Phần Upload ảnh giữ nguyên ... */}
          <div className={styles.formGroup}>
            <h4>Thêm hình ảnh</h4>
            <div className={styles.uploadGrid}>
              <label className={styles.uploadBtn}>
                <Camera size={24} weight="bold" />
                <span>Tải ảnh lên</span>
                <input type="file" hidden multiple accept="image/*" />
              </label>

              {uploadedImages.map((img, index) => (
                <div
                  key={index}
                  className={styles.uploadThumb}
                  data-aos="zoom-in"
                >
                  <img src={img} alt={`Thumb ${index}`} />
                  <button
                    className={styles.btnRemoveImg}
                    onClick={() => handleRemoveImage(index)}
                  >
                    <div className={styles.btnIcon}>
                      <X size={10} weight="bold" />
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.formActions}>
            <button className={styles.btnSubmitReview} onClick={handleSubmit}>
              <PaperPlaneTilt size={16} weight="bold" /> Gửi đánh giá
            </button>
            <button
              className={styles.btnCancelReview}
              onClick={() => window.history.back()}
            >
              Hủy bỏ
            </button>
          </div>
        </section>
      </div>

      {/* 4. Recent Reviews Section - Hiệu ứng Fade Up từng card */}
      <section className={styles.recentReviewsSection}>
        <h2 className={styles.sectionTitle} data-aos="fade-up">
          Đánh giá gần đây
        </h2>
        <div className={styles.reviewsGrid}>
          {(Array.isArray(recentReviews) ? recentReviews : []).map((review, index) => (
            <div
              key={review.id}
              className={styles.reviewUserCard}
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className={styles.userRow}>
                <div className={styles.userMeta}>
                  <img src={review.avatar} alt={review.userName} />
                  <div className={styles.info}>
                    <strong>{review.userName}</strong>
                    <span>{review.timeAgo}</span>
                  </div>
                </div>
                <div className={styles.starsFixed}>
                  <StarRating
                    initialRating={review.rating}
                    isEditable={false}
                  />
                </div>
              </div>
              <p className={styles.reviewText}>"{review.comment}"</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

// Cập nhật Sub-component MetricBar để nhận delay
const MetricBar: React.FC<{
  label: string;
  percent: number;
  delay?: number;
}> = ({ label, percent, delay }) => (
  <div className={styles.metric} data-aos="fade-right" data-aos-delay={delay}>
    <div className={styles.metricLabel}>
      <span>{label}</span> <span>{percent}%</span>
    </div>
    <div className={styles.progressBg}>
      <div
        className={styles.progressFill}
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  </div>
);

export default Review;
