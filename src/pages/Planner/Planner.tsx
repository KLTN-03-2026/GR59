import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AOS from "aos";
import "aos/dist/aos.css";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import styles from "./Planner.module.scss";

import StepProgressBar from "./components/StepProgressBar/StepProgressBar";
import InterestItem from "./components/InterestItem/InterestItem";
import type { PlannerFormData, InterestOption } from "./types";

const INTERESTS: InterestOption[] = [
  { id: "Ẩm thực", icon: "ph-fill ph-fork-knife", color: "#f97316" },
  { id: "Thiên nhiên", icon: "ph-fill ph-tree-evergreen", color: "#22c55e" },
  { id: "Văn hóa", icon: "ph-fill ph-bank", color: "#0ea5e9" },
  { id: "Sôi động", icon: "ph-fill ph-music-notes", color: "#a855f7" },
  { id: "Nghỉ dưỡng", icon: "ph-fill ph-umbrella-simple", color: "#06b6d4" },
];

const Planner: React.FC = () => {
  const location = useLocation();
  const dateInputRef = useRef<HTMLInputElement>(null);

  // Nhận dữ liệu từ trang Hero nếu có
  const heroData = location.state as {
    destination?: string;
    budget?: string;
    totalGuests?: string;
  } | null;

  const [formData, setFormData] = useState<PlannerFormData>({
    destination: heroData?.destination || "",
    travelDate: "",
    interests: ["Ẩm thực", "Thiên nhiên"],
    budget: heroData?.budget || "",
    peopleGroup: heroData?.totalGuests || "",
  });

  useEffect(() => {
    if (heroData) {
      setFormData((prev) => ({
        ...prev,
        destination: heroData.destination || prev.destination,
        budget: heroData.budget || prev.budget,
        peopleGroup: heroData.totalGuests || prev.peopleGroup,
      }));
    }
  }, [heroData]);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để truy cập trang lập kế hoạch! 🛡️");
      navigate("/auth");
    }
  }, [navigate]);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  // Khởi tạo Flatpickr một lần duy nhất
  useEffect(() => {
    let fp: any;
    if (dateInputRef.current) {
      fp = flatpickr(dateInputRef.current, {
        mode: "range",
        minDate: "today",
        dateFormat: "d/m/Y",
        locale: {
          rangeSeparator: " - ",
        },
        onChange: (_, dateStr) => {
          setFormData((prev) => ({ ...prev, travelDate: dateStr }));
        },
      });

      // Nếu có dữ liệu từ Hero truyền sang, set vào Flatpickr
      if (formData.travelDate) {
        fp.setDate(formData.travelDate);
      }
    }
    return () => {
      if (fp) fp.destroy();
    };
  }, []); // Chỉ chạy 1 lần khi mount

  // Đồng bộ lại Flatpickr nếu travelDate thay đổi từ bên ngoài (ví dụ từ heroData useEffect)
  useEffect(() => {
    if (dateInputRef.current) {
      const fp = (dateInputRef.current as any)._flatpickr;
      if (fp && formData.travelDate && fp.input.value !== formData.travelDate) {
        fp.setDate(formData.travelDate);
      }
    }
  }, [formData.travelDate]);

  const handleToggleInterest = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(id)
        ? prev.interests.filter((i) => i !== id)
        : prev.interests.length < 4
          ? [...prev.interests, id]
          : prev.interests,
    }));
  };

  return (
    <div className={styles.plannerWrapper}>
      <div className={styles.bgDecoration}></div>
      <header className={styles.header} data-aos="fade-down">
        <h1>Lên kế hoạch chuyến đi mơ ước</h1>
        <p>
          Chỉ mất 2 phút để AI thiết kế lịch trình cá nhân hoá dành riêng cho
          bạn dựa trên sở thích và nhu cầu.
        </p>
      </header>

      <StepProgressBar currentStep={1} />

      <main className={styles.formCard} data-aos="zoom-in">
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <i className="ph-fill ph-map-trifold"></i> Bạn dự định đi đâu và khi
            nào?
          </h3>
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>ĐIỂM ĐẾN</label>
              <div className={styles.inputWrapper}>
                <i className="ph-duotone ph-map-pin"></i>
                <input 
                  type="text" 
                  placeholder="Bạn muốn đi đâu?" 
                  value={formData.destination} 
                  onChange={(e) => setFormData({...formData, destination: e.target.value})}
                />
              </div>
            </div>
            <div className={styles.inputGroup}>
              <label>THỜI GIAN</label>
              <div className={styles.inputWrapper}>
                <i className="ph-duotone ph-calendar-blank"></i>
                <input
                  type="text"
                  placeholder="Chọn ngày"
                  id="plan-dates"
                  ref={dateInputRef}
                  value={formData.travelDate}
                  readOnly
                />
              </div>
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            <i className="ph-fill ph-heart"></i> Sở thích cá nhân
          </h3>
          <p className={styles.infoText}>Chọn tối đa 4 phong cách du lịch bạn mong muốn trải nghiệm nhất:</p>
          <div className={styles.interestGrid}>
            {INTERESTS.map((item) => (
              <InterestItem
                key={item.id}
                label={item.id}
                icon={item.icon}
                color={item.color}
                isActive={formData.interests.includes(item.id)}
                onClick={() => handleToggleInterest(item.id)}
              />
            ))}
          </div>
        </section>

        <div className={styles.row}>
          <div className={styles.inputGroup}>
            <label>
              <i className="ph-fill ph-money"></i> NGÂN SÁCH
            </label>
            <div className={styles.inputWrapper}>
              <i className="ph-duotone ph-currency-circle-dollar"></i>
              <input
                type="text"
                placeholder="Ví dụ: 5 triệu VNĐ"
                value={formData.budget}
                onChange={(e) =>
                  setFormData({ ...formData, budget: e.target.value })
                }
              />
            </div>
          </div>
          <div className={styles.inputGroup}>
            <label>
              <i className="ph-fill ph-users"></i> SỐ NGƯỜI
            </label>
            <div className={styles.inputWrapper}>
              <i className="ph-duotone ph-users"></i>
              <input
                type="number"
                min="0"
                placeholder="Số người"
                value={formData.peopleGroup}
                onChange={(e) =>
                  setFormData({ ...formData, peopleGroup: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        <div className={styles.submitWrapper}>
          <button className={styles.btnSubmit}>
            <i className="ph-bold ph-lightning"></i> Tối ưu hóa lộ trình AI
          </button>
          <span className={styles.footerNote}>Mất khoảng 5-10 giây để xử lý dữ liệu thông minh</span>
        </div>
      </main>

      <section className={styles.mapSection} data-aos="fade-up">
        <div className={styles.mapWrapper}>
          {/* Real Google Maps Embed */}
          <iframe
            title="Google Maps"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            src={`https://www.google.com/maps?q=${encodeURIComponent(formData.destination || "Vietnam")}&output=embed&z=12`}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
          
          <div className={styles.mapInfoBox}>
            <div className={styles.infoTop}>
              <h4>{formData.destination || "Việt Nam"}</h4>
              <div className={styles.infoActions}>
                <i className="ph-bold ph-note-pencil"></i>
                <i className="ph-bold ph-arrow-bend-up-right"></i>
              </div>
            </div>
            <p>{formData.destination || "Việt Nam"}</p>
            <p className={styles.rating}>Đang hiển thị trên bản đồ</p>
          </div>

          <div className={styles.mapExpandBtn}>
            <i className="ph-bold ph-arrows-out"></i>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Planner;
