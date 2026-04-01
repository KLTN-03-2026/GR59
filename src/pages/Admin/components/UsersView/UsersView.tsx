import React, { useState, useMemo } from 'react';
import styles from '../_shared.module.scss';
import StatCard from '../StatCard/StatCard';
import { Envelope, Pencil, Trash, MagnifyingGlass, DotsThreeVertical, CheckCircle, XCircle, Clock, UserPlus, CaretLeft, CaretRight } from "@phosphor-icons/react";
import { motion } from 'framer-motion';
import { useDbUsers, deleteRecord } from '../../hooks/useAdminData';
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

const UsersView: React.FC = () => {
  const { data: users, loading, error, refetch } = useDbUsers();
  
  const [activeRoleFilter, setActiveRoleFilter] = useState<'All' | 'ADMIN' | 'USER'>('All');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const getRoleStyle = (role: string) => {
    switch (role) {
      case 'ADMIN': return styles.bgBlue;
      case 'EDITOR': return styles.bgPurple;
      default: return styles.bgSlate;
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'ACTIVE': return styles.bgEmerald;
      case 'BANNED': return styles.bgRed;
      default: return styles.bgAmber;
    }
  };

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'ACTIVE') return <CheckCircle size={13} weight="fill" />;
    if (status === 'BANNED') return <XCircle size={13} weight="fill" />;
    return <Clock size={13} weight="fill" />;
  };

  const statusLabel: Record<string, string> = { ACTIVE: 'Hoạt động', BANNED: 'Bị chặn', INACTIVE: 'Không hoạt động' };

  // ─── Filtered & Paginated ────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    let list = [...users];
    if (activeRoleFilter !== 'All') list = list.filter(u => u.role === activeRoleFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(u => u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
    }
    return list;
  }, [users, activeRoleFilter, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa người dùng này?')) return;
    try {
      await deleteRecord('users', id);
      refetch();
    } catch {
      alert('Xóa thất bại!');
    }
  };

  return (
    <motion.div className={styles.contentArea} initial="hidden" animate="visible" variants={containerVariants}>
      <motion.div variants={rowVariants} className={styles.pageHeader}>
        <div className={styles.pageTitle}>
          <h2>Quản lý Người dùng</h2>
          <p>Xem và quản lý tài khoản người dùng trên toàn hệ thống Travel AI</p>
        </div>
        <div className={styles.pageActions}>
          <button className={styles.btnPrimary}>
            <UserPlus size={18} weight="bold" />
            <span>Thêm người dùng</span>
          </button>
        </div>
      </motion.div>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      <motion.div variants={rowVariants} className={styles.statsGrid}>
        <StatCard label="TỔNG NGƯỜI DÙNG" value={loading ? '...' : String(users.length)} trend="+156 tuần này" trendUp={true} icon="Users" colorClass="bgBlue" />
        <StatCard label="ĐANG HOẠT ĐỘNG" value={loading ? '...' : String(users.filter(u => u.status === 'ACTIVE').length)} footerText="Trong 30 ngày qua" icon="UserCheck" colorClass="bgEmerald" />
        <StatCard label="YÊU CẦU DUYỆT" value="12" trend="Chờ xử lý" trendUp={true} icon="ClockCounterClockwise" colorClass="bgAmber" />
        <StatCard label="BỊ CHẶN" value={loading ? '...' : String(users.filter(u => u.status === 'BANNED').length)} trend="-4% tháng trước" trendUp={false} icon="ShieldWarning" colorClass="bgPurple" />
      </motion.div>

      <motion.div variants={rowVariants} className={styles.filterSection}>
        <div className={styles.filterHeader}>
          <div className={styles.tabGroup}>
            <button 
              className={`${styles.tab} ${activeRoleFilter === 'All' ? styles.tabActive : ''}`}
              onClick={() => { setActiveRoleFilter('All'); setPage(1); }}
            >Tất cả ({users.length})</button>
            <button 
              className={`${styles.tab} ${activeRoleFilter === 'ADMIN' ? styles.tabActive : ''}`}
              onClick={() => { setActiveRoleFilter('ADMIN'); setPage(1); }}
            >Quyền Admin</button>
            <button className={styles.tab}>Bị chặn ({users.filter(u => u.status === 'BANNED').length})</button>
          </div>
        </div>
        <div className={styles.filterRow}>
          <span className={styles.filterLabel}>Tìm:</span>
          <div className={styles.searchGroup}>
            <MagnifyingGlass size={18} className={styles.searchIcon} />
            <input 
              type="text" 
              placeholder="Tìm theo tên hoặc địa chỉ email..." 
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
            />
          </div>
          <select 
            className={styles.selectPill}
            value={activeRoleFilter}
            onChange={(e) => { setActiveRoleFilter(e.target.value as any); setPage(1); }}
          >
            <option value="All">Vai trò: Tất cả</option>
            <option value="ADMIN">Admin</option>
            <option value="USER">User</option>
          </select>
        </div>
      </motion.div>

      <motion.div variants={rowVariants} className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h3>Danh sách người dùng</h3>
          <button className={styles.tableAction}>Xuất danh sách</button>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>NGƯỜI DÙNG</th>
              <th>VAI TRÒ</th>
              <th>TRẠNG THÁI</th>
              <th>NGÀY THAM GIA</th>
              <th style={{ textAlign: 'right' }}>THAO TÁC</th>
            </tr>
          </thead>
          {loading ? (
            <LoadingRows count={5} />
          ) : (
            <tbody>
              {paged.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', fontWeight: 600 }}>
                    Không tìm thấy người dùng phù hợp
                  </td>
                </tr>
              ) : paged.map((user, idx) => (
                <motion.tr key={user.id} variants={rowVariants} custom={idx}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img src={`https://i.pravatar.cc/100?u=${user.id}`} alt="" style={{ width: '44px', height: '44px', borderRadius: '14px', objectFit: 'cover', border: '2px solid #f1f5f9' }} />
                      <div>
                        <p style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a', margin: '0 0 3px 0', fontFamily: "'Manrope', sans-serif" }}>{user.username}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <Envelope size={12} style={{ color: '#cbd5e1' }} />
                          <span style={{ fontSize: '0.8125rem', fontWeight: 500, color: '#94a3b8' }}>{user.email}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${getRoleStyle(user.role)}`}>{user.role}</span>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${getStatusStyle(user.status)}`}>
                      <StatusIcon status={user.status} />
                      {statusLabel[user.status]}
                    </span>
                  </td>
                  <td>
                    <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#475569', margin: 0 }}>
                      {new Date(user.createdAt).toLocaleDateString('vi-VN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', margin: '2px 0 0 0' }}>#{user.id}</p>
                  </td>
                  <td>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button className={styles.actionBtn}><Pencil size={17} /></button>
                      <button 
                        className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                        onClick={() => handleDelete(user.id)}
                      ><Trash size={17} /></button>
                      <button className={styles.actionBtn}><DotsThreeVertical size={17} weight="bold" /></button>
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
            Hiển thị <span>{Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–{Math.min(page * PAGE_SIZE, filtered.length)}</span> của <span>{filtered.length}</span> người dùng
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

export default UsersView;
