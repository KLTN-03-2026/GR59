import React, { useState, useEffect } from "react";
import styles from "./DetailModal.module.scss";
import {
  X,
  MapPin,
  Star,
  Clock,
  Tag,
  Envelope,
  Phone,
  House,
  IdentificationCard,
  UserCircle,
  Buildings,
  ForkKnife,
  MapTrifold,
  Image as ImageIcon,
  CheckCircle,
  XCircle,
  Globe,
  Video,
  ShieldCheck,
  ChatCircleText,
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchUserDetail,
  fetchHotelDetail,
  fetchRestaurantDetail,
  fetchAttractionDetail,
  fetchReviewDetail,
} from "../../../../services/adminService";
import ProtectedImage from "../../../../components/ProtectedImage/ProtectedImage";

interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string | number | null;
  type: "hotel" | "restaurant" | "destination" | "user" | "review";
}

const DetailModal: React.FC<DetailModalProps> = ({
  isOpen,
  onClose,
  id,
  type,
}) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

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
            const resData = res.data.data || (res.data as any).DT;
            if (resData) setData(resData);
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
      return (
        <div className={styles.userDetail}>
          <div className={styles.profileSection}>
            <div className={styles.avatarWrapper}>
              <ProtectedImage
                src={data.avatarUrl}
                fallbackSrc={`https://ui-avatars.com/api/?name=${data.fullName || data.email}&background=0ea5e9&color=fff`}
                alt="Avatar"
              />
              <div className={styles.roleBadgeFloating}>
                {data.roleName} (ID: {data.roleId})
              </div>
            </div>
            <div className={styles.profileMain}>
              <h4>{data.fullName || "Chưa cập nhật tên"}</h4>
              <p className={styles.userEmail}>{data.email}</p>
              <div className={styles.userMeta}>
                <span
                  className={
                    data.isActive ? styles.statusActive : styles.statusInactive
                  }
                >
                  {data.isActive ? "Đang hoạt động" : "Đã bị khóa"}
                </span>
                <span className={styles.joinDate}>
                  Tham gia:{" "}
                  {new Date(data.createdAt).toLocaleDateString("vi-VN")}
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
                  <span>{data.email}</span>
                </div>
                <div className={styles.infoLine}>
                  <Phone size={20} />
                  <span>{data.phone || "Chưa cập nhật SĐT"}</span>
                </div>
                <div className={styles.infoLine}>
                  <MapPin size={20} />
                  <span>{data.address || "Chưa cập nhật địa chỉ"}</span>
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
                    {data.isEmailVerified ? "Đã xác thực" : "Chưa xác thực"}
                  </span>
                </div>
                <div className={styles.infoLine}>
                  <Globe size={20} />
                  <span>
                    Liên kết:{" "}
                    {data.isGoogleLinked
                      ? "Google"
                      : data.isFacebookLinked
                        ? "Facebook"
                        : "Mặc định"}
                    {data.googleId && ` (${data.googleId})`}
                    {data.facebookId && ` (${data.facebookId})`}
                  </span>
                </div>
                <div className={styles.infoLine}>
                  <IdentificationCard size={20} />
                  <span>User ID: {data.id}</span>
                </div>
                <div className={styles.infoLine}>
                  <Clock size={20} />
                  <span>
                    Cập nhật cuối:{" "}
                    {new Date(data.updatedAt).toLocaleString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {data.bio && (
            <div className={styles.bioCard}>
              <h5>Giới thiệu bản thân</h5>
              <p>{data.bio}</p>
            </div>
          )}
        </div>
      );
    }

    if (type === "review") {
      return (
        <div className={styles.reviewDetail}>
          <div className={styles.reviewHeader}>
            <ProtectedImage
              src={data.userImage || ""}
              fallbackSrc={`https://ui-avatars.com/api/?name=${encodeURIComponent(data.userName || "User")}&background=0ea5e9&color=fff`}
              alt="Avatar"
              className={styles.reviewerAvatar}
            />
            <div className={styles.reviewerInfo}>
              <h4>
                {data.userName || "Người dùng ẩn danh"}
                <span className={styles.idBadge}>ID: {data.id}</span>
              </h4>
              <div className={styles.reviewMeta}>
                <div className={styles.stars}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      weight={i < (data.rating || 0) ? "fill" : "regular"}
                      color={i < (data.rating || 0) ? "#f59e0b" : "#cbd5e1"}
                    />
                  ))}
                  <span>{data.rating}/5</span>
                </div>
                <div className={styles.categoryTag}>{data.type}</div>
              </div>
            </div>
          </div>

          <div className={styles.reviewContent}>
            <div className={styles.descHeader}>
              <ChatCircleText size={24} weight="fill" />
              <h5>Nội dung đánh giá</h5>
            </div>
            <p className={styles.commentText}>
              "{data.comment || "Không có nội dung."}"
            </p>
          </div>

          <div className={styles.imageGallery}>
            <h5>Hình ảnh đính kèm</h5>
            <div className={styles.largeGrid}>
              {data.images && data.images.length > 0 ? (
                data.images.map((img: string, i: number) => (
                  <ProtectedImage key={i} src={img} alt={`review-${i}`} />
                ))
              ) : (
                <div className={styles.noImages}>
                  <ImageIcon
                    size={32}
                    color="#cbd5e1"
                    style={{ marginBottom: "8px" }}
                  />
                  <p style={{ margin: 0 }}>Không có hình ảnh đính kèm</p>
                </div>
              )}
            </div>
          </div>

          <div className={styles.techGrid}>
            <div className={styles.techItem}>
              <label>User ID</label>
              <p>{data.userId || "N/A"}</p>
            </div>
            <div className={styles.techItem}>
              <label>Mục tiêu</label>
              <p>
                {data.hotelId && `Khách sạn (ID: ${data.hotelId})`}
                {data.restaurantId && `Nhà hàng (ID: ${data.restaurantId})`}
                {data.attractionId && `Địa điểm (ID: ${data.attractionId})`}
                {!data.hotelId &&
                  !data.restaurantId &&
                  !data.attractionId &&
                  "Hệ thống"}
              </p>
            </div>
            <div className={styles.techItem}>
              <label>Trạng thái</label>
              <p
                className={
                  data.isVerified ? styles.statusActive : styles.statusMaint
                }
              >
                {data.isVerified ? "Đã duyệt" : "Bị khóa/Chờ duyệt"}
              </p>
            </div>
            <div className={styles.techItem}>
              <label>Ngày đăng</label>
              <p>{new Date(data.createdAt).toLocaleString("vi-VN")}</p>
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

    return (
      <div className={styles.placeDetail}>
        <div className={styles.topSection}>
          <div className={styles.mediaGallery}>
            <img
              src={data.imageUrl || data.heroImage}
              alt={data.name}
              className={styles.mainImage}
            />
            <div className={styles.thumbnailGrid}>
              {data.gallery && data.gallery.length > 0 ? (
                data.gallery
                  .slice(0, 3)
                  .map((img: string, i: number) => (
                    <img key={i} src={img} alt="thumb" />
                  ))
              ) : (
                <div className={styles.noGallery}>Chưa có ảnh gallery</div>
              )}
              {data.gallery?.length > 3 && (
                <div className={styles.moreOverlay}>
                  +{data.gallery.length - 3}
                </div>
              )}
            </div>
          </div>

          <div className={styles.quickStats}>
            <div className={styles.categoryTag}>
              {categoryMap[data.category] || data.category}
            </div>
            <h2>
              {data.name} <span className={styles.idBadge}>ID: {data.id}</span>
            </h2>

            <div className={styles.ratingOverview}>
              <div className={styles.stars}>
                <Star weight="fill" />
                <span>{data.rating}</span>
              </div>
              <div className={styles.reviewsCount}>
                ({data.reviewCount || data.reviews || 0} đánh giá)
              </div>
            </div>

            <div className={styles.technicalGrid}>
              <div className={styles.techItem}>
                <label>Giá trung bình</label>
                <p>
                  {(data.averagePrice || data.price)?.toLocaleString() || 0} VNĐ
                </p>
              </div>
              <div className={styles.techItem}>
                <label>Thời lượng</label>
                <p>{data.estimatedDuration || data.time || 0} phút</p>
              </div>
              <div className={styles.techItem}>
                <label>Mã tỉnh (ProvinceID)</label>
                <p>{data.provinceId || "N/A"}</p>
              </div>
              <div className={styles.techItem}>
                <label>Tỉnh thành</label>
                <p>{provinceMap[String(data.provinceId)] || "Chưa xác định"}</p>
              </div>
              <div className={styles.techItem}>
                <label>Trạng thái</label>
                <p
                  className={
                    data.status?.includes("ACTIVE") ||
                    data.status?.includes("OPEN")
                      ? styles.statusActive
                      : styles.statusMaint
                  }
                >
                  {data.status}
                </p>
              </div>
              <div className={styles.techItem}>
                <label>Video</label>
                <p>{data.previewVideo ? "Có link" : "Không có"}</p>
              </div>
            </div>

            <div className={styles.actionRow}>
              {data.previewVideo && (
                <a
                  href={data.previewVideo}
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
              <span>{data.location}</span>
            </div>
          </div>
          <p className={styles.fullDescription}>
            {data.description || "Hiện chưa có mô tả chi tiết cho mục này."}
          </p>

          <div className={styles.rawJsonSection}>
            <h5>Dữ liệu ảnh gốc (imageUrl)</h5>
            <code className={styles.urlCode}>
              {data.imageUrl || data.heroImage}
            </code>
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
                <MapTrifold size={24} color="#10B981" />
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
              <div style={{ fontSize: "12px" }}>
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
