import React, { useState, useEffect } from "react";
import StarRating from "./component/StarRating";
import styles from "./Review.module.scss";
import { X, Camera, PaperPlaneTilt } from "@phosphor-icons/react";
import AOS from "aos";
import "aos/dist/aos.css";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getReviews,
  createReview,
  type ReviewItem,
} from "../../services/reviewService";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

const Review: React.FC = () => {
  // Khởi tạo AOS khi component mount
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true, // Hiệu ứng chỉ chạy 1 lần khi scroll qua
    });
  }, []);
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as {
    targetId?: string;
    targetType?: "HOTEL" | "RESTAURANT" | "ATTRACTION";
  } | null;

  // --- States ---
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);

  const [recentReviews, setRecentReviews] = useState<ReviewItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Lấy dữ liệu API lúc đầu
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setIsLoading(true);
        const res = await getReviews();
        if (res.data && res.data.status === 200) {
          const fetchedData = res.data.data;
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setSelectedFiles((prev) => [...prev, ...files]);

      const newPreviews = files.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.warn("Vui lòng chọn mức độ đánh giá sao!");
      return;
    }
    if (!comment.trim()) {
      toast.warn("Vui lòng nhập nội dung đánh giá!");
      return;
    }

    try {
      // Lấy thông tin User từ localStorage
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        toast.error("Vui lòng đăng nhập để gửi đánh giá!");
        navigate("/auth?mode=login");
        return;
      }
      const user = JSON.parse(userStr) as { id: number };

      const payload = {
        userId: user.id,
        rating,
        comment,
        type: state?.targetType || "ATTRACTION",
        hotelId: state?.targetType === "HOTEL" ? Number(state.targetId) : null,
        restaurantId:
          state?.targetType === "RESTAURANT" ? Number(state.targetId) : null,
        attractionId:
          state?.targetType === "ATTRACTION" ? Number(state.targetId) : null,
      };

      const res = await createReview(payload, selectedFiles);

      if (res.data && (res.data.status === 201 || res.data.status === 200)) {
        toast.success("Cảm ơn bạn đã gửi đánh giá!");
        setRating(0);
        setComment("");
        setSelectedFiles([]);
        setPreviews([]);
        // Có thể navigate về trang trước hoặc tải lại danh sách
        setTimeout(() => navigate(-1), 1500);
      }
    } catch (err) {
      console.error("Lỗi khi gửi đánh giá:", err);
      const axiosError = err as { response?: { data?: { message?: string } } };
      const msg =
        axiosError.response?.data?.message ||
        "Đã xảy ra lỗi khi gửi đánh giá. Vui lòng thử lại!";
      toast.error(msg);
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
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>

              {previews.map((img, index) => (
                <div
                  key={index}
                  className={styles.uploadThumb}
                  data-aos="zoom-in"
                >
                  <img src={img} alt={`Thumb ${index}`} />
                  <button
                    className={styles.btnRemoveImg}
                    onClick={() => handleRemoveImage(index)}
                    title="Xóa ảnh"
                    aria-label="Xóa ảnh"
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
          {isLoading ? (
            <div className={styles.loadingState}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className={styles.spinner}
              />
              <p>Đang tải các đánh giá mới nhất...</p>
            </div>
          ) : (
            (Array.isArray(recentReviews) ? recentReviews : []).map(
              (review, index) => (
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
              ),
            )
          )}
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
