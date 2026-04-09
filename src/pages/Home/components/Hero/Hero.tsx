import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  RocketLaunch,
  Compass,
  MapPin,
  Users,
  Sparkle,
  CurrencyCircleDollar,
  Minus,
  Plus,
} from "phosphor-react";

import { toast } from "react-toastify";
import VideoHome from "../../../../assets/video/Da_Nang.mp4";
import styles from "../../Home.module.scss";

const VIETNAM_PROVINCES = [
  "An Giang", "Bà Rịa - Vũng Tàu", "Bạc Liêu", "Bắc Giang", "Bắc Kạn", "Bắc Ninh", "Bến Tre",
  "Bình Dương", "Bình Định", "Bình Phước", "Bình Thuận", "Cà Mau", "Cao Bằng", "Cần Thơ",
  "Đà Nẵng", "Đắk Lắk", "Đắk Nông", "Điện Biên", "Đồng Nai", "Đồng Tháp", "Gia Lai",
  "Hà Giang", "Hà Nam", "Hà Nội", "Hà Tĩnh", "Hải Dương", "Hải Phòng", "Hậu Giang",
  "Hòa Bình", "Hưng Yên", "Khánh Hòa", "Kiên Giang", "Kon Tum", "Lai Châu", "Lạng Sơn",
  "Lào Cai", "Lâm Đồng", "Long An", "Nam Định", "Nghệ An", "Ninh Bình", "Ninh Thuận",
  "Phú Thọ", "Phú Yên", "Quảng Bình", "Quảng Nam", "Quảng Ngãi", "Quảng Ninh", "Quảng Trị",
  "Sóc Trăng", "Sơn La", "Tây Ninh", "Thái Bình", "Thái Nguyên", "Thanh Hóa", "Thừa Thiên Huế",
  "Tiền Giang", "TP Hồ Chí Minh", "Trà Vinh", "Tuyên Quang", "Vĩnh Long", "Vĩnh Phúc", "Yên Bái"
];

const BUDGET_OPTIONS = [
  {
    label: "Tiết kiệm",
    value: "Dưới 5 triệu",
    desc: "< 5 Triệu VNĐ",
    icon: <Sparkle size={18} weight="duotone" color="#10b981" />,
  },
  {
    label: "Tiêu chuẩn",
    value: "5 - 10 triệu",
    desc: "5 - 10 Triệu VNĐ",
    icon: <RocketLaunch size={18} weight="duotone" color="#0ea5e9" />,
  },
  {
    label: "Thoải mái",
    value: "10 - 20 triệu",
    desc: "10 - 20 Triệu VNĐ",
    icon: <Compass size={18} weight="duotone" color="#8b5cf6" />,
  },
  {
    label: "Đẳng cấp",
    value: "Trên 20 triệu",
    desc: "> 20 Triệu VNĐ",
    icon: <Sparkle size={18} weight="fill" color="#f59e0b" />,
  },
];

interface HeroProps {
  userName: string | null;
}

