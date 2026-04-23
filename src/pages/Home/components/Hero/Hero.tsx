import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Hero.module.scss";
import {
  MapPin,
  Wallet,
  Users,
  MagnifyingGlass,
  Minus,
  Plus,
} from "phosphor-react";

import { toast } from "react-toastify";
import SearchField from "./SearchField";
import DropdownContent from "./DropdownContent";
import { VIETNAM_PROVINCES, BUDGET_OPTIONS } from "./Hero.constants";

interface HeroProps {
  userName?: string | null;
}

const normalizeText = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const Hero: React.FC<HeroProps> = () => {
  const navigate = useNavigate();
  const [dest, setDest] = useState("");
  const [budget, setBudget] = useState("");
  const [guests, setGuests] = useState(1);
  const [activeDropdown, setActiveDropdown] = useState<
    "dest" | "budget" | "guests" | null
  >(null);

  const destRef = useRef<HTMLDivElement>(null);
  const budgetRef = useRef<HTMLDivElement>(null);
  const guestsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        destRef.current?.contains(target) ||
        budgetRef.current?.contains(target) ||
        guestsRef.current?.contains(target)
      )
        return;
      setActiveDropdown(null);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredProvinces = useMemo(() => {
    if (dest.trim() === "") return VIETNAM_PROVINCES;
    const searchStr = normalizeText(dest);
    return VIETNAM_PROVINCES.filter((p) =>
      normalizeText(p.name).includes(searchStr),
    );
  }, [dest]);

  const selectedBudgetLabel = useMemo(
    () =>
      BUDGET_OPTIONS.find((opt) => opt.value === budget)?.label ||
      "Chọn ngân sách...",
    [budget],
  );

  const performSearch = useCallback(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      toast.warn("Vui lòng đăng nhập để bắt đầu hành trình của bạn! 👋");
      return navigate("/auth");
    }
    if (!dest) {
      toast.info("Vui lòng chọn điểm đến bạn muốn khám phá! 📍");
      return setActiveDropdown("dest");
    }
    navigate("/planner", {
      state: {
        destination: dest,
        budget,
        totalGuests: guests,
        searchAt: new Date().toISOString(),
      },
    });
  }, [navigate, dest, budget, guests]);

  return (
    <section className={styles.hero}>
      <div className={styles.heroOverlay} />

      <div className={styles.container} data-aos="zoom-in">
        <div
          className={styles.heroBadge}
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <span className={styles.badgeIcon}>🏔️</span>
          <span>KHÁM PHÁ THIÊN NHIÊN HÙNG VĨ</span>
        </div>

        <h1
          className={styles.heroTitle}
          data-aos="fade-up"
          data-aos-delay="400"
        >
          Khám phá điểm đến <br /> Tuyệt vời & Tận hưởng
        </h1>

        <p
          className={styles.heroDescription}
          data-aos="fade-up"
          data-aos-delay="600"
        >
          Lên kế hoạch cho chuyến đi mơ ước của bạn tại Đà Nẵng, Huế, Quảng Nam{" "}
          <br />
          với sự trợ giúp hoàn hảo từ trí tuệ nhân tạo.
        </p>

        <div
          className={styles.heroButtons}
          data-aos="fade-up"
          data-aos-delay="800"
        >
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={performSearch}
          >
            Bắt đầu hành trình
          </button>
          <button className={`${styles.btn} ${styles.btnSecondary}`}>
            Khám phá ngay
          </button>
        </div>

        <div
          className={styles.heroSearchWrapper}
          data-aos="fade-up"
          data-aos-delay="1000"
        >
          <form
            className={styles.premiumSearchWidget}
            onSubmit={(e) => {
              e.preventDefault();
              performSearch();
            }}
          >
            {/* Điểm đến */}
            <SearchField
              label="Điểm đến"
              icon={<MapPin weight="bold" />}
              innerRef={destRef}
              onClick={() => setActiveDropdown("dest")}
            >
              <div className={styles.customSelectTrigger}>
                <input
                  type="text"
                  placeholder="Bạn muốn đi đâu?"
                  value={dest}
                  onChange={(e) => setDest(e.target.value)}
                  onFocus={() => setActiveDropdown("dest")}
                />
              </div>
              <DropdownContent show={activeDropdown === "dest"}>
                <div className={styles.suggestionsHeader}>
                  Gợi ý điểm đến phổ biến
                </div>
                <div className={styles.suggestionsList}>
                  {filteredProvinces.length > 0 ? (
                    filteredProvinces.map((p) => (
                      <div
                        key={p.name}
                        className={`${styles.suggestionItem} ${dest === p.name ? styles.active : ""}`}
                        onClick={() => {
                          setDest(p.name);
                          setActiveDropdown(null);
                        }}
                      >
                        <div className={styles.optionIcon}>{p.icon}</div>
                        <div className={styles.optionText}>
                          <span className={styles.optionTitle}>{p.name}</span>
                          <span className={styles.optionDesc}>{p.desc}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.noResult}>
                      Không tìm thấy điểm đến
                    </div>
                  )}
                </div>
              </DropdownContent>
            </SearchField>

            <div className={styles.searchDivider} />

            {/* Ngân sách */}
            <SearchField
              label="Ngân sách"
              icon={<Wallet weight="bold" />}
              innerRef={budgetRef}
              onClick={() => setActiveDropdown("budget")}
            >
              <div className={styles.customSelectTrigger}>
                <span
                  className={
                    budget ? styles.activeValue : styles.placeholderValue
                  }
                >
                  {selectedBudgetLabel}
                </span>
              </div>
              <DropdownContent show={activeDropdown === "budget"}>
                <div className={styles.suggestionsHeader}>
                  Mức ngân sách dự kiến
                </div>
                <div className={styles.suggestionsList}>
                  {BUDGET_OPTIONS.map((opt) => (
                    <div
                      key={opt.value}
                      className={`${styles.suggestionItem} ${budget === opt.value ? styles.active : ""}`}
                      onClick={() => {
                        setBudget(opt.value);
                        setActiveDropdown(null);
                      }}
                    >
                      <div className={styles.optionIcon}>{opt.icon}</div>
                      <div className={styles.optionText}>
                        <span className={styles.optionTitle}>{opt.label}</span>
                        <span className={styles.optionDesc}>{opt.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </DropdownContent>
            </SearchField>

            <div className={styles.searchDivider} />

            {/* Số khách */}
            <SearchField
              label="Số khách"
              icon={<Users weight="bold" />}
              innerRef={guestsRef}
              onClick={() => setActiveDropdown("guests")}
            >
              <div className={styles.customSelectTrigger}>
                <span className={styles.activeValue}>{guests} khách</span>
              </div>
              <DropdownContent
                show={activeDropdown === "guests"}
                className={styles.dropdownGuests}
              >
                <div className={styles.suggestionsHeader}>
                  Số lượng thành viên
                </div>
                <div className={styles.guestCounter}>
                  <div className={styles.guestInfo}>
                    <span className={styles.guestTitle}>Người đi cùng</span>
                  </div>
                  <div className={styles.counterControls}>
                    <button
                      type="button"
                      className={styles.counterBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (guests > 1) setGuests(guests - 1);
                      }}
                      disabled={guests <= 1}
                    >
                      <div className={styles.counterBtnInner}>
                        {" "}
                        <Minus weight="bold" size={16} />
                      </div>
                    </button>
                    <span className={styles.counterValue}>{guests}</span>
                    <button
                      type="button"
                      className={styles.counterBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setGuests(guests + 1);
                      }}
                    >
                      <div className={styles.counterBtnInner}>
                        <Plus weight="bold" size={16} />
                      </div>{" "}
                    </button>
                  </div>
                </div>
              </DropdownContent>
            </SearchField>

            <button type="submit" className={styles.btnSearchSubmit}>
              <MagnifyingGlass weight="bold" size={24} />
            </button>
          </form>
        </div>

        <div
          className={styles.heroStats}
          data-aos="fade-up"
          data-aos-delay="1200"
        >
          <div className={styles.statBox}>
            <span>150K+</span>
            <p>Chuyến đi</p>
          </div>
          <div className={styles.statBox}>
            <span>100K+</span>
            <p>Khách hàng</p>
          </div>
          <div className={styles.statBox}>
            <span>4.9</span>
            <p>Đánh giá</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
