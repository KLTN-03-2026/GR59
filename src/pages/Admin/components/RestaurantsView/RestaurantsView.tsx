import React, { useState, useMemo } from 'react';
import styles from '../_shared.module.scss';
import StatCard from '../StatCard/StatCard';
import { MapPin, Star, Pencil, Plus, MagnifyingGlass, Trash, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { motion } from 'framer-motion';
import { useRestaurants, deleteRecord } from '../../hooks/useAdminData';
import { ErrorBanner, LoadingRows } from '../_shared/AdminFeedback';

const PAGE_SIZE = 6;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
} as const;
const rowVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
} as const;

const RestaurantsView: React.FC = () => {
  const { data: restaurants, loading, error, refetch } = useRestaurants();

  const [activeTab, setActiveTab] = useState<'all' | 'ĐANG MỞ' | 'TẠM ĐÓNG'>('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // ─── derived stats ──────────────────────────────────────────────────────────
  const totalOpen = restaurants.filter(r => r.status === 'ĐANG MỞ').length;
  const totalClosed = restaurants.filter(r => r.status === 'TẠM ĐÓNG').length;

  // ─── filtered & paginated ───────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...restaurants];
    if (activeTab !== 'all') list = list.filter(r => r.status === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(r => r.name.toLowerCase().includes(q) || r.location.toLowerCase().includes(q));
    }
    return list;
  }, [restaurants, activeTab, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa nhà hàng này không?')) return;
    try {
      await deleteRecord('restaurants', id);
      refetch();
    } catch {
      alert('Xóa thất bại!');
    }
  };

  return (
    <motion.div className={styles.contentArea} initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div variants={rowVariants} className={styles.pageHeader}>
        <div className={styles.pageTitle}>
          <h2>Quản lý Nhà hàng</h2>
          <p>Quản lý danh mục nhà hàng và địa điểm ẩm thực trên toàn hệ thống</p>
        </div>
        <div className={styles.pageActions}>
          <button className={styles.btnPrimary}>
            <Plus size={18} weight="bold" />
            <span>Thêm nhà hàng</span>
          </button>
        </div>
      </motion.div>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      <motion.div variants={rowVariants} className={styles.statsGrid}>
        <StatCard label="TỔNG NHÀ HÀNG" value={loading ? '...' : String(restaurants.length)} trend="+8% tháng này" trendUp={true} icon="ForkKnife" colorClass="bgOrange" />
        <StatCard label="ĐANG HOẠT ĐỘNG" value={loading ? '...' : String(totalOpen)} footerText="Đang phục vụ" icon="CheckCircle" colorClass="bgEmerald" />
        <StatCard label="TẠM ĐÓNG" value={loading ? '...' : String(totalClosed)} trend="Dự kiến xong T4" trendUp={true} icon="Storefront" colorClass="bgAmber" />
        <StatCard label="YÊU CẦU MỚI" value="156" trend="Chờ phê duyệt" trendUp={true} icon="Plus" colorClass="bgBlue" />
      </motion.div>

      <motion.div variants={rowVariants} className={styles.filterSection}>
        <div className={styles.filterHeader}>
          <div className={styles.tabGroup}>
            <button
              className={`${styles.tab} ${activeTab === 'all' ? styles.tabActive : ''}`}
              onClick={() => { setActiveTab('all'); setPage(1); }}
            >Tất cả ({restaurants.length})</button>
            <button
              className={`${styles.tab} ${activeTab === 'ĐANG MỞ' ? styles.tabActive : ''}`}
              onClick={() => { setActiveTab('ĐANG MỞ'); setPage(1); }}
            >Đang hoạt động</button>
            <button
              className={`${styles.tab} ${activeTab === 'TẠM ĐÓNG' ? styles.tabActive : ''}`}
              onClick={() => { setActiveTab('TẠM ĐÓNG'); setPage(1); }}
            >Tạm đóng</button>
          </div>
        </div>
        <div className={styles.filterRow}>
          <span className={styles.filterLabel}>Lọc:</span>
          <div className={styles.searchGroup}>
            <MagnifyingGlass size={18} className={styles.searchIcon} />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Tìm theo tên hoặc địa điểm..."
            />
          </div>
        </div>
      </motion.div>

      <motion.div variants={rowVariants} className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h3>Danh sách nhà hàng</h3>
          <button className={styles.tableAction}>Xuất danh sách</button>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>THÔNG TIN NHÀ HÀNG</th>
              <th>ĐỊA ĐIỂM</th>
              <th>ĐÁNH GIÁ</th>
              <th>ẨM THỰC</th>
              <th>TRẠNG THÁI</th>
              <th style={{ textAlign: 'right' }}>THAO TÁC</th>
            </tr>
          </thead>
          {loading ? (
            <LoadingRows count={4} />
          ) : (
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontWeight: 600 }}>
                    Không tìm thấy kết quả phù hợp
                  </td>
                </tr>
              ) : paged.map((res, idx) => (
                <motion.tr key={res.id} variants={rowVariants} custom={idx}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <img src={res.image} alt="" style={{ width: '48px', height: '48px', borderRadius: '14px', objectFit: 'cover', border: '2px solid #f1f5f9' }} />
                      <div>
                        <p style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a', margin: '0 0 3px 0', fontFamily: "'Manrope', sans-serif" }}>{res.name}</p>
                        <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#cbd5e1', margin: 0 }}>#{res.id}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={16} style={{ color: '#94a3b8', flexShrink: 0 }} />
                      <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569' }}>{res.location}</span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Star size={16} weight="fill" style={{ color: '#f59e0b' }} />
                      <span style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a' }}>{res.rating}</span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8' }}>({res.reviews})</span>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${res.cuisine === 'VIỆT NAM' ? styles.bgOrange : styles.bgBlue}`}>{res.cuisine}</span>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${res.status === 'ĐANG MỞ' ? styles.bgEmerald : styles.bgAmber}`}>
                      <span className={styles.dot} style={{ backgroundColor: res.status === 'ĐANG MỞ' ? '#10b981' : '#f59e0b' }}></span>
                      {res.status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button className={styles.actionBtn}><Pencil size={17} /></button>
                      <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={() => handleDelete(res.id)}><Trash size={17} /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          )}
        </table>

        {/* Pagination */}
        <div className={styles.pagination}>
          <p className={styles.paginationInfo}>
            Hiển thị <span>{Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)}</span> của <span>{filtered.length}</span> nhà hàng
          </p>
          <div className={styles.paginationBtns}>
            <button className={styles.pageBtn} disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              <CaretLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`}
                onClick={() => setPage(p)}
              >{p}</button>
            ))}
            <button className={styles.pageBtn} disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
              <CaretRight size={16} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RestaurantsView;
