import React, { useState, useEffect } from 'react';
import styles from './AdminDashboard.module.scss';
import Sidebar from './components/Sidebar/Sidebar';
import Topbar from './components/Topbar/Topbar';
import DashboardView from './components/DashboardView/DashboardView';
import HotelsView from './components/HotelsView/HotelsView';
import RestaurantsView from './components/RestaurantsView/RestaurantsView';
import UsersView from './components/UsersView/UsersView';
import SettingsView from './components/SettingsView/SettingsView';
import { AnimatePresence, motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AdminDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState('dashboard');

  useEffect(() => {
    AOS.init({ duration: 600, once: true, easing: 'ease-out-quad' });
  }, []);

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'hotels':
        return <HotelsView />;
      case 'restaurants':
        return <RestaurantsView />;
      case 'users':
        return <UsersView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <div className={styles.contentArea}>
            <h1 style={{ fontFamily: "'Manrope', sans-serif", fontSize: '2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.04em' }}>
              {activeView.charAt(0).toUpperCase() + activeView.slice(1)}
            </h1>
            <p style={{ color: '#64748b', fontWeight: 600, fontSize: '1rem' }}>Tính năng này đang được phát triển...</p>
          </div>
        );
    }
  };

  const getTitle = () => {
    const titles: Record<string, string> = {
      dashboard: 'Tổng quan',
      hotels: 'Khách sạn',
      restaurants: 'Nhà hàng',
      users: 'Người dùng',
      settings: 'Cài đặt',
    };
    return titles[activeView] || 'Hệ thống';
  };

  return (
    <div className={styles.adminContainer}>
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <main className={styles.mainContent}>
        <Topbar viewTitle={getTitle()} />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default AdminDashboard;
