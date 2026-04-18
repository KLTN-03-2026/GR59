import React, { useState, useMemo } from 'react';
import styles from './DestinationsView.module.scss';
import StatCard from '../StatCard/StatCard';
import { MapPin, Star, Pencil, Plus, CaretLeft, CaretRight, Trash, MagnifyingGlass, Globe, FileArrowDown, Check } from "@phosphor-icons/react";
import { motion, AnimatePresence } from 'framer-motion';
import { useDestinations, deleteRecord, createRecord, updateRecord } from '../../hooks/useAdminData';
import { ErrorBanner, LoadingRows } from '../_shared/AdminFeedback';
import AddEditModal from '../_shared/AddEditModal';
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

const DestinationsView: React.FC = () => {
  const [page, setPage] = useState(1);
  const { data: destinations, pagination, loading, error, refetch } = useDestinations();

  // Gọi lại API khi trang thay đổi
  React.useEffect(() => {
    refetch(page - 1, PAGE_SIZE);
  }, [page]);

  const [activeTab, setActiveTab] = useState<'all' | 'ACTIVE' | 'MAINTENANCE'>('all');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  // Stats
  const totalActive = destinations.filter(d => d.status === 'ACTIVE').length;

  // Filter & Pagination
  const filtered = useMemo(() => {
    let list = [...destinations];
    if (activeTab !== 'all') list = list.filter(d => d.status === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(d => d.name.toLowerCase().includes(q) || d.location.toLowerCase().includes(q));
    }
    return list;
  }, [destinations, activeTab, search]);

  const totalPages = pagination.totalPages || 1;
  const paged = filtered; // Vì đã phân trang ở Server, hiển thị toàn bộ list lọc được

  const handleDelete = async (id: string | number) => {
    if (!confirm('Bạn có chắc muốn xóa địa điểm này không?')) return;
    try {
      await deleteRecord('destinations', id);
      toast.success('Đã xóa địa điểm thành công');
      refetch();
    } catch {
      toast.error('Xóa thất bại!');
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Tiêu đề', 'Vị trí', 'Đánh giá', 'Lượt reviews', 'Danh mục', 'Trạng thái'];
    const rows = filtered.map(d => [
      d.id,
      `"${d.name}"`,
      `"${d.location}"`,
      d.rating,
      `"${d.reviewCount}"`,
      `"${d.category}"`,
      d.status
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `destinations_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSave = async (data: any) => {
    try {
      if (editingItem) {
        await updateRecord('destinations', editingItem.id, data);
        toast.success('Cập nhật địa điểm thành công');
      } else {
        await createRecord('destinations', data);
        toast.success('Thêm địa điểm mới thành công');
      }
      setIsModalOpen(false);
      setEditingItem(null);
      refetch();
    } catch {
      toast.error('Thao tác thất bại!');
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  return (
    <motion.div className={styles.contentArea} initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div variants={rowVariants} className={styles.pageHeader}>
        <div className={styles.pageTitle}>
          <h2>Quản lý Địa điểm</h2>
          <p>Tùy chỉnh và cập nhật các điểm đến du lịch trên toàn lãnh thổ</p>
        </div>
        <div className={styles.pageActions}>
          <button className={styles.btnExport} onClick={handleExportCSV} title="Xuất CSV">
            <FileArrowDown size={22} weight="bold" />
          </button>
          <button className={styles.btnPrimary} onClick={openAddModal}>
            <Plus size={18} weight="bold" />
            <span>Thêm địa điểm</span>
          </button>
        </div>
      </motion.div>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      <motion.div variants={rowVariants} className={styles.statsGrid}>
        <StatCard label="TỔNG ĐIỂM ĐẾN" value={loading ? '...' : String(destinations.length)} trend="+5 tháng này" trendUp={true} icon="MapPin" colorClass="bgBlue" />
        <StatCard label="HOẠT ĐỘNG" value={loading ? '...' : String(totalActive)} footerText="Đang đón khách" icon="CheckCircle" colorClass="bgEmerald" />
        <StatCard label="VÙNG MIỀN" value="3" trend="Miền Bắc, Trung, Nam" trendUp={true} icon="Globe" colorClass="bgPurple" />
        <StatCard label="DI SẢN" value="8" trend="UNESCO công nhận" trendUp={true} icon="Buildings" colorClass="bgAmber" />
      </motion.div>

      <motion.div variants={rowVariants} className={styles.filterSection}>
        <div className={styles.filterHeader}>
          <div className={styles.tabGroup}>
            <button
              className={`${styles.tab} ${activeTab === 'all' ? styles.tabActive : ''}`}
              onClick={() => { setActiveTab('all'); setPage(1); }}
            >Tất cả ({pagination.totalElements || destinations.length})</button>
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
          <span className={styles.filterLabel}>Tìm kiếm:</span>
          <div className={styles.searchGroup}>
            <MagnifyingGlass size={18} className={styles.searchIcon} />
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Tìm tên địa điểm hoặc tỉnh thành..."
            />
          </div>
        </div>
      </motion.div>

      <motion.div variants={rowVariants} className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: '60px' }}>STT</th>
              <th>THÔNG TIN ĐỊA ĐIỂM</th>
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
                    Không tìm thấy địa điểm nào
                  </td>
                </tr>
              ) : paged.map((dest, idx) => (
                <motion.tr key={dest.id} variants={rowVariants} custom={idx}>
                  <td style={{ fontWeight: 600, color: '#64748b' }}>
                    #{(page - 1) * PAGE_SIZE + idx + 1}
                  </td>
                  <td>
                    <div className={styles.infoCol}>
                      <div className={styles.imgWrapper}>
                        <img src={dest.imageUrl} alt="" />
                        <span 
                          className={styles.statusIndicator} 
                          style={{ backgroundColor: dest.status === 'HOẠT ĐỘNG' ? '#10b981' : '#f59e0b' }}
                        ></span>
                      </div>
                      <div className={styles.textInfo}>
                        <p>{dest.name}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className={styles.locationCol}>
                      <MapPin size={16} color="#94a3b8" />
                      <span>{dest.location}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.ratingCol}>
                      <Star size={16} weight="fill" color="#f59e0b" />
                      <span>{dest.rating}</span>
                      <span>({dest.reviewCount})</span>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles.bgPurple}`}>{dest.category || 'PHỔ THÔNG'}</span>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${dest.status === 'ACTIVE' ? styles.bgEmerald : styles.bgAmber}`}>
                      <span className={styles.dot} style={{ backgroundColor: dest.status === 'ACTIVE' ? '#10b981' : '#f59e0b' }}></span>
                      {dest.status === 'ACTIVE' ? 'HOẠT ĐỘNG' : 'BẢO TRÌ'}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                      <button className={styles.actionBtn} onClick={() => openEditModal(dest)}>
                        <Pencil size={24} weight="bold" />
                      </button>
                      <button className={`${styles.actionBtn} ${styles.actionBtnDanger}`} onClick={() => handleDelete(dest.id)}>
                        <Trash size={24} weight="bold" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          )}
        </table>

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
      </motion.div>

      <AddEditModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSave} 
        title={editingItem ? 'Chỉnh sửa địa điểm' : 'Thêm địa điểm mới'}
        type="destination"
        initialData={editingItem}
      />
    </motion.div>
  );
};

export default DestinationsView;


