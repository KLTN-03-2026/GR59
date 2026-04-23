import React, { useState, useEffect } from "react";
import styles from "./DetailModal.module.scss";
import {
  X,
  MapPin,
  Star,
  Clock,
  Envelope,
  PhoneCall,
  IdentificationCard,
  UserCircle,
  Buildings,
  ForkKnife,
  MapTrifoldIcon,
  Image as ImageIcon,
  GlobeHemisphereWest,
  Video,
  ShieldCheck,
  ChatCircleText,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import type { 
  Hotel, 
  Restaurant, 
  Destination, 
  DbUser, 
  AdminReview
} from "../../../../services/adminService";
import {
  fetchUserDetail,
  fetchHotelDetail,
  fetchRestaurantDetail,
  fetchAttractionDetail,
  fetchReviewDetail,
  fetchReviewsByTarget,
} from "../../../../services/adminService";
import ProtectedImage from "../../../../components/ProtectedImage/ProtectedImage";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string | number | null;
  type: "hotel" | "restaurant" | "destination" | "user" | "review";
}

type DetailData = Hotel | Restaurant | Destination | DbUser | AdminReview;


const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  id,
  type,
}) => {
  const [data, setData] = useState<DetailData | null>(null);
  const [reviews, setReviews] = useState<AdminReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);

  useEffect(() => {
    if (isOpen && id) {
      const fetchData = async () => {
        setLoading(true);
        try {
          let res;
          if (type === "hotel") res = await fetchHotelDetail(id);
          else if (type === "restaurant") res = await fetchRestaurantDetail(id);
          else if (type === "destination")
            res = await fetchAttractionDetail(id);
          else if (type === "user") res = await fetchUserDetail(id);
          else if (type === "review") res = await fetchReviewDetail(id);

          if (res && res.data) {
            // Robust data extraction: data.data -> data.DT -> data (if it has expected fields) -> data
            const resBody = res.data;
            const resData = resBody.data !== undefined ? resBody.data : (resBody.DT !== undefined ? resBody.DT : resBody);
            
            if (resData) setData(resData as DetailData);
          }

          // Fetch reviews for places
          if (type === "hotel" || type === "restaurant" || type === "destination") {
            setLoadingReviews(true);
            try {
              const targetType = type === "destination" ? "attraction" : type;
              const revRes = await fetchReviewsByTarget(targetType, id);
              if (revRes.data) {
                const revData = revRes.data.data?.content || revRes.data.data || revRes.data.DT?.content;
                setReviews(Array.isArray(revData) ? (revData as AdminReview[]) : []);
              }
            } catch (err) {
              console.error("Lỗi khi lấy reviews:", err);
              setReviews([]);
            } finally {
              setLoadingReviews(false);
            }
          }
        } catch (error) {
          console.error("Lỗi khi lấy chi tiết:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    } else {
      setData(null);
      setReviews([]);
    }
  }, [isOpen, id, type]);

  if (!isOpen) return null;

  const renderContent = () => {
    if (loading) {
      return (
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <p>Đang tải thông tin chi tiết...</p>
        </div>
      );
    }

    if (!data) {
      return (
        <div className={styles.errorContainer}>
          <p>Không tìm thấy dữ liệu hoặc có lỗi xảy ra.</p>
        </div>
      );
    }

    if (type === "user") {
      const userData = data as DbUser;
      return (
        <div className={styles.userDetail}>
          <div className={styles.profileSection}>
            <div className={styles.avatarWrapper}>
              <ProtectedImage
                src={userData.avatarUrl || ""}
                fallbackSrc={`https://ui-avatars.com/api/?name=${userData.fullName || userData.email}&background=0ea5e9&color=fff`}
                alt="Avatar"
              />
              <div className={styles.roleBadgeFloating}>
                {userData.roleName} (ID: {userData.roleId})
              </div>
            </div>
            <div className={styles.profileMain}>
              <h4>{userData.fullName || "Chưa cập nhật tên"}</h4>
              <p className={styles.userEmail}>{userData.email}</p>
              <div className={styles.userMeta}>
                <span
                  className={
                    userData.isActive ? styles.statusActive : styles.statusInactive
                  }
                >
                  {userData.isActive ? "Đang hoạt động" : "Đã bị khóa"}
                </span>
                <span className={styles.joinDate}>
                  Tham gia:{" "}
                  {new Date(userData.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.detailGrid}>
            <div className={styles.detailCard}>
              <h5>Thông tin liên hệ</h5>
              <div className={styles.cardContent}>
                <div className={styles.infoLine}>
                  <Envelope size={20} />
                  <span>{userData.email}</span>
                </div>
                <div className={styles.infoLine}>
                  <PhoneCall size={20} />
                  <span>{userData.phone || "Chưa cập nhật SĐT"}</span>
                </div>
                <div className={styles.infoLine}>
                  <MapPin size={20} />
                  <span>{userData.address || "Chưa cập nhật địa chỉ"}</span>
                </div>
              </div>
            </div>

            <div className={styles.detailCard}>
              <h5>Bảo mật & Hệ thống</h5>
              <div className={styles.cardContent}>
                <div className={styles.infoLine}>
                  <ShieldCheck size={20} />
                  <span>
                    Xác minh Email:{" "}
                    {userData.isEmailVerified ? "Đã xác thực" : "Chưa xác thực"}
                  </span>
                </div>
                <div className={styles.infoLine}>
                  <GlobeHemisphereWest size={20} />
                  <span>
                    Liên kết:{" "}
                    {userData.isGoogleLinked
                      ? "Google"
                      : userData.isFacebookLinked
                        ? "Facebook"
                        : "Mặc định"}
                    {userData.googleId && ` (${userData.googleId})`}
                    {userData.facebookId && ` (${userData.facebookId})`}
                  </span>
                </div>
                <div className={styles.infoLine}>
                  <IdentificationCard size={20} />
                  <span>User ID: {userData.id}</span>
                </div>
                <div className={styles.infoLine}>
                  <Clock size={20} />
                  <span>
                    Cập nhật cuối:{" "}
                    {new Date(userData.updatedAt).toLocaleString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {userData.bio && (
            <div className={styles.bioCard}>
              <h5>Giới thiệu bản thân</h5>
              <p>{userData.bio}</p>
            </div>
          )}
        </div>
      );
    }

    if (type === "review") {
      const reviewData = data as AdminReview;
      return (
        <div className={styles.reviewDetail}>
          <div className={styles.reviewHeader}>
            <ProtectedImage
              src={reviewData.userImage || ""}
              fallbackSrc={`https://ui-avatars.com/api/?name=${encodeURIComponent(reviewData.userName || "User")}&background=0ea5e9&color=fff`}
              alt="Avatar"
              className={styles.reviewerAvatar}
            />
            <div className={styles.reviewerInfo}>
              <h4>
                {reviewData.userName || "Người dùng ẩn danh"}
                <span className={styles.idBadge}>ID: {reviewData.id}</span>
              </h4>
              <div className={styles.reviewMeta}>
                <div className={styles.stars}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      weight={i < (reviewData.rating || 0) ? "fill" : "regular"}
                      color={i < (reviewData.rating || 0) ? "#f59e0b" : "#cbd5e1"}
                    />
                  ))}
                  <span>{reviewData.rating}/5</span>
                </div>
                <div className={styles.categoryTag}>{reviewData.type}</div>
                {(reviewData.nameService || reviewData.provinceName) && (
                  <div className={styles.targetInfo}>
                    {reviewData.nameService && (
                      <span className={styles.serviceName}>
                        <Buildings size={14} weight="fill" /> {reviewData.nameService}
                      </span>
                    )}
                    {reviewData.provinceName && (
                      <span className={styles.provinceTag}>
                        <MapPin size={14} weight="fill" /> {reviewData.provinceName}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.reviewContent}>
            <div className={styles.descHeader}>
              <ChatCircleText size={24} weight="fill" />
              <h5>Nội dung đánh giá</h5>
            </div>
            <p className={styles.commentText}>
              "{reviewData.comment || "Không có nội dung."}"
            </p>
          </div>

          <div className={styles.imageGallery}>
            <h5>Hình ảnh đính kèm</h5>
            <div className={styles.largeGrid}>
              {reviewData.images && reviewData.images.length > 0 ? (
                reviewData.images.map((img: string, i: number) => (
                  <ProtectedImage key={i} src={img} alt={`review-${i}`} />
                ))
              ) : (
                <div className={styles.noImages}>
                  <ImageIcon
                    size={32}
                    color="#cbd5e1"
                    className={styles.mb8}
                  />
                  <p className={styles.m0}>Không có hình ảnh đính kèm</p>
                </div>
              )}
            </div>
          </div>

          <div className={styles.techGrid}>
            <div className={styles.techItem}>
              <label>User ID</label>
              <p>{reviewData.userId || "N/A"}</p>
            </div>
            <div className={styles.techItem}>
              <label>Mục tiêu</label>
              <p>
                {reviewData.hotelId && `Khách sạn (ID: ${reviewData.hotelId})`}
                {reviewData.restaurantId && `Nhà hàng (ID: ${reviewData.restaurantId})`}
                {reviewData.attractionId && `Địa điểm (ID: ${reviewData.attractionId})`}
                {!reviewData.hotelId &&
                  !reviewData.restaurantId &&
                  !reviewData.attractionId &&
                  "Hệ thống"}
              </p>
            </div>
            <div className={styles.techItem}>
              <label>Trạng thái</label>
              <p
                className={
                  reviewData.status === "ACTIVE" ? styles.statusActive : styles.statusMaint
                }
              >
                {reviewData.status === "ACTIVE" ? "Đã duyệt" : "Bị khóa/Ẩn"}
              </p>
            </div>
            <div className={styles.techItem}>
              <label>Ngày đăng</label>
              <p>{new Date(reviewData.createdAt).toLocaleString("vi-VN")}</p>
            </div>
          </div>
        </div>
      );
    }

    // For Hotels, Restaurants, Destinations (Common structure)
    const provinceMap: Record<string, string> = {
      "1": "Thừa Thiên Huế",
      "2": "Đà Nẵng",
      "3": "Quảng Nam",
      "4": "Hà Nội",
      "5": "TP. Hồ Chí Minh",
    };

    const categoryMap: Record<string, string> = {
      // Hotels
      LUXURY: "Hạng sang (Luxury)",
      RESORT: "Khu nghỉ dưỡng (Resort)",
      BOUTIQUE: "Độc đáo (Boutique)",
      BUDGET: "Bình dân (Budget)",
      BUSINESS: "Công tác (Business)",
      HOMESTAY: "Homestay",
      VILLA: "Biệt thự (Villa)",
      // Restaurants
      VIETNAMESE: "Món Việt",
      SEAFOOD: "Hải sản",
      DESSERT: "Tráng miệng / Cafe",
      WESTERN: "Món Âu",
      ASIAN: "Món Á",
      VEGETARIAN: "Món chay",
      // Destinations
      ATTRACTION: "Điểm tham quan",
      CULTURE: "Văn hóa & Lịch sử",
      NATURE: "Thiên nhiên & Sinh thái",
      RELAX: "Nghỉ dưỡng & Thư giãn",
      ENTERTAINMENT: "Giải trí & Vui chơi",
    };

    const placeData = data as (Hotel | Restaurant | Destination) & {
      heroImage?: string;
      img?: string;
      image?: string;
      price?: number;
      time?: number;
      reviews?: number;
    };
    return (
      <div className={styles.placeDetail}>
        <div className={styles.topSection}>
          <div className={styles.mediaGallery}>
            <img
              src={placeData.imageUrl || placeData.heroImage}
              alt={placeData.name}
              className={styles.mainImage}
            />
            <div className={styles.thumbnailGrid}>
              {placeData.gallery && placeData.gallery.length > 0 ? (
                placeData.gallery
                  .slice(0, 3)
                  .map((img: string, i: number) => (
                    <img key={i} src={img} alt="thumb" />
                  ))
              ) : (
                <div className={styles.noGallery}>Chưa có ảnh gallery</div>
              )}
              {placeData.gallery?.length > 3 && (
                <div className={styles.moreOverlay}>
                  +{placeData.gallery.length - 3}
                </div>
              )}
            </div>
          </div>

          <div className={styles.quickStats}>
            <div className={styles.categoryTag}>
              {(placeData.category ? categoryMap[placeData.category] : null) ||
                placeData.category}
            </div>
            <h2>
              {placeData.name} <span className={styles.idBadge}>ID: {placeData.id}</span>
            </h2>

            <div className={styles.ratingOverview}>
              <div className={styles.stars}>
                <Star weight="fill" />
                <span>{placeData.rating}</span>
              </div>
              <div className={styles.reviewsCount}>
                ({placeData.reviewCount || placeData.reviews || 0} đánh giá)
              </div>
            </div>

            <div className={styles.technicalGrid}>
              <div className={styles.techItem}>
                <label>Giá trung bình</label>
                <p>
                  {(placeData.averagePrice || placeData.price)?.toLocaleString() || 0} VNĐ
                </p>
              </div>
              <div className={styles.techItem}>
                <label>Thời lượng</label>
                <p>{placeData.estimatedDuration || placeData.time || 0} phút</p>
              </div>
              <div className={styles.techItem}>
                <label>Mã tỉnh (ProvinceID)</label>
                <p>{placeData.provinceId || "N/A"}</p>
              </div>
              <div className={styles.techItem}>
                <label>Tỉnh thành</label>
                <p>{provinceMap[String(placeData.provinceId)] || "Chưa xác định"}</p>
              </div>
              <div className={styles.techItem}>
                <label>Trạng thái</label>
                <p
                  className={
                    placeData.status?.includes("ACTIVE") ||
                    placeData.status?.includes("OPEN")
                      ? styles.statusActive
                      : styles.statusMaint
                  }
                >
                  {placeData.status}
                </p>
              </div>
              <div className={styles.techItem}>
                <label>Video</label>
                <p>{placeData.previewVideo ? "Có link" : "Không có"}</p>
              </div>
            </div>

            <div className={styles.actionRow}>
              {placeData.previewVideo && (
                <a
                  href={placeData.previewVideo}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.videoBtn}
                >
                  <Video size={18} weight="bold" /> Xem Video Preview
                </a>
              )}
            </div>
          </div>
        </div>

        <div className={styles.descriptionSection}>
          <div className={styles.descHeader}>
            <h5>Mô tả chi tiết</h5>
            <div className={styles.locationFooter}>
              <MapPin size={18} weight="fill" />
              <span>{placeData.location}</span>
            </div>
          </div>
          <p className={styles.fullDescription}>
            {placeData.description || "Hiện chưa có mô tả chi tiết cho mục này."}
          </p>

          <div className={styles.rawJsonSection}>
            <h5>Dữ liệu ảnh gốc (imageUrl)</h5>
            <code className={styles.urlCode}>
              {placeData.imageUrl || placeData.heroImage}
            </code>
          </div>

          <div className={styles.reviewsSection}>
            <div className={styles.descHeader}>
              <h5>Đánh giá từ khách hàng ({reviews.length})</h5>
              <ChatCircleText size={20} weight="fill" color="#f59e0b" />
            </div>

            {loadingReviews ? (
              <div className={styles.reviewsLoading}>
                <div className={styles.spinnerSmall}></div>
                <span>Đang tải đánh giá...</span>
              </div>
            ) : reviews.length > 0 ? (
              <div className={styles.reviewsList}>
                {reviews.map((rev) => (
                  <div key={rev.id} className={styles.reviewItem}>
                    <div className={styles.revHeader}>
                      <ProtectedImage
                        src={rev.userImage}
                        fallbackSrc={`https://ui-avatars.com/api/?name=${encodeURIComponent(rev.userName)}&background=random`}
                        alt=""
                        className={styles.revAvatar}
                      />
                      <div className={styles.revMeta}>
                        <strong>{rev.userName}</strong>
                        <div className={styles.revStars}>
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              weight={i < rev.rating ? "fill" : "regular"}
                              color={i < rev.rating ? "#f59e0b" : "#cbd5e1"}
                            />
                          ))}
                          <span>{new Date(rev.createdAt).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                    </div>
                    <p className={styles.revComment}>{rev.comment}</p>
                    {rev.images && rev.images.length > 0 && (
                      <div className={styles.revGallery}>
                        {rev.images.map((img: string, i: number) => (
                          <ProtectedImage key={i} src={img} alt="" />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noReviews}>
                Chưa có đánh giá nào cho địa điểm này.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      <div className={styles.overlay} onClick={onClose}>
        <motion.div
          className={styles.modal}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
        >
          <div className={styles.header}>
            <div className={styles.titleWrapper}>
              {type === "hotel" && <Buildings size={24} color="#0EA5E9" />}
              {type === "restaurant" && <ForkKnife size={24} color="#F43F5E" />}
              {type === "destination" && (
                <MapTrifoldIcon size={24} color="#10B981" />
              )}
              {type === "user" && <UserCircle size={24} color="#8B5CF6" />}
              {type === "review" && (
                <ChatCircleText size={24} color="#f59e0b" />
              )}
              <h3>
                Chi tiết{" "}
                {type === "user"
                  ? "Người dùng"
                  : type === "hotel"
                    ? "Khách sạn"
                    : type === "restaurant"
                      ? "Nhà hàng"
                      : type === "review"
                        ? "Đánh giá"
                        : "Địa điểm"}
              </h3>
            </div>
            <button
              type="button"
              className={styles.closeBtn}
              onClick={onClose}
              aria-label="Đóng"
              title="Đóng"
            >
              <div className={styles.smallFont}>
                <X size={20} weight="bold" />
              </div>
            </button>
          </div>

          <div className={styles.body}>{renderContent()}</div>

          <div className={styles.footer}>
            <button type="button" className={styles.btnClose} onClick={onClose}>
              Đóng
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default DetailModal;
