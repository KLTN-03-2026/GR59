import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  RocketLaunch,
  Compass,
  MapPin,
  CalendarBlank,
  Users,
  Sparkle,
} from "phosphor-react";
import flatpickr from "flatpickr";
import VideoHome from "../../../../assets/video/Da_Nang.mp4";
import styles from "../../Home.module.scss"; // Tạm thời dùng chung file styles cũ của bạn

const Hero: React.FC = () => {
  const navigate = useNavigate();
  const [dest, setDest] = useState("");
  const [dates, setDates] = useState("");
  const [guests, setGuests] = useState("");

  useEffect(() => {
    flatpickr("#dates-input", {
      mode: "range",
      minDate: "today",
      dateFormat: "d/m/Y",
    });
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    alert("đang phát triển chức năng này ");
    navigate("#");
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
          Hành trình Du lịch <br />
          <span className={styles.gradientText}>Thông minh với AI</span>
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
          <Link to="/planner" className={`${styles.btn} ${styles.btnPrimary}`}>
            <RocketLaunch weight="fill" /> Bắt đầu hành trình
          </Link>
          <Link
            to="/explore"
            className={`${styles.btn} ${styles.btnSecondary}`}
          >
            <Compass weight="bold" /> Khám phá ngay
          </Link>
        </div>

        {/* Search Widget */}
        <div
          className={styles.heroSearchWrapper}
          data-aos="zoom-in-up"
          data-aos-delay="1000"
        >
          <form className={styles.premiumSearchWidget} onSubmit={handleSearch}>
            <div className={styles.searchField}>
              <div className={styles.fieldIcon}>
                <MapPin weight="duotone" />
              </div>
              <div className={styles.fieldInfo}>
                <label>Điểm đến</label>
                <input
                  type="text"
                  placeholder="Bạn muốn đi đâu?"
                  required
                  value={dest}
                  onChange={(e) => setDest(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.searchDivider}></div>
            <div className={styles.searchField}>
              <div className={styles.fieldIcon}>
                <CalendarBlank weight="duotone" />
              </div>
              <div className={styles.fieldInfo}>
                <label>Ngày đi - Ngày về</label>
                <input
                  type="text"
                  id="dates-input"
                  placeholder="Thêm ngày"
                  required
                  value={dates}
                  onChange={(e) => setDates(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.searchDivider}></div>
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
