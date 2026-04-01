import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sparkle,
  CaretDown,
  UserCircle,
  MapTrifold,
  SignOut,
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

    // Lưu ý: Không đưa 'isLoggedIn' và 'username' vào mảng dependencies
    // để tránh tình trạng "cascading renders" (render thác đổ).
  }, [location]);
  const isActive = (path: string) => location.pathname === path;

  const handleLogOut = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    try {
      // 1. Gọi API đăng xuất để BE xóa Session/Cookie/RefreshToken
      await postLogout();
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
      </div>
    </header>
  );
};

export default Navbar;
