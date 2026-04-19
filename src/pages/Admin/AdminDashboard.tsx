import React, { useState, useEffect } from 'react';
import styles from './AdminDashboard.module.scss';
import Sidebar from './components/Sidebar/Sidebar';
import Topbar from './components/Topbar/Topbar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import DashboardView from './components/DashboardView/DashboardView';
import DestinationsView from './components/DestinationsView/DestinationsView';
import HotelsView from './components/HotelsView/HotelsView';
import RestaurantsView from './components/RestaurantsView/RestaurantsView';
import UsersView from './components/UsersView/UsersView';
import NewsView from './components/NewsView/NewsView';
import SettingsView from './components/SettingsView/SettingsView';
import { AnimatePresence, motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('dashboard');
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    AOS.init({ duration: 600, once: true, easing: 'ease-out-quad' });

    // Role-based access control check
    const userStr = localStorage.getItem("user");
    if (!userStr) {
      toast.warn("Vui lòng đăng nhập để tiếp tục!");
      navigate("/auth");
      return;
    }

    try {
      const parsedUser = JSON.parse(userStr);
      setUser(parsedUser);
      // Backend trả về role là 'USER' hoặc 'ADMIN'
      const userRole = (parsedUser.role || "").toUpperCase();
      
      if (userRole === 'USER') {
        toast.error("Bạn không có quyền truy cập trang quản trị!");
        navigate("/");
        setIsAuthorized(false);
      } else if (userRole === 'ADMIN') {
        setIsAuthorized(true);
      } else {
        // Trường hợp không có role hoặc role không hợp lệ
        toast.warn("Phiên đăng nhập không hợp lệ, vui lòng đăng nhập lại!");
        navigate("/auth");
        setIsAuthorized(false);
      }
    } catch (e) {
      console.error("Error parsing user data:", e);
      navigate("/auth");
      setIsAuthorized(false);
    }
  }, [navigate]);

  if (isAuthorized === null) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>
        <p style={{ color: '#64748b', fontWeight: 600 }}>Đang kiểm tra quyền truy cập...</p>
      </div>
    );
  }

  if (isAuthorized === false) return null;

  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'destinations':
        return <DestinationsView />;
      case 'hotels':
        return <HotelsView />;
      case 'restaurants':
        return <RestaurantsView />;
      case 'users':
        return <UsersView />;
      case 'news':
        return <NewsView />;
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
      destinations: 'Địa điểm',
      hotels: 'Khách sạn',
      restaurants: 'Nhà hàng',
      users: 'Người dùng',
      news: 'Bài viết',
      settings: 'Cài đặt',
    };
    return titles[activeView] || 'Hệ thống';
  };

  return (
    <div className={styles.adminContainer}>
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      <main className={styles.mainContent}>
        <Topbar viewTitle={getTitle()} user={user} />
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
