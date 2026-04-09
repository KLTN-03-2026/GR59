import React, { useState } from "react";
import styles from "./Sidebar.module.scss";
import {
  House,
  SquaresFour,
  Compass,
  Star,
  SignOut,
  CaretUp,
  CaretDown,
  UserCircle,
  MapTrifold,
} from "@phosphor-icons/react";
import { logo } from "../../../../assets/images/img";

const Sidebar: React.FC = () => {
  const [isUserOpen, setIsUserOpen] = useState(false);

  const menuItems = [
    { icon: House, label: "Trang chủ", active: false },
    { icon: SquaresFour, label: "Bảng điều khiển", active: true },
    { icon: Compass, label: "Khám phá", active: false },
    { icon: Star, label: "Đánh giá", active: false },
  ];

  return (
    <aside className={styles.sidebar}>
      {/* Brand Logo Section */}
      <div className={styles.brand}>
        <div className={styles.brandIcon}>
          <img src={logo} alt="Logo" className={styles.logoImg} />
          <span className={styles.brandSub}>Dashboard</span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className={styles.navMenu}>
        {menuItems.map((item, index) => (
          <a
            key={index}
            href="#"
            className={`${styles.navItem} ${item.active ? styles.active : ""}`}
          >
            <item.icon size={22} weight={item.active ? "fill" : "bold"} />
            <span>{item.label}</span>
          </a>
        ))}

        <div className={styles.navSectionTitle}>HỆ THỐNG</div>

        <a href="#" className={`${styles.navItem} ${styles.btnLogout}`}>
          <SignOut size={22} weight="bold" />
          <span>Đăng xuất</span>
        </a>
      </nav>

      {/* User Profile Footer */}
      <div className={styles.userProfile}>
        <div
          className={styles.userTrigger}
          onClick={() => setIsUserOpen(!isUserOpen)}
        >
          <img
            src="https://i.pravatar.cc/150?u=antigravity"
            alt="Avatar"
            className={styles.userAvatar}
          />
          <div className={styles.userInfo}>
            <span className={styles.userName}>Quang Long</span>
            <span className={styles.userEmail}>Pro Member</span>
          </div>
          {isUserOpen ? (
            <CaretDown size={16} weight="bold" />
          ) : (
            <CaretUp size={16} weight="bold" />
          )}
        </div>

        {isUserOpen && (
          <div className={styles.dropdownMenu}>
            <a href="#">
              <UserCircle size={18} /> Hồ sơ
            </a>
            <a href="#">
              <MapTrifold size={18} /> Lịch trình
            </a>
            <div className={styles.divider}></div>
            <a href="#" className={styles.logoutItem}>
              Thoát tài khoản
            </a>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