const Hero: React.FC<HeroProps> = ({ userName }) => {
  const navigate = useNavigate();
  const [dest, setDest] = useState("");
  const [budget, setBudget] = useState("");
  const [guests, setGuests] = useState(1);
  const [showDestDropdown, setShowDestDropdown] = useState(false);
  const [showBudgetDropdown, setShowBudgetDropdown] = useState(false);
  const [showGuestsDropdown, setShowGuestsDropdown] = useState(false);
  
  const destRef = useRef<HTMLDivElement>(null);
  const budgetRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (destRef.current && !destRef.current.contains(event.target as Node)) {
        setShowDestDropdown(false);
      }
      if (budgetRef.current && !budgetRef.current.contains(event.target as Node)) {
        setShowBudgetDropdown(false);
      }
      if (guestsRef.current && !guestsRef.current.contains(event.target as Node)) {
        setShowGuestsDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    navigate("/planner", {
      state: {
        destination: dest,
        budget: budget,
        totalGuests: guests,
        searchAt: new Date().toISOString(),
      },
    });
  };

  const handleStartJourney = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!checkAuth()) return;
    navigate("/planner", {
      state: {
        destination: dest,
        budget: budget,
        totalGuests: guests,
        searchAt: new Date().toISOString(),
      },
    });
  };

  const normalizeText = (text: string) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .toLowerCase()
      .trim();

  const filteredProvinces = dest.trim() === ""
    ? []
    : VIETNAM_PROVINCES.filter((province) =>
        normalizeText(province).includes(normalizeText(dest))
      ).slice(0, 5);

  const selectedBudgetLabel = BUDGET_OPTIONS.find((opt) => opt.value === budget)?.label || "Chọn ngân sách...";

  return (
    <section className={styles.hero}>
      <video autoPlay loop muted className={styles.video}>
        <source src={VideoHome} type="video/mp4" />
      </video>
      <div className={styles.container} data-aos="zoom-in">
        <div className={styles.heroBadge} data-aos="fade-up" data-aos-delay="200">
          <span className={styles.badgeIcon}>✨</span>
          <span>MỚI: TRẢI NGHIỆM AI LÊN KẾ HOẠCH</span>
        </div>
        <h1 className={styles.heroTitle} data-aos="fade-up" data-aos-delay="400">
          {userName ? (
            <>Chào mừng trở lại, <br /> <span className={styles.gradientText}>{userName}!</span></>
          ) : (
            <>Hành trình Du lịch <br /> <span className={styles.gradientText}>Thông minh với AI</span></>
          )}
        </h1>
        <p className={styles.heroDescription} data-aos="fade-up" data-aos-delay="600">
          Khám phá thế giới theo cách riêng của bạn với sự trợ giúp từ trí tuệ nhân tạo.
        </p>
        <div className={styles.heroButtons} data-aos="fade-up" data-aos-delay="800">
          <Link to="/planner" onClick={handleStartJourney} className={`${styles.btn} ${styles.btnPrimary}`}>
            <RocketLaunch weight="fill" /> Bắt đầu hành trình
          </Link>
          <Link to="/explore" className={`${styles.btn} ${styles.btnSecondary}`}>
            <Compass weight="bold" /> Khám phá ngay
          </Link>
        </div>

        <div className={styles.heroSearchWrapper} data-aos="zoom-in-up" data-aos-delay="1000">
          <form className={styles.premiumSearchWidget} onSubmit={handleSearch}>
            {/* Field: Điểm đến */}
            <div className={styles.searchField} ref={destRef}>
              <div className={styles.fieldIcon}><MapPin weight="duotone" /></div>
              <div className={styles.fieldInfo}>
                <label htmlFor="destination">Điểm đến</label>
                <input
                  id="destination"
                  type="text"
                  placeholder="Bạn muốn đi đâu?"
                  autoComplete="off"
                  required
                  value={dest}
                  onChange={(e) => {
                    setDest(e.target.value);
                    setShowDestDropdown(true);
                  }}
                  onFocus={() => setShowDestDropdown(true)}
                />
                <div className={`${styles.suggestionsDropdown} ${showDestDropdown && filteredProvinces.length > 0 ? styles.show : ""}`}>
                  <div className={styles.suggestionsHeader}>GỢI Ý ĐIỂM ĐẾN</div>
                  <div className={styles.suggestionsList}>
                    {filteredProvinces.map((province) => (
                      <div key={province} className={styles.suggestionItem} onClick={() => { setDest(province); setShowDestDropdown(false); }}>
                        <MapPin size={18} weight="duotone" color="#94a3b8" />
                        <span>{province}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.searchDivider}></div>

            {/* Field: Ngân sách */}
            <div className={styles.searchField} ref={budgetRef}>
              <div className={styles.fieldIcon}><CurrencyCircleDollar weight="duotone" /></div>
              <div className={styles.fieldInfo}>
                <label>Ngân sách</label>
                <div className={styles.customSelectTrigger} onClick={() => setShowBudgetDropdown(!showBudgetDropdown)}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: budget ? "#0f172a" : "#94a3b8" }}>
                    {selectedBudgetLabel}
                  </span>
                </div>
                <div className={`${styles.suggestionsDropdown} ${showBudgetDropdown ? styles.show : ""}`}>
                  <div className={styles.suggestionsHeader}>MỨC CHI TIÊU DỰ KIẾN</div>
                  <div className={styles.suggestionsList}>
                    {BUDGET_OPTIONS.map((opt) => (
                      <div key={opt.value} className={`${styles.suggestionItem} ${budget === opt.value ? styles.active : ""}`} onClick={() => { setBudget(opt.value); setShowBudgetDropdown(false); }}>
                        <div className={styles.optionIcon}>{opt.icon}</div>
                        <div className={styles.optionText}>
                          <span className={styles.optionTitle}>{opt.label}</span>
                          <span className={styles.optionDesc}>{opt.desc}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.searchDivider}></div>

            {/* Field: Số khách */}
            <div className={styles.searchField} ref={guestsRef}>
              <div className={styles.fieldIcon}><Users weight="duotone" /></div>
              <div className={styles.fieldInfo}>
                <label>Số khách</label>
                <div className={styles.customSelectTrigger} onClick={() => setShowGuestsDropdown(!showGuestsDropdown)}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "#0f172a" }}>
                    {guests} khách
                  </span>
                </div>
                
                <div className={`${styles.suggestionsDropdown} ${showGuestsDropdown ? styles.show : ""}`}>
                  <div className={styles.suggestionsHeader}>SỐ LƯỢNG KHÁCH</div>
                  <div className={styles.guestCounter}>
                    <div className={styles.guestInfo}>
                      <span className={styles.guestTitle}>Người lớn & Trẻ em</span>
                    </div>
                    <div className={styles.counterControls}>
                      <button
                        type="button"
                        className={styles.counterBtn}
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        disabled={guests <= 1}
                        aria-label="Giảm số lượng khách"
                        title="Giảm số lượng khách"
                      >
                        <Minus size={14} weight="bold" />
                      </button>
                      <span className={styles.counterValue}>{guests}</span>
                      <button
                        type="button"
                        className={styles.counterBtn}
                        onClick={() => setGuests(guests + 1)}
                        aria-label="Tăng số lượng khách"
                        title="Tăng số lượng khách"
                      >
                        <Plus size={14} weight="bold" />
                      </button>
                    </div>
                  </div>
                </div>
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
