import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Sparkle,
  CaretDown,
  UserCircle,
  MapTrifoldIcon,

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
  ShieldCheck,
} from "@phosphor-icons/react";
import { toast } from "react-toastify";
import styles from "./Navbar.module.scss";
import { logo } from "../../../assets/images/img";
import { postLogout } from "../../../services/userService";
import { getCache, setCache } from "../../../utils/DataCache";
import { getHotels } from "../../../services/hotelService";
import { getFeaturedAttractions, getHighlightLocations, getHighlightRestaurants } from "../../../services/highlightService";


const Navbar: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem("accessToken");
    return !!token;
  });
  const [username, setUsername] = useState(() => {
    return localStorage.getItem("username") || "";
  });
  const [userRole, setUserRole] = useState<string | null>(() => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        return user.role || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const storedUsername = localStorage.getItem("username") || "Người dùng";
    const hasToken = !!token;

    if (hasToken !== isLoggedIn) setIsLoggedIn(hasToken);
    if (storedUsername !== username) setUsername(storedUsername);
    
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role !== userRole) setUserRole(user.role);
      } catch (e) {
        setUserRole(null);
      }
    } else {
      setUserRole(null);
    }
    setIsMenuOpen(false);
  }, [location]);

  // Smart Pre-fetching: Nạp trước dữ liệu Explore khi máy rảnh (sau 6 giây)
  useEffect(() => {
    const timer = setTimeout(() => {
      prefetchExplore();
    }, 6000); 
    return () => clearTimeout(timer);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handleLogOut = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    try {
      const refreshToken = localStorage.getItem("refreshToken") || "";
      await postLogout(refreshToken);
    } catch (error) {
      console.error("Lỗi khi gọi API đăng xuất:", error);
    } finally {
      localStorage.clear();
      setIsLoggedIn(false);
      toast.info("Đã đăng xuất thành công!");
      navigate("/auth");
    }
  };

  const prefetchExplore = () => {
    const cacheKey = "explore-all-";
    if (!getCache(cacheKey)) {
      Promise.all([
        getHotels(0, 4), // Dùng 4 cho nhẹ máy
        getHighlightRestaurants(4),
        getFeaturedAttractions(5)
      ]).then(([hRes, rRes, lRes]) => {

        let allItems: any[] = [];
        if (hRes.data?.data) {
          const hContent = Array.isArray(hRes.data.data) ? hRes.data.data : (hRes.data.data as any).content;
          if (Array.isArray(hContent)) allItems = [...allItems, ...hContent];
        }
        if (rRes.data?.data) {
          const rContent = Array.isArray(rRes.data.data) ? rRes.data.data : (rRes.data.data as any).content;
          if (Array.isArray(rContent)) allItems = [...allItems, ...rContent];
        }
        if (lRes.data?.data) {
          const lContent = Array.isArray(lRes.data.data) ? lRes.data.data : (lRes.data.data as any).content;
          if (Array.isArray(lContent)) allItems = [...allItems, ...lContent];
        }

        const uniqueItems = allItems
          .filter(item => item && item.id)
          .map(item => ({
            ...item,
            uniqueId: `${item.type || 'unknown'}-${item.id}`
          }));

        setCache(cacheKey, uniqueItems);
        
        // Phân phối dữ liệu vào các category lẻ ngay lập tức
        const hotels = uniqueItems.filter(i => i.type === "bed");
        const foods = uniqueItems.filter(i => i.type === "food");
        const pins = uniqueItems.filter(i => i.type === "pin");
        
        if (hotels.length > 0) setCache("explore-bed-", hotels);
        if (foods.length > 0) setCache("explore-food-", foods);
        if (pins.length > 0) setCache("explore-pin-", pins);

      }).catch(err => console.warn("Prefetch failed:", err));
    }
  };

  return (
    <header className={styles.navbar} data-aos="fade-down" data-aos-duration="800">
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
            onMouseEnter={prefetchExplore}
          >
            Khám phá
          </Link>
          <Link to="/sample" className={isActive("/sample") ? styles.active : ""}>
            Lịch trình mẫu
          </Link>
          <Link to="/news" className={isActive("/news") ? styles.active : ""}>
            Tin tức
          </Link>
          <Link to="/review" className={isActive("/review") ? styles.active : ""}>
            Đánh giá
          </Link>
        </nav>

        <div className={styles.navActions}>
          {isLoggedIn ? (
            <div className={styles.userDropdown}>
              <div className={styles.userTrigger}>
                <img src={`https://ui-avatars.com/api/?name=${username}&background=random&color=fff`} alt="User Avatar" />
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
                  <MapTrifoldIcon size={20} /> Lịch trình của tôi
                </Link>
                {userRole === "ADMIN" && (
                  <Link to="/admin" className={styles.dropdownItem}>
                    <ShieldCheck size={20} /> Quản trị hệ thống
                  </Link>
                )}
                <Link to="/ai-suggestions" className={styles.dropdownItem}>
                  <Sparkle size={20} /> Gợi ý từ AI
                </Link>
                <div className={styles.dropdownDivider}></div>
                <a href="/" onClick={handleLogOut} className={styles.logoutItem}>
                  <SignOut size={20} /> Đăng xuất
                </a>
              </div>
            </div>
          ) : (
            <div className={styles.authGroup}>
              <Link to="/auth" className={styles.loginBtn}>Đăng nhập</Link>
              <Link to="/auth" className={styles.ctaBtn}>Bắt đầu ngay</Link>
            </div>
          )}
        </div>

        {!isMenuOpen && (
          <button className={styles.mobileMenuBtn} onClick={() => setIsMenuOpen(true)}>
            <List size={28} weight="bold" />
          </button>
        )}

        <div className={`${styles.mobileDrawer} ${isMenuOpen ? styles.open : ""}`}>
          <div className={styles.mobileDrawerContent}>
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
              <Link to="/explore" className={isActive("/explore") ? styles.active : ""} onClick={() => { setIsMenuOpen(false); }} onMouseEnter={prefetchExplore}>
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
                    <UserCircle size={22} weight="bold" /> <span>Trang cá nhân</span>
                  </Link>
                  <Link to="/dashboard" className={styles.mobileMenuItem} onClick={() => setIsMenuOpen(false)}>
                    <MapTrifoldIcon size={22} weight="bold" /> <span>Lịch trình của tôi</span>
                  </Link>
                  {userRole === "ADMIN" && (
                    <Link to="/admin" className={styles.mobileMenuItem} onClick={() => setIsMenuOpen(false)}>
                      <ShieldCheck size={22} weight="bold" /> <span>Quản trị hệ thống</span>
                    </Link>
                  )}
                  <a href="/" onClick={(e) => { handleLogOut(e); setIsMenuOpen(false); }} className={`${styles.mobileMenuItem} ${styles.logout}`}>
                    <SignOut size={22} weight="bold" /> <span>Đăng xuất</span>
                  </a>
                </div>
              ) : (
                <div className={styles.mobileAuthBtns}>
                  <Link to="/auth" className={styles.mobileLoginBtn} onClick={() => setIsMenuOpen(false)}>Đăng nhập</Link>
                  <Link to="/auth" className={styles.mobileJoinBtn} onClick={() => setIsMenuOpen(false)}>Bắt đầu ngay</Link>
                </div>
              )}
            </div>
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
        {isMenuOpen && <div className={styles.menuOverlay} onClick={() => setIsMenuOpen(false)} />}
      </div>
    </header>
  );
};

export default Navbar;
