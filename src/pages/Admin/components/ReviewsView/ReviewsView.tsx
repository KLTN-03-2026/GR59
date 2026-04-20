import React, { useState, useMemo } from "react";
import styles from "../UsersView/UsersView.module.scss";
import StatCard from "../StatCard/StatCard";
import {
  Trash,
  MagnifyingGlass,
  CaretLeft,
  CaretRight,
  ChatCircleText,
  Star,
  CheckCircle,
  XCircle,
  MapPin,
  Buildings,
  ForkKnife,
  Globe,
  MapTrifold,
  Lock,
  LockOpen,
  ShieldCheck,
  Eye,
  X
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useAdminReviews, deleteRecord } from "../../hooks/useAdminData";
import * as adminService from "../../../../services/adminService";
import { ErrorBanner, LoadingRows } from "../_shared/AdminFeedback";
import DetailModal from "../_shared/DetailModal";
import ProtectedImage from "../../../../components/ProtectedImage/ProtectedImage";
import { toast } from "react-toastify";

const PAGE_SIZE = 10;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
} as const;
const rowVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
} as const;

const ReviewsView: React.FC = () => {
  const [page, setPage] = useState(1);
  const {
    data: reviews,
    pagination,
    loading,
    error,
    refetch,
  } = useAdminReviews();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | number | null>(null);

  React.useEffect(() => {
    refetch(page - 1, PAGE_SIZE);
  }, [page]);

  const filtered = useMemo(() => {
    let list = [...reviews];
    if (typeFilter !== "All") {
      list = list.filter((r) => r.type === typeFilter);
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.userName.toLowerCase().includes(s) ||
          r.comment.toLowerCase().includes(s) ||
          (r.nameService && r.nameService.toLowerCase().includes(s)) ||
          (r.provinceName && r.provinceName.toLowerCase().includes(s)),
      );
    }
    return list;
  }, [reviews, typeFilter, search]);

  const totalPages = pagination.totalPages || 1;

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa đánh giá này?")) return;
    try {
      await deleteRecord("reviews", id);
      toast.success("Xóa đánh giá thành công!");
      refetch();
    } catch {
      toast.error("Xóa thất bại!");
    }
  };

  const handleToggleVerify = async (id: number, currentStatus: string) => {
    try {
      const nextStatus = currentStatus === "ACTIVE" ? "HIDDEN" : "ACTIVE";
      await adminService.updateReviewStatus(id, nextStatus as "ACTIVE" | "HIDDEN");
      toast.success(
        nextStatus === "ACTIVE" ? "Đã duyệt đánh giá!" : "Đã gỡ trạng thái duyệt!",
      );
      refetch();
    } catch {
      toast.error("Cập nhật trạng thái thất bại!");
    }
  };

  const handleViewDetail = (id: string | number) => {
    setSelectedId(id);
    setIsDetailOpen(true);
  };

  const getTargetIcon = (type: string) => {
    switch (type) {
      case "HOTEL":
        return <Buildings size={14} />;
      case "RESTAURANT":
        return <ForkKnife size={14} />;
      case "WEBSITE":
        return <Globe size={14} />;
      case "TRIP":
        return <MapTrifold size={14} />;
      default:
        return <MapPin size={14} />;
    }
  };

  return (
    <motion.div
      className={styles.contentArea}
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.div variants={rowVariants} className={styles.pageHeader}>
        <div className={styles.pageTitle}>
          <h2>Quản lý Đánh giá</h2>
          <p>Theo dõi và quản lý các phản hồi từ người dùng về các địa điểm</p>
        </div>
      </motion.div>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      <motion.div variants={rowVariants} className={styles.statsGrid}>
        <StatCard
          label="TỔNG ĐÁNH GIÁ"
          value={
            loading ? "..." : String(pagination.totalElements || reviews.length)
          }
          icon="ChatCircleText"
          colorClass="bgBlue"
        />
        <StatCard
          label="ĐÁNH GIÁ 5 SAO"
          value={
            loading
              ? "..."
              : String(reviews.filter((r) => r.rating === 5).length)
          }
          icon="Star"
          colorClass="bgEmerald"
        />
        <StatCard
          label="CẦN XỬ LÝ"
          value="0"
          icon="ShieldWarning"
          colorClass="bgAmber"
        />
      </motion.div>

      <motion.div variants={rowVariants} className={styles.filterSection}>
        <div className={styles.filterRow}>
          <div className={styles.searchGroup}>
            <MagnifyingGlass size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm theo tên người dùng hoặc nội dung..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button 
                className={styles.clearSearchBtn} 
                onClick={() => setSearch("")}
                title="Xóa tìm kiếm"
              >
                <X size={16} weight="bold" />
              </button>
            )}
          </div>
          <select
            className={styles.selectPill}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            aria-label="Lọc theo loại"
            title="Lọc theo loại"
          >
            <option value="All">Loại: Tất cả</option>
            <option value="HOTEL">Khách sạn</option>
            <option value="RESTAURANT">Nhà hàng</option>
            <option value="ATTRACTION">Địa điểm</option>
            <option value="WEBSITE">Website</option>
            <option value="TRIP">Chuyến đi</option>
          </select>
        </div>
      </motion.div>

      <motion.div variants={rowVariants} className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: "60px" }}>STT</th>
              <th>NGƯỜI DÙNG</th>
              <th>DỊCH VỤ / TỈNH THÀNH</th>
              <th>ĐÁNH GIÁ</th>
              <th>TRẠNG THÁI</th>
              <th className={styles.thActions}>THAO TÁC</th>
            </tr>
          </thead>
          {loading ? (
            <LoadingRows count={5} />
          ) : (
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.emptyState}>
                    Không tìm thấy đánh giá nào
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <motion.tr key={item.id} variants={rowVariants} custom={idx}>
                    <td>#{(page - 1) * PAGE_SIZE + idx + 1}</td>
                    <td>
                      <div className={styles.infoCol}>
                        <ProtectedImage
                          src={item.userImage || ""}
                          fallbackSrc={`https://ui-avatars.com/api/?name=${encodeURIComponent(item.userName)}&background=random`}
                          alt=""
                          style={{
                            borderRadius: "50%",
                            width: "32px",
                            height: "32px",
                            objectFit: "cover",
                          }}
                        />
                        <div className={styles.textInfo}>
                          <p style={{ fontWeight: 600 }}>{item.userName}</p>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", color: "#f59e0b" }}>
                        {Array.from({ length: item.rating }).map((_, i) => (
                          <Star key={i} size={14} weight="fill" />
                        ))}
                      </div>
                    </td>
                    <td>
                      <div className={styles.serviceCol}>
                        <p style={{ fontWeight: 700, fontSize: "0.85rem", color: "#1e293b", margin: 0 }}>
                          {item.nameService || "N/A"}
                        </p>
                        <p style={{ fontSize: "0.75rem", color: "#94a3b8", margin: "2px 0 0 0", display: "flex", alignItems: "center", gap: "4px" }}>
                          <MapPin size={12} weight="fill" color="#38bdf8" />
                          {item.provinceName || "N/A"}
                        </p>
                      </div>
                    </td>
                    <td>
                      <div
                        className={styles.statusBadge}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          fontSize: "0.75rem",
                          padding: "4px 8px",
                          borderRadius: "100px",
                          backgroundColor: item.status === "ACTIVE"
                            ? "#ecfdf5"
                            : "#fef2f2",
                          color: item.status === "ACTIVE" ? "#10b981" : "#ef4444",
                          width: "fit-content",
                        }}
                      >
                        {item.status === "ACTIVE" ? (
                          <ShieldCheck size={14} weight="fill" />
                        ) : (
                          <Lock size={14} weight="fill" />
                        )}
                        <span>{item.status === "ACTIVE" ? "Đã duyệt" : "Đã khóa"}</span>
                      </div>
                    </td>
                    <td>
                      <div className={styles.actionGroup}>
                        <button
                          className={`${styles.actionBtn} ${styles.actionBtnSecondary}`}
                          onClick={() => handleViewDetail(item.id)}
                          title="Xem chi tiết"
                        >
                          <div className={styles.actionBtnIcon}>
                            <Eye size={17} />
                          </div>
                        </button>
                        <button
                          className={`${styles.actionBtn} ${item.status === "ACTIVE" ? styles.actionBtnWarning : styles.actionBtnSuccess}`}
                          onClick={() =>
                            handleToggleVerify(item.id, item.status)
                          }
                          title={
                            item.status === "ACTIVE"
                              ? "Mở khóa (Gỡ duyệt)"
                              : "Khóa (Duyệt)"
                          }
                        >
                          {item.status === "ACTIVE" ? (
                            <div className={styles.actionBtnIcon}>
                              {" "}
                              <LockOpen size={17} />
                            </div>
                          ) : (
                            <div className={styles.actionBtnIcon}>
                              {" "}
                              <ShieldCheck size={17} />
                            </div>
                          )}
                        </button>
                        <button
                          className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                          onClick={() => handleDelete(item.id)}
                          title="Xóa đánh giá"
                        >
                          <div className={styles.actionBtnIcon}>
                            <Trash size={17} />
                          </div>{" "}
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          )}
        </table>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <div className={styles.paginationBtns}>
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className={styles.pageBtn}
              >
                <CaretLeft size={16} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ""}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className={styles.pageBtn}
              >
                <CaretRight size={16} />
              </button>
            </div>
          </div>
        )}
      </motion.div>

      <DetailModal
        isOpen={isDetailOpen}
        onClose={() => {
          setIsDetailOpen(false);
          setSelectedId(null);
        }}
        id={selectedId}
        type="review"
      />
    </motion.div>
  );
};

export default ReviewsView;
