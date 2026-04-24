import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AOS from "aos";
import "aos/dist/aos.css";
import flatpickr from "flatpickr";
import type { Instance } from "flatpickr/dist/types/instance";
import "flatpickr/dist/flatpickr.min.css";
import styles from "./Planner.module.scss";

import StepProgressBar from "./components/StepProgressBar/StepProgressBar";
import InterestItem from "./components/InterestItem/InterestItem";
import type { PlannerFormData, InterestOption } from "./types";
import { postTravelPlan } from "../../services/plannerService";
import CustomDropdown from "../../components/Ui/CustomDropdown/CustomDropdown";
import VoltageButton from "../../components/Ui/VoltageButton/VoltageButton";
import { Users, Money, MapPin, CalendarBlank, MapTrifold, Lightning, Spinner, MagicWand, MapPinLine, CloudSun, ShieldCheck, Clock, Sparkle } from "@phosphor-icons/react";


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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    const token = localStorage.getItem("accessToken");
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
    let fp: Instance | undefined;
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
      const fp = (dateInputRef.current as HTMLInputElement & { _flatpickr?: Instance })._flatpickr;
      if (fp && formData.travelDate && fp.input.value !== formData.travelDate) {
        fp.setDate(formData.travelDate);
      }
    }
  }, [formData.travelDate]);


  const handleSubmit = async () => {
    // Basic validation
    if (!formData.destination || !formData.travelDate || !formData.budget || !formData.peopleGroup) {
      toast.warning("Vui lòng điền đầy đủ các thông tin bắt buộc!");
      return;
    }


    try {
      setIsSubmitting(true);
      await postTravelPlan(formData);
      toast.success("AI đang thiết kế lộ trình cho bạn, chờ chút nhé! 🤖");
      // Chuyển hướng sang trang chi tiết lộ trình thay vì dashboard
      navigate("/itinerary-detail", { state: { planData: formData } });
    } catch (error) {
      console.error("Lỗi khi lưu kế hoạch chuyến đi:", error);
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.plannerWrapper}>
      <div className={styles.bgDecoration}></div>
      <div className={styles.blob1}></div>
      <div className={styles.blob2}></div>
      
      <header className={styles.header} data-aos="fade-down">
        <div className={styles.badge}>AI-Powered Travel</div>
        <h1>Thiết kế hành trình <br/><span>cá nhân hóa</span></h1>
        <p>
          Hệ thống AI thông minh sẽ phân tích hàng triệu dữ liệu để tạo ra 
          lịch trình du lịch hoàn hảo nhất dành riêng cho bạn.
        </p>
      </header>

      <StepProgressBar currentStep={1} />

      <div className={styles.mainContent}>
        <main className={styles.formCard} data-aos="zoom-in" data-aos-delay="200">
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>
              <MapTrifold size={28} weight="fill" /> 01. Điểm đến & Thời gian
            </h3>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label>ĐIỂM ĐẾN</label>
                <div className={styles.inputWrapper}>
                  <MapPin size={22} weight="duotone" />
                  <input 
                    type="text" 
                    placeholder="Nhập thành phố bạn muốn tới..." 
                    value={formData.destination} 
                    onChange={(e) => {
                      setFormData({...formData, destination: e.target.value});
                    }}
                  />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label>THỜI GIAN</label>
                <div className={styles.inputWrapper}>
                  <CalendarBlank size={22} weight="duotone" />
                  <input
                    type="text"
                    placeholder="Chọn ngày đi - về"
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
              <Money size={28} weight="fill" /> 02. Ngân sách & Đồng hành
            </h3>
            <div className={styles.row}>
              <div className={styles.inputGroup}>
                <label htmlFor="budget">NGÂN SÁCH DỰ KIẾN</label>
                <CustomDropdown
                  options={[
                    { value: "Dưới 5 triệu", label: "Tiết kiệm (Dưới 5 triệu VNĐ)" },
                    { value: "5 - 10 triệu", label: "Tiêu chuẩn (5 - 10 triệu VNĐ)" },
                    { value: "10 - 20 triệu", label: "Thoải mái (10 - 20 triệu VNĐ)" },
                    { value: "Trên 20 triệu", label: "Cao cấp (Trên 20 triệu VNĐ)" },
                  ]}
                  value={formData.budget}
                  onChange={(val) => setFormData({ ...formData, budget: val })}
                  placeholder="Chọn ngân sách..."
                  icon={<Money size={24} weight="duotone" />}
                />
              </div>
              <div className={styles.inputGroup}>
                <label>SỐ LƯỢNG NGƯỜI</label>
                <div className={styles.inputWrapper}>
                  <Users size={24} weight="duotone" />
                  <input
                    type="number"
                    min="1"
                    placeholder="Nhập số người"
                    value={formData.peopleGroup}
                    onChange={(e) =>
                      setFormData({ ...formData, peopleGroup: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>
          </section>

          <div className={styles.submitWrapper}>
            <VoltageButton 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className={styles.btnContent}><Spinner size={24} weight="bold" className="ph-spin" /> Đang xử lý...</span>
              ) : (
                <span className={styles.btnContent}><Lightning size={24} weight="bold" /> Tối ưu hóa lộ trình AI</span>
              )}
            </VoltageButton>
            <div className={styles.trustRow}>
              <span><ShieldCheck size={18} weight="fill" /> Bảo mật thông tin</span>
              <span><Clock size={18} weight="fill" /> Tiết kiệm 2 giờ tìm kiếm</span>
              <span><Sparkle size={18} weight="fill" /> 100% Cá nhân hóa</span>
            </div>
          </div>
        </main>

        <aside className={styles.featuresSide} data-aos="fade-left" data-aos-delay="400">
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}><MagicWand size={24} weight="fill" /></div>
            <div className={styles.featureText}>
              <h4>AI Phân tích sâu</h4>
              <p>Hệ thống tự động lọc các địa điểm phù hợp nhất với phong cách của bạn.</p>
            </div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}><MapPinLine size={24} weight="fill" /></div>
            <div className={styles.featureText}>
              <h4>Tối ưu hóa quãng đường</h4>
              <p>Sắp xếp thứ tự tham quan giúp bạn di chuyển ít nhất, chơi được nhiều nhất.</p>
            </div>
          </div>
          <div className={styles.featureItem}>
            <div className={styles.featureIcon}><CloudSun size={24} weight="fill" /></div>
            <div className={styles.featureText}>
              <h4>Thời tiết & Thời điểm</h4>
              <p>Cập nhật tình hình thời tiết thời gian thực để gợi ý hoạt động phù hợp.</p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Planner;
