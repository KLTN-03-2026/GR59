import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sparkle,
  CaretDown,
  UserCircle,
  MapTrifold,
  SignOut,
  List,
  X,
  House,
  Compass,
  BookOpen,
  Newspaper,
  Star,
  FacebookLogo,
  InstagramLogo,
  YoutubeLogo,
} from "phosphor-react";
import { toast } from "react-toastify"; // Đảm bảo đã import toast
import styles from "./Navbar.module.scss";
import { logo } from "../../../assets/images/img";
import { postLogout } from "../../../services/userService";

const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem("token");
    return !!token;
  });
  const [username, setUsername] = useState(() => {
    return localStorage.getItem("username") || "";
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Kiểm tra trạng thái đăng nhập mỗi khi đường dẫn (location) thay đổi
  // 2. Cập nhật state khi chuyển hướng trang
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username") || "Người dùng";

    const hasToken = !!token;

    // Chỉ cập nhật nếu giá trị thực tế khác với giá trị trong State hiện tại
    if (hasToken !== isLoggedIn) {
      setIsLoggedIn(hasToken);
    }

    if (storedUsername !== username) {
      setUsername(storedUsername);
    }
    
    // Close mobile menu on route change
    setIsMenuOpen(false);
  }, [location]);
  const isActive = (path: string) => location.pathname === path;

  const handleLogOut = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    try {
      // 1. Gọi API đăng xuất để BE xóa Session/Cookie/RefreshToken
      const refreshToken = localStorage.getItem("refreshToken") || "";
      await postLogout(refreshToken);
    } catch (error) {
      console.error("Lỗi khi gọi API đăng xuất:", error);
      // Vẫn tiếp tục xóa LocalStorage ở dưới để đảm bảo người dùng thoát được giao diện
    } finally {
      // 2. Xóa sạch dữ liệu trong LocalStorage
      localStorage.clear();

      // 3. Cập nhật state
      setIsLoggedIn(false);

      // 4. Thông báo và điều hướng
      toast.info("Đã đăng xuất thành công!");
      navigate("/auth");
    }
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
            to="/sample"
            className={isActive("/sample") ? styles.active : ""}
          >
            Lịch trình mẫu
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
                {/* Sử dụng UI Avatars để tạo ảnh đại diện theo tên cho đẹp */}
                <img
                  src={`https://ui-avatars.com/api/?name=${username}&background=random&color=fff`}
                  alt="User Avatar"
                />
                <span className={styles.userName}>{username}</span>
                <CaretDown weight="bold" />
              </div>
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownHeader}>
                  <span>Tài khoản</span>
                  <div className={styles.userDisplayName}>{username}</div>
                </div>
                <Link to="/profile" className={styles.dropdownItem}>
                  <UserCircle size={20} /> Trang cá nhân
                </Link>
                <Link to="/dashboard" className={styles.dropdownItem}>
                  <MapTrifold size={20} /> Lịch trình của tôi
                </Link>
                <Link to="/ai-suggestions" className={styles.dropdownItem}>
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
            <div className={styles.authGroup}>
              <Link to="/auth" className={styles.loginBtn}>
                Đăng nhập
              </Link>
              <Link to="/auth" className={styles.ctaBtn}>
                Bắt đầu ngay
              </Link>
            </div>
          )}
        </div>

        {/* Hamburger Menu Button */}
        {!isMenuOpen && (
          <button 
            className={styles.mobileMenuBtn} 
            onClick={() => setIsMenuOpen(true)}
            aria-label="Mở menu"
          >
            <List size={28} weight="bold" />
          </button>
        )}

        {/* Mobile Menu Drawer */}
        <div className={`${styles.mobileDrawer} ${isMenuOpen ? styles.open : ""}`}>
          <div className={styles.mobileDrawerContent}>
            {/* Drawer Header */}
            <div className={styles.drawerHeader}>
              <button className={styles.drawerCloseBtn} onClick={() => setIsMenuOpen(false)}>
                <X size={24} weight="bold" />
              </button>
            </div>

            <nav className={styles.mobileNavLinks}>
              <Link to="/" className={isActive("/") ? styles.active : ""} onClick={() => setIsMenuOpen(false)}>
                <House size={22} weight={isActive("/") ? "fill" : "bold"} />
                <span>Trang chủ</span>
              </Link>
              <Link to="/explore" className={isActive("/explore") ? styles.active : ""} onClick={() => setIsMenuOpen(false)}>
                <Compass size={22} weight={isActive("/explore") ? "fill" : "bold"} />
                <span>Khám phá</span>
              </Link>
              <Link to="/sample" className={isActive("/sample") ? styles.active : ""} onClick={() => setIsMenuOpen(false)}>
                <BookOpen size={22} weight={isActive("/sample") ? "fill" : "bold"} />
                <span>Lịch trình mẫu</span>
              </Link>
              <Link to="/news" className={isActive("/news") ? styles.active : ""} onClick={() => setIsMenuOpen(false)}>
                <Newspaper size={22} weight={isActive("/news") ? "fill" : "bold"} />
                <span>Tin tức</span>
              </Link>
              <Link to="/review" className={isActive("/review") ? styles.active : ""} onClick={() => setIsMenuOpen(false)}>
                <Star size={22} weight={isActive("/review") ? "fill" : "bold"} />
                <span>Đánh giá</span>
              </Link>
            </nav>

            <div className={styles.mobileAuthActions}>
              {isLoggedIn ? (
                <div className={styles.mobileAccountBox}>
                  <div className={styles.accountLabel}>TÀI KHOẢN</div>
                  <Link to="/profile" className={styles.mobileMenuItem} onClick={() => setIsMenuOpen(false)}>
                    <UserCircle size={22} weight="bold" /> 
                    <span>Trang cá nhân</span>
                  </Link>
                  <Link to="/dashboard" className={styles.mobileMenuItem} onClick={() => setIsMenuOpen(false)}>
                    <MapTrifold size={22} weight="bold" /> 
                    <span>Lịch trình của tôi</span>
                  </Link>
                  <a href="/" onClick={(e) => { handleLogOut(e); setIsMenuOpen(false); }} className={`${styles.mobileMenuItem} ${styles.logout}`}>
                    <SignOut size={22} weight="bold" /> 
                    <span>Đăng xuất</span>
                  </a>
                </div>
              ) : (
                <div className={styles.mobileAuthBtns}>
                  <Link to="/auth" className={styles.mobileLoginBtn} onClick={() => setIsMenuOpen(false)}>
                    Đăng nhập
                  </Link>
                  <Link to="/auth" className={styles.mobileJoinBtn} onClick={() => setIsMenuOpen(false)}>
                    Bắt đầu ngay
                  </Link>
                </div>
              )}
            </div>

            {/* Drawer Footer */}
            <div className={styles.drawerFooter}>
              <p className={styles.footerLabel}>THEO DÕI CHÚNG TÔI</p>
              <div className={styles.socialGrid}>
                <a href="#"><FacebookLogo size={24} weight="fill" /></a>
                <a href="#"><InstagramLogo size={24} weight="fill" /></a>
                <a href="#"><YoutubeLogo size={24} weight="fill" /></a>
              </div>
              <div className={styles.footerCopy}>© 2024 TravelAi. All rights reserved.</div>
            </div>
          </div>
        </div>

        {/* Overlay when menu is open */}
        {isMenuOpen && <div className={styles.menuOverlay} onClick={() => setIsMenuOpen(false)} />}
      </div>
    </header>
  );
};

export default Navbar;
