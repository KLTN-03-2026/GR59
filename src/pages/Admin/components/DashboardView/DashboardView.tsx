import React from 'react';
import styles from './DashboardView.module.scss';
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
          <div className={styles.datePickerBox}>
            <Calendar size={18} color="#94a3b8" />
            <span>30 ngày qua</span>
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
      <motion.div variants={rowVariants} className={styles.chartsRow}>
        {/* Line Chart — static SVG */}
        <div className={styles.chartCard}>
          <div className={styles.chartHeader}>
            <div>
              <h3>Lượt truy cập theo tuần</h3>
              <p>So sánh tuần này với tuần trước</p>
            </div>
            <div className={styles.chartLegend}>
              {[{ label: 'Tuần này', color: '#38BDF8' }, { label: 'Tuần trước', color: '#e2e8f0' }].map(l => (
                <div key={l.label} className={styles.legendItem}>
                  <span className={styles.dot} style={{ backgroundColor: l.color }}></span>
                  <span>{l.label}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.chartContainer}>
            <svg width="100%" height="100%" viewBox="0 0 700 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 50, 100, 150, 200].map(y => (
                <line key={y} x1="0" y1={y} x2="700" y2={y} stroke="#f8fafc" strokeWidth="1" />
              ))}
              <path d="M0,170 C100,175 200,130 300,145 C400,160 500,110 600,120 C650,125 700,140 700,140" fill="none" stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6,6" />
              <path d="M0,150 C100,140 200,80 300,90 C400,100 500,40 600,25 C650,18 700,35 700,35 L700,200 L0,200 Z" fill="url(#blueGrad)" />
              <path d="M0,150 C100,140 200,80 300,90 C400,100 500,40 600,25 C650,18 700,35 700,35" fill="none" stroke="#38BDF8" strokeWidth="3" strokeLinecap="round" />
              {[[0, 150], [100, 140], [200, 80], [300, 90], [400, 100], [500, 40], [600, 25], [700, 35]].map(([x, y], i) => (
                <circle key={i} cx={x} cy={y} r="5" fill="white" stroke="#38BDF8" strokeWidth="2.5" />
              ))}
            </svg>
            <div className={styles.chartXAxis}>
              {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(d => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Locations — fetched from DB */}
        <div className={styles.locationCard}>
          <h3>Địa điểm phổ biến</h3>
          <p>Lượt tìm kiếm tháng này</p>
          {locLoading ? (
            <div className={styles.locationList}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={styles.shimmerBox} style={{ animationDelay: `${i * 0.1}s` }} />
              ))}
            </div>
          ) : (
            <div className={styles.locationList}>
              {locations.map((loc, i) => (
                <motion.div key={loc.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }} className={styles.locationItem}>
                  <div className={styles.locationInfo}>
                    <div className={styles.nameBox}>
                      <span className={styles.dot} style={{ backgroundColor: loc.color }}></span>
                      <span>{loc.name}</span>
                    </div>
                    <span className={styles.value} style={{ color: loc.color }}>{loc.value}</span>
                  </div>
                  <div className={styles.progressBar}>
                    <motion.div
                      className={styles.progressFill}
                      style={{ backgroundColor: loc.color }}
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
              {activities.map((act, idx) => (
                <motion.tr key={act.id} variants={rowVariants}>
                  <td className={styles.timeCol}>
                    <p>{act.time}</p>
                    <p>{act.date}</p>
                  </td>
                  <td>
                    <div className={styles.userCol}>
                      <img src={`https://i.pravatar.cc/100?u=${act.avatarId}`} alt="" />
                      <div className={styles.userInfo}>
                        <p>{act.user}</p>
                        <p>{act.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    <p className={styles.actionText}>{act.action}</p>
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

