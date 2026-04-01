import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  RocketLaunch,
  Compass,
  MapPin,
  Users,
  Sparkle,
  CurrencyCircleDollar,
} from "phosphor-react";

import { toast } from "react-toastify";
import VideoHome from "../../../../assets/video/Da_Nang.mp4";
import styles from "../../Home.module.scss";

const VIETNAM_PROVINCES = [
  "An Giang",
  "Bà Rịa - Vũng Tàu",
  "Bạc Liêu",
  "Bắc Giang",
  "Bắc Kạn",
  "Bắc Ninh",
  "Bến Tre",
  "Bình Dương",
  "Bình Định",
  "Bình Phước",
  "Bình Thuận",
  "Cà Mau",
  "Cao Bằng",
  "Cần Thơ",
  "Đà Nẵng",
  "Đắk Lắk",
  "Đắk Nông",
  "Điện Biên",
  "Đồng Nai",
  "Đồng Tháp",
  "Gia Lai",
  "Hà Giang",
  "Hà Nam",
  "Hà Nội",
  "Hà Tĩnh",
  "Hải Dương",
  "Hải Phòng",
  "Hậu Giang",
  "Hòa Bình",
  "Hưng Yên",
  "Khánh Hòa",
  "Kiên Giang",
  "Kon Tum",
  "Lai Châu",
  "Lạng Sơn",
  "Lào Cai",
  "Lâm Đồng",
  "Long An",
  "Nam Định",
  "Nghệ An",
  "Ninh Bình",
  "Ninh Thuận",
  "Phú Thọ",
  "Phú Yên",
  "Quảng Bình",
  "Quảng Nam",
  "Quảng Ngãi",
  "Quảng Ninh",
  "Quảng Trị",
  "Sóc Trăng",
  "Sơn La",
  "Tây Ninh",
  "Thái Bình",
  "Thái Nguyên",
  "Thanh Hóa",
  "Thừa Thiên Huế",
  "Tiền Giang",
  "TP Hồ Chí Minh",
  "Trà Vinh",
  "Tuyên Quang",
  "Vĩnh Long",
  "Vĩnh Phúc",
  "Yên Bái",
];

interface HeroProps {
  userName: string | null;
}

const Hero: React.FC<HeroProps> = ({ userName }) => {
  const navigate = useNavigate();
  const [dest, setDest] = useState("");
  const [budget, setBudget] = useState("");
  const [guests, setGuests] = useState("");

  useEffect(() => {
    // Không còn khởi tạo Flatpickr ở Hero, người dùng sẽ chọn ngày ở Planner
  }, []);

  const checkAuth = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warn("Vui lòng đăng nhập để bắt đầu hành trình của bạn! 👋");
      navigate("/auth");
      return false;
    }
    return true;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkAuth()) return;

    // 1. Đóng gói dữ liệu vào một Object
    const tripData = {
      destination: dest,
      budget: budget,
      totalGuests: guests,
      searchAt: new Date().toISOString(),
    };

    // 2. Truyền đi thông qua tham số thứ 2 của navigate
    navigate("/planner", { state: tripData });
  };

  const handleStartJourney = (e: React.MouseEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      toast.warn("Chào bạn! Hãy đăng nhập để bắt đầu lên kế hoạch nhé! ✨");
      navigate("/auth");
      return;
    }
    navigate("/planner", {
      state: {
        destination: dest,
        budget: budget,
        totalGuests: guests,
        searchAt: new Date().toISOString(),
      },
    });
  };

  return (
    <section className={styles.hero}>
      <video autoPlay loop muted className={styles.video}>
        <source src={VideoHome} type="video/mp4" />
      </video>
      <div className={styles.container} data-aos="zoom-in">
        <div
          className={styles.heroBadge}
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <span className={styles.badgeIcon}>✨</span>
          <span>MỚI: TRẢI NGHIỆM AI LÊN KẾ HOẠCH</span>
        </div>
        <h1
          className={styles.heroTitle}
          data-aos="fade-up"
          data-aos-delay="400"
        >
          {userName ? (
            <>
              Chào mừng trở lại, <br />
              <span className={styles.gradientText}>{userName}!</span>
            </>
          ) : (
            <>
              Hành trình Du lịch <br />
              <span className={styles.gradientText}>Thông minh với AI</span>
            </>
          )}
        </h1>
        <p
          className={styles.heroDescription}
          data-aos="fade-up"
          data-aos-delay="600"
        >
          Khám phá thế giới theo cách riêng của bạn với sự trợ giúp từ trí tuệ
          nhân tạo.
        </p>
        <div
          className={styles.heroButtons}
          data-aos="fade-up"
          data-aos-delay="800"
        >
          <Link
            to="/planner"
            onClick={handleStartJourney}
            className={`${styles.btn} ${styles.btnPrimary}`}
          >
            <RocketLaunch weight="fill" /> Bắt đầu hành trình
          </Link>
          <Link
            to="/explore"
            className={`${styles.btn} ${styles.btnSecondary}`}
          >
            <Compass weight="bold" /> Khám phá ngay
          </Link>
        </div>

        {/* --- Search Widget --- */}
        <div
          className={styles.heroSearchWrapper}
          data-aos="zoom-in-up"
          data-aos-delay="1000"
        >
          <form className={styles.premiumSearchWidget} onSubmit={handleSearch}>
            {/* Field: Điểm đến */}
            <div className={styles.searchField}>
              <div className={styles.fieldIcon}>
                <MapPin weight="duotone" />
              </div>
              <div className={styles.fieldInfo}>
                <label>Điểm đến</label>
                <input
                  type="text"
                  list="vietnam-provinces"
                  placeholder="Bạn muốn đi đâu?"
                  required
                  value={dest}
                  onChange={(e) => setDest(e.target.value)}
                />
                <datalist id="vietnam-provinces">
                  {VIETNAM_PROVINCES.map((province) => (
                    <option key={province} value={province} />
                  ))}
                </datalist>
              </div>
            </div>

            <div className={styles.searchDivider}></div>

            {/* Field: Ngày tháng */}
            <div className={styles.searchField}>
              <div className={styles.fieldIcon}>
                <CurrencyCircleDollar weight="duotone" />
              </div>
              <div className={styles.fieldInfo}>
                <label>Ngân sách</label>
                <select
                  required
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  style={{
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    width: "100%",
                    fontSize: "15px",
                    fontWeight: "600",
                    color: "#1e293b",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <option value="" disabled hidden>
                    Ngân sách dự kiến...
                  </option>
                  <option value="Dưới 5 triệu">
                    Tiết kiệm (Dưới 5 triệu VNĐ)
                  </option>
                  <option value="5 - 10 triệu">
                    Tiêu chuẩn (5 - 10 triệu VNĐ)
                  </option>
                  <option value="10 - 20 triệu">
                    Thoải mái (10 - 20 triệu VNĐ)
                  </option>
                  <option value="Trên 20 triệu">
                    Cao cấp (Trên 20 triệu VNĐ)
                  </option>
                </select>
              </div>
            </div>

            <div className={styles.searchDivider}></div>

            {/* Field: Số khách */}
            <div className={styles.searchField}>
              <div className={styles.fieldIcon}>
                <Users weight="duotone" />
              </div>
              <div className={styles.fieldInfo}>
                <label>Số khách</label>
                <input
                  type="number"
                  placeholder="Thêm khách"
                  min="1"
                  required
                  value={guests}
                  onChange={(e) => setGuests(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className={styles.btnSearchSubmit}>
              <Sparkle weight="fill" /> <span>Tạo lịch trình</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Hero;
