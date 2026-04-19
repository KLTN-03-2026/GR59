import React from 'react';
import styles from '../_shared.module.scss';
import StatCard from '../StatCard/StatCard';
import { Download, Calendar } from "@phosphor-icons/react";
import { motion } from 'framer-motion';
import { useDashboardStats, useRecentActivity, usePopularLocations } from '../../hooks/useAdminData';
import { ErrorBanner, LoadingRows, SkeletonCards } from '../_shared/AdminFeedback';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
} as const;
const rowVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
} as const;

const DashboardView: React.FC = () => {
  const { data: stats, loading: statsLoading, error: statsError, refetch: refetchStats } = useDashboardStats();
  const { data: activities, loading: actLoading, error: actError, refetch: refetchAct } = useRecentActivity();
  const { data: locations, loading: locLoading, error: locError, refetch: refetchLoc } = usePopularLocations();

  const anyError = statsError || actError || locError;
  const anyRefetch = () => { refetchStats(); refetchAct(); refetchLoc(); };

  return (
    <motion.div className={styles.contentArea} initial="hidden" animate="visible" variants={containerVariants}>
      {/* ─── Header ─────────────────────── */}
      <motion.div variants={rowVariants} className={styles.pageHeader}>
        <div className={styles.pageTitle}>
          <h2>Bảng điều khiển tổng quan</h2>
          <p>Theo dõi hiệu suất hệ thống và hoạt động người dùng theo thời gian thực</p>
        </div>
        <div className={styles.pageActions}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 20px', background: 'white', borderRadius: '14px', border: '1px solid #f1f5f9', boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}>
            <Calendar size={18} style={{ color: '#94a3b8' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155' }}>30 ngày qua</span>
          </div>
          <button className={styles.btnPrimary}>
            <Download size={17} weight="bold" />
            <span>Xuất báo cáo</span>
          </button>
        </div>
      </motion.div>

      {/* ─── Error Banner ────────────────── */}
      {anyError && <ErrorBanner message={anyError} onRetry={anyRefetch} />}

      {/* ─── Stats Grid ─────────────────── */}
      <motion.div variants={rowVariants} className={styles.statsGrid}>
        {statsLoading
          ? <SkeletonCards count={4} />
          : stats.map(stat => (
            <StatCard
              key={stat.id}
              label={stat.label}
              value={stat.value}
              trend={stat.trend}
              trendUp={stat.trendUp}
              icon={stat.icon as any}
              colorClass={stat.colorClass}
              footerText={stat.footerText}
            />
          ))
        }
      </motion.div>

      {/* ─── Charts Row ─────────────────── */}
      <motion.div variants={rowVariants} style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '24px' }}>
        {/* Line Chart — static SVG (chart data kept static as is visual only) */}
        <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '40px', boxShadow: '0 1px 2px rgba(0,0,0,0.02), 0 4px 8px rgba(0,0,0,0.02)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '36px' }}>
            <div>
              <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em', margin: '0 0 6px 0' }}>Lượt truy cập theo tuần</h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500, margin: 0 }}>So sánh tuần này với tuần trước</p>
            </div>
            <div style={{ display: 'flex', gap: '20px' }}>
              {[{ label: 'Tuần này', color: '#2563eb' }, { label: 'Tuần trước', color: '#e2e8f0' }].map(l => (
                <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: l.color, display: 'block' }}></span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div style={{ height: '220px', position: 'relative' }}>
            <svg width="100%" height="100%" viewBox="0 0 700 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 50, 100, 150, 200].map(y => (
                <line key={y} x1="0" y1={y} x2="700" y2={y} stroke="#f8fafc" strokeWidth="1" />
              ))}
              <path d="M0,170 C100,175 200,130 300,145 C400,160 500,110 600,120 C650,125 700,140 700,140" fill="none" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6,6" />
              <path d="M0,150 C100,140 200,80 300,90 C400,100 500,40 600,25 C650,18 700,35 700,35 L700,200 L0,200 Z" fill="url(#blueGrad)" />
              <path d="M0,150 C100,140 200,80 300,90 C400,100 500,40 600,25 C650,18 700,35 700,35" fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
              {[[0, 150], [100, 140], [200, 80], [300, 90], [400, 100], [500, 40], [600, 25], [700, 35]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="5" fill="white" stroke="#2563eb" strokeWidth="2.5" />
              ))}
            </svg>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '12px', padding: '0 4px' }}>
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
                <span key={d} style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>{d}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Locations — fetched from DB */}
        <div style={{ background: 'white', borderRadius: '2rem', border: '1px solid #f1f5f9', padding: '40px', boxShadow: '0 1px 2px rgba(0,0,0,0.02), 0 4px 8px rgba(0,0,0,0.02)' }}>
          <h3 style={{ fontFamily: "'Manrope', sans-serif", fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.025em', margin: '0 0 6px 0' }}>Địa điểm phổ biến</h3>
          <p style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 500, margin: '0 0 32px 0' }}>Lượt tìm kiếm tháng này</p>
          {locLoading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ height: '32px', borderRadius: '8px', background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)', backgroundSize: '200% 100%', animation: `shimmer 1.4s ease-in-out ${i * 0.1}s infinite` }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {locations.map((loc, i) => (
                <motion.div key={loc.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: loc.color, display: 'block' }}></span>
                      <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#334155' }}>{loc.name}</span>
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 800, color: loc.color }}>{loc.value}</span>
                  </div>
                  <div style={{ height: '8px', backgroundColor: '#f8fafc', borderRadius: '999px', overflow: 'hidden' }}>
                    <motion.div
                      style={{ height: '100%', backgroundColor: loc.color, borderRadius: '999px' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${loc.pct}%` }}
                      transition={{ duration: 0.8, delay: 0.1 * i, ease: 'easeOut' }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>

      {/* ─── Recent Activity Table ─────── */}
      <motion.div variants={rowVariants} className={styles.tableContainer}>
        <div className={styles.tableHeader}>
          <h3>Hoạt động gần đây</h3>
          <button className={styles.tableAction}>Xem tất cả</button>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>THỜI GIAN</th>
              <th>NGƯỜI DÙNG</th>
              <th>HÀNH ĐỘNG</th>
              <th>TRẠNG THÁI</th>
            </tr>
          </thead>
          {actLoading ? (
            <LoadingRows count={5} />
          ) : (
            <tbody>
              {activities.map((act, _idx) => (
                <motion.tr key={act.id} variants={rowVariants}>
                  <td>
                    <p style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a', margin: '0 0 2px 0' }}>{act.time}</p>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', margin: 0 }}>{act.date}</p>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <img src={`https://i.pravatar.cc/100?u=${act.avatarId}`} alt="" style={{ width: '40px', height: '40px', borderRadius: '14px', border: '2px solid #f1f5f9', objectFit: 'cover' }} />
                      <div>
                        <p style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a', margin: '0 0 2px 0', fontFamily: "'Manrope', sans-serif" }}>{act.user}</p>
                        <p style={{ fontSize: '0.75rem', fontWeight: 500, color: '#94a3b8', margin: 0 }}>{act.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#475569', margin: 0 }}>{act.action}</p>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${styles[act.color as keyof typeof styles]}`}>{act.status}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          )}
        </table>
      </motion.div>
    </motion.div>
  );
};

export default DashboardView;
