import React, { useState, useMemo } from "react";
import styles from "../UsersView/UsersView.module.scss"; // Reuse UsersView styles for consistency
import StatCard from "../StatCard/StatCard";
import {
  Pencil,
  Trash,
  MagnifyingGlass,
  CaretLeft,
  CaretRight,
  Eye,
  FilePlus,
  Article,
  CheckCircle,
  Clock,
  Star,
  X
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { useNews, deleteRecord, updateRecord, createRecord, toggleNewsFeatured } from "../../hooks/useAdminData";
import { ErrorBanner, LoadingRows } from "../_shared/AdminFeedback";
import AddEditModal from "../_shared/AddEditModal";
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

const NewsView: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data: news, pagination, loading, error, refetch } = useNews();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState("All");

  const categories = ["All", "Điểm đến", "Ẩm thực", "Mẹo du lịch", "Sự kiện"];

  React.useEffect(() => {
    refetch(page - 1, PAGE_SIZE);
  }, [page]);

  const getCategoryStyle = (cat: string) => {
    switch (cat) {
      case "Điểm đến": return styles.bgBlue;
      case "Ẩm thực": return styles.bgOrange;
      case "Mẹo du lịch": return styles.bgEmerald;
      case "Sự kiện": return styles.bgPurple;
      default: return styles.bgSlate;
    }
  };

  const filtered = useMemo(() => {
    let list = [...news];
    if (activeCategoryFilter !== "All") {
      list = list.filter(n => n.category === activeCategoryFilter);
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(n => n.title.toLowerCase().includes(s) || n.excerpt.toLowerCase().includes(s));
    }
    return list;
  }, [news, activeCategoryFilter, search]);

  const totalPages = pagination.totalPages || 1;

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa bài viết này?")) return;
    try {
      await deleteRecord("news", id);
      toast.success("Xóa bài viết thành công!");
      refetch(page - 1, PAGE_SIZE);
    } catch {
      toast.error("Xóa thất bại!");
    }
  };

  const handleEdit = (item: any) => {
    setEditItem(item);
    setIsEditOpen(true);
  };

  const handleSave = async (formData: any) => {
    try {
      if (editItem) {
        await updateRecord("news", editItem.id, formData);
        toast.success("Cập nhật bài viết thành công!");
      } else {
        await createRecord("news", formData);
        toast.success("Thêm bài viết thành công!");
      }
      setIsEditOpen(false);
      refetch(page - 1, PAGE_SIZE);
    } catch (err: any) {
      toast.error("Thao tác thất bại!");
    }
  };

  const handleToggleFeatured = async (id: number) => {
    try {
      await toggleNewsFeatured(id);
      toast.success("Cập nhật trạng thái nổi bật thành công!");
      refetch(page - 1, PAGE_SIZE);
    } catch (err) {
      toast.error("Cập nhật trạng thái thất bại!");
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
          <h2>Quản lý Bài viết</h2>
          <p>Tạo và chỉnh sửa các tin tức, mẹo du lịch và cảm hứng cho người dùng</p>
        </div>
        <div className={styles.pageActions}>
          <button 
            className={styles.btnPrimary} 
            onClick={() => { setEditItem(null); setIsEditOpen(true); }}
          >
            <FilePlus size={18} weight="bold" />
            <span>Viết bài mới</span>
          </button>
        </div>
      </motion.div>

      {error && <ErrorBanner message={error} onRetry={() => refetch(page - 1, PAGE_SIZE)} />}

      <motion.div variants={rowVariants} className={styles.statsGrid}>
        <StatCard
          label="TỔNG BÀI VIẾT"
          value={loading ? "..." : String(news.length)}
          icon="Article"
          colorClass="bgBlue"
        />
        <StatCard
          label="BÀI VIẾT NỔI BẬT"
          value={loading ? "..." : String(news.filter(n => n.isFeatured).length)}
          icon="Star"
          colorClass="bgAmber"
        />
        <StatCard
          label="LƯỢT XEM THÁNG"
          value="4.2k"
          trend="+12%"
          trendUp={true}
          icon="Eye"
          colorClass="bgEmerald"
        />
      </motion.div>

      <motion.div variants={rowVariants} className={styles.filterSection}>
        <div className={styles.filterRow}>
          <div className={styles.searchGroup}>
            <MagnifyingGlass size={18} className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm theo tiêu đề hoặc nội dung..."
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
            value={activeCategoryFilter}
            onChange={(e) => setActiveCategoryFilter(e.target.value)}
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>Chuyên mục: {cat}</option>
            ))}
          </select>
        </div>
      </motion.div>

      <motion.div variants={rowVariants} className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: "60px" }}>STT</th>
              <th>BÀI VIẾT</th>
              <th>CHUYÊN MỤC</th>
              <th>NGÀY ĐĂNG</th>
              <th>NỔI BẬT</th>
              <th className={styles.thActions}>THAO TÁC</th>
            </tr>
          </thead>
          {loading ? (
            <LoadingRows count={5} />
          ) : (
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className={styles.emptyState}>Không tìm thấy bài viết nào</td>
                </tr>
              ) : (
                filtered.map((item, idx) => (
                  <motion.tr key={item.id} variants={rowVariants} custom={idx}>
                    <td>#{(page - 1) * PAGE_SIZE + idx + 1}</td>
                    <td>
                      <div className={styles.infoCol}>
                        <img src={item.image} alt="" style={{ borderRadius: '4px', width: '48px', height: '32px', objectFit: 'cover' }} />
                        <div className={styles.textInfo}>
                          <p style={{ fontWeight: 600 }}>{item.title}</p>
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.readTime}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${getCategoryStyle(item.category)}`}>
                        {item.category}
                      </span>
                    </td>
                    <td>
                      {item.createdAt 
                        ? new Date(item.createdAt).toLocaleDateString('vi-VN')
                        : item.date || "---"}
                    </td>
                    <td style={{ textAlign: "center", cursor: "pointer" }} onClick={() => handleToggleFeatured(item.id)}>
                      {item.isFeatured ? (
                        <Star size={20} weight="fill" color="#f59e0b" style={{ transition: "transform 0.2s" }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.2)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                      ) : (
                        <Star size={20} color="#cbd5e1" style={{ transition: "transform 0.2s" }} onMouseOver={e => e.currentTarget.style.transform = 'scale(1.2)'} onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'} />
                      )}
                    </td>
                    <td>
                      <div className={styles.actionGroup}>
                        <button className={styles.actionBtn} onClick={() => handleEdit(item)} title="Chỉnh sửa">
                         <div style={{fontSize: "12px"}}> <Pencil size={17} /></div>
                        </button>
                        <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={() => handleDelete(item.id)} title="Xóa">
                          <div style={{fontSize: "12px"}}> <Trash size={17} /></div>
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
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className={styles.pageBtn}>
               <div style={{fontSize: "12px"}}> <CaretLeft size={16} /></div>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ""}`} onClick={() => setPage(p)}>
                  {p}
                </button>
              ))}
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className={styles.pageBtn}>
                <div style={{fontSize: "12px"}}> <CaretRight size={16} /></div>
              </button>
            </div>
          </div>
        )}
      </motion.div>

      <AddEditModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSave={handleSave}
        title={editItem ? "Chỉnh sửa bài viết" : "Viết bài mới"}
        type="news"
        initialData={editItem}
      />
    </motion.div>
  );
};

export default NewsView;
