import React from 'react';
import styles from './Sidebar.module.scss';
import { motion } from 'framer-motion';
import { 
  Compass, 
  SquaresFour, 
  ForkKnife, 
  Bed, 
  Users, 
  Gear, 
  SignOut,
  Article,
  ChatCircleText
} from "@phosphor-icons/react";

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Tổng Quan', icon: SquaresFour },
    { id: 'destinations', label: 'Địa điểm', icon: Compass },
    { id: 'restaurants', label: 'Nhà hàng', icon: ForkKnife },
    { id: 'hotels', label: 'Khách sạn', icon: Bed },
    { id: 'users', label: 'Người dùng', icon: Users },
    { id: 'news', label: 'Bài viết', icon: Article },
    { id: 'reviews', label: 'Đánh giá', icon: ChatCircleText },
    { id: 'settings', label: 'Cài đặt', icon: Gear },
  ];

  return (
    <aside className={styles.sidebar} data-aos="fade-right">
      <div className={styles.sidebarLogo}>
        <div className={styles.logoContainer}>
          <Compass size={28} weight="fill" />
        </div>
        <div className={styles.logoText}>
          <h1>Travel Portal</h1>
          <p>Super Admin System</p>
        </div>
      </div>

      <nav className={styles.nav}>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`${styles.sidebarItem} ${activeView === item.id ? styles.active : ''}`}
          >
            {activeView === item.id && (
              <motion.div 
                layoutId="activeIndicator"
                className={styles.activeIndicator} 
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            <item.icon size={22} weight={activeView === item.id ? "fill" : "regular"} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className={styles.sidebarFooter}>
        <button className={styles.logoutBtn}>
          <SignOut size={22} weight="bold" />
          <span>Đăng xuất hệ thống</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
