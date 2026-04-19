import React, { useState, useMemo } from 'react';
import styles from './HotelsView.module.scss';
import StatCard from '../StatCard/StatCard';
import { MapPin, Star, Pencil, Plus, CaretLeft, CaretRight, Trash, MagnifyingGlass, FileArrowDown, Check, Eye } from "@phosphor-icons/react";
import { motion, AnimatePresence } from 'framer-motion';
import { useHotels, deleteRecord, createRecord, updateRecord } from '../../hooks/useAdminData';
import { ErrorBanner, LoadingRows } from '../_shared/AdminFeedback';
import AddEditModal from '../_shared/AddEditModal';
import DetailModal from '../_shared/DetailModal';
import { toast } from 'react-toastify';

const PAGE_SIZE = 10;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
} as const;
const rowVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
} as const;

const HotelsView: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data: hotels, pagination, loading, error, refetch } = useHotels();
  const [search, setSearch] = useState('');

  // Debounce search để tránh gọi API quá nhiều
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset về trang 1 khi tìm kiếm
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // Gọi lại API khi trang hoặc search thay đổi
  React.useEffect(() => {
    refetch(page - 1, PAGE_SIZE, debouncedSearch);
  }, [page, debouncedSearch]);

  const [activeTab, setActiveTab] = useState<'all' | 'ACTIVE' | 'MAINTENANCE'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | number | null>(null);

  // ─── derived stats ───────────────────────────────────────────────────────────
  // Lưu ý: stats này hiện tại chỉ tính trên trang hiện tại. 
  // Để chính xác tuyệt đối cần API summary từ BE.
  const totalActive = hotels.filter(h => h.status === 'ACTIVE' || h.status === 'HOẠT ĐỘNG').length;
  const totalMaintain = hotels.filter(h => h.status === 'MAINTENANCE' || h.status === 'BẢO TRÌ').length;

  const filtered = useMemo(() => {
    let list = [...hotels];
    if (activeTab !== 'all') {
      list = list.filter(h => h.status === activeTab);
    }
    // Search đã được thực hiện ở Server, không cần lọc local nữa
    return list;
  }, [hotels, activeTab]);

  const totalPages = pagination.totalPages || 1;
  const paged = filtered; // Vì đã phân trang ở Server, ta hiển thị toàn bộ list lọc được trên trang đó

  const handleDelete = async (id: string | number) => {
    if (!confirm('Bạn có chắc muốn xóa khách sạn này không?')) return;
    try {
      await deleteRecord('hotels', id);
      toast.success('Đã xóa khách sạn');
      refetch();
    } catch {
      toast.error('Xóa thất bại!');
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Tên khách sạn', 'Vị trí', 'Đánh giá', 'Lượt reviews', 'Loại hình', 'Giá', 'Trạng thái'];
    const rows = filtered.map(h => [
      h.id,
      `"${h.name}"`,
      `"${h.location}"`,
      h.rating,
      h.reviewCount,
      `"${h.category || 'N/A'}"`,
      `"${h.averagePrice?.toLocaleString()}đ"`,
      h.status
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `hotels_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSave = async (data: any) => {
    try {
      if (editingItem) {
        await updateRecord('hotels', editingItem.id, data);
        toast.success('Cập nhật khách sạn thành công');
      } else {
        await createRecord('hotels', data);
        toast.success('Thêm khách sạn thành công');
      }
      setIsModalOpen(false);
      setEditingItem(null);
      refetch();
    } catch {
      toast.error('Thao tác thất bại!');
    }
  };

  const categoryMap: Record<string, string> = {
    'LUXURY': 'Hạng sang',
    'RESORT': 'Nghỉ dưỡng',
    'BOUTIQUE': 'Độc đáo',
    'BUDGET': 'Bình dân',
    'BUSINESS': 'Công tác',
    'HOMESTAY': 'Homestay',
    'VILLA': 'Biệt thự'
  };

  return (
    <motion.div className={styles.contentArea} initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div variants={rowVariants} className={styles.pageHeader}>
        <div className={styles.pageTitle}>
          <h2>Quản lý Khách sạn</h2>
          <p>Theo dõi và quản lý toàn bộ cơ sở lưu trú trên hệ thống</p>
        </div>
        <div className={styles.pageActions}>
          <button className={styles.btnExport} onClick={handleExportCSV} title="Xuất CSV">
            <FileArrowDown size={22} weight="bold" />
          </button>
          <button className={styles.btnPrimary} onClick={() => { setEditingItem(null); setIsModalOpen(true); }}>
            <Plus size={18} weight="bold" />
            <span>Thêm khách sạn</span>
          </button>
        </div>
      </motion.div>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      <motion.div variants={rowVariants} className={styles.statsGrid}>
        <StatCard label="TỔNG KHÁCH SẠN" value={loading ? '...' : String(pagination.totalElements || hotels.length)} trend="+12% tháng này" trendUp={true} icon="Bed" colorClass="bgBlue" />
        <StatCard label="HOẠT ĐỘNG" value={loading ? '...' : String(totalActive)} footerText="Đang vận hành" icon="CheckCircle" colorClass="bgEmerald" />
        <StatCard label="BẢO TRÌ" value={loading ? '...' : String(totalMaintain)} trend="Theo lịch trình" trendUp={true} icon="Wrench" colorClass="bgAmber" />
        <StatCard label="YÊU CẦU MỚI" value="92" trend="Chờ phê duyệt" trendUp={true} icon="Storefront" colorClass="bgPurple" />
      </motion.div>

      <motion.div variants={rowVariants} className={styles.filterSection}>
        <div className={styles.filterHeader}>
          <div className={styles.tabGroup}>
            <button
              className={`${styles.tab} ${activeTab === 'all' ? styles.tabActive : ''}`}
              onClick={() => { setActiveTab('all'); setPage(1); }}
            >Tất cả ({pagination.totalElements || hotels.length})</button>
            <button
              className={`${styles.tab} ${activeTab === 'ACTIVE' ? styles.tabActive : ''}`}
              onClick={() => { setActiveTab('ACTIVE'); setPage(1); }}
            >Đang hoạt động</button>
            <button
              className={`${styles.tab} ${activeTab === 'MAINTENANCE' ? styles.tabActive : ''}`}
              onClick={() => { setActiveTab('MAINTENANCE'); setPage(1); }}
            >Bảo trì</button>
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
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '60px' }}>STT</th>
              <th>THÔNG TIN KHÁCH SẠN</th>
              <th>ĐỊA ĐIỂM</th>
              <th>ĐÁNH GIÁ</th>
              <th>PHONG CÁCH</th>
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
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontWeight: 600 }}>
                    Không tìm thấy kết quả phù hợp
                  </td>
                </tr>
              ) : paged.map((hotel, idx) => (
                <motion.tr key={hotel.id} variants={rowVariants} custom={idx}>
                  <td style={{ fontWeight: 600, color: '#64748b' }}>
                    #{(page - 1) * PAGE_SIZE + idx + 1}
                  </td>
                  <td>
                    <div className={styles.infoCol}>
                      <div className={styles.imgWrapper}>
                        <img src={hotel.imageUrl} alt="" />
                        <span 
                          className={styles.statusIndicator} 
                          style={{ backgroundColor: (hotel.status === 'ACTIVE' || hotel.status === 'HOẠT ĐỘNG') ? '#10b981' : '#f59e0b' }}
                        ></span>
                      </div>
                      <div className={styles.textInfo}>
                        <p>{hotel.name}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.locationCol}>
                      <MapPin size={16} color="#94a3b8" />
                      <span>{hotel.location}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.ratingCol}>
                      <Star size={16} weight="fill" color="#f59e0b" />
                      <span>{hotel.rating}</span>
                      <span>({hotel.reviewCount})</span>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles.bgPurple}`}>
                      {hotel.category && categoryMap[hotel.category] ? categoryMap[hotel.category] : (hotel.category || 'PHỔ THÔNG')}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${(hotel.status === 'ACTIVE' || hotel.status === 'HOẠT ĐỘNG') ? styles.bgEmerald : styles.bgAmber}`}>
                      <span className={styles.dot} style={{ backgroundColor: (hotel.status === 'ACTIVE' || hotel.status === 'HOẠT ĐỘNG') ? '#10b981' : '#f59e0b' }}></span>
                      {(hotel.status === 'ACTIVE' || hotel.status === 'HOẠT ĐỘNG') ? 'HOẠT ĐỘNG' : 'BẢO TRÌ'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                      <button 
                        className={styles.actionBtn} 
                        onClick={() => { setDetailId(hotel.id); setIsDetailOpen(true); }}
                        title="Xem chi tiết"
                      >
                        <Eye size={24} weight="bold" />
                      </button>
                      <button className={styles.actionBtn} onClick={() => { setEditingItem(hotel); setIsModalOpen(true); }}>
                        <Pencil size={24} weight="bold" />
                      </button>
                      <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={() => handleDelete(hotel.id)}>
                        <Trash size={24} weight="bold" />
                      </button>
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
            Hiển thị <span>{Math.min((page - 1) * PAGE_SIZE + 1, pagination.totalElements)}–{Math.min(page * PAGE_SIZE, pagination.totalElements)}</span> của <span>{pagination.totalElements}</span> kết quả
          </p>
          <div className={styles.paginationBtns}>
            <button className={styles.pageBtn} disabled={page === 1} onClick={() => setPage(p => p - 1)}>
              <CaretLeft size={20} weight="bold" />
            </button>
            <button className={`${styles.pageBtn} ${styles.pageBtnActive}`}>{page}</button>
            <button className={styles.pageBtn} disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>
              <CaretRight size={20} weight="bold" />
            </button>
          </div>
        </div>
        <DetailModal 
        isOpen={isDetailOpen} 
        onClose={() => setIsDetailOpen(false)} 
        id={detailId} 
        type="hotel" 
      />
    </motion.div>

      <AddEditModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
        title={editingItem ? 'Cập nhật khách sạn' : 'Thêm khách sạn mới'}
        type="hotel"
        initialData={editingItem}
      />
    </motion.div>
  );
};

export default HotelsView;


