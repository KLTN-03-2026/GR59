import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  Sparkle,
  CaretDown,
  UserCircle,
  MapTrifold,
  SignOut,
} from "phosphor-react";
import styles from "./Navbar.module.scss";
import { logo } from "../../../assets/images/img";

const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Temporary state for demonstration
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;
  const handleLogOut = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    console.log("User logged out");
    setIsLoggedIn(false);
    navigate("/auth");
  };
  return (
    <header
      className={styles.navbar}
      data-aos="fade-down"
      data-aos-duration="800"
    >
      <div className={styles.navContainer}>
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>
            <img src={logo} alt="Logo" className={styles.logoImg} />
          </div>
        </Link>

        <nav className={styles.navLinks}>
          <Link to="/" className={isActive("/") ? styles.active : ""}>
            Trang chủ
          </Link>
          <Link
            to="/explore"
            className={isActive("/explore") ? styles.active : ""}
          >
            Khám phá
          </Link>
          <Link
            to="/itinerary"
            className={isActive("/itinerary") ? styles.active : ""}
          >
            Lộ trình
          </Link>
          <Link
            to="/ai-suggestions"
            className={isActive("/ai-suggestions") ? styles.active : ""}
          >
            Gợi ý AI
          </Link>
          <Link to="/news" className={isActive("/news") ? styles.active : ""}>
            Tin tức
          </Link>
          <Link
            to="/review"
            className={isActive("/review") ? styles.active : ""}
          >
            Đánh giá
          </Link>
        </nav>

        <div className={styles.navActions}>
          {isLoggedIn ? (
            <div className={styles.userDropdown}>
              <div className={styles.userTrigger}>
                <img
                  src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
                  alt="User Avatar"
                />
                <span className={styles.userName}>Người dùng</span>
                <CaretDown weight="bold" />
              </div>
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownHeader}>
                  <span>Tài khoản</span>
                  <div className={styles.userDisplayName}>Người dùng</div>
                </div>
                <Link to="/profile">
                  <UserCircle size={20} /> Trang cá nhân
                </Link>
                <Link to="/planner">
                  <MapTrifold size={20} /> Lịch trình của tôi
                </Link>
                <Link to="/ai-suggestions">
                  <Sparkle size={20} /> Gợi ý từ AI
                </Link>
                <div className={styles.dropdownDivider}></div>
                <a
                  href="/"
                  onClick={handleLogOut}
                  className={styles.logoutItem}
                >
                  <SignOut size={20} /> Đăng xuất
                </a>
              </div>
            </div>
          ) : (
            <>
              <Link to="/auth" className={styles.loginBtn}>
                Đăng nhập
              </Link>
              <Link to="/auth" className={styles.ctaBtn}>
                Bắt đầu ngay
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
