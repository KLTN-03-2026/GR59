import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Sparkle, MapPin, CalendarBlank, Wallet, PaperPlaneRight, CircleNotch } from "phosphor-react";
import styles from "./AISuggestions.module.scss";

const AISuggestions: React.FC = () => {
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("3");
  const [budget, setBudget] = useState("Tiết kiệm");
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-quad",
    });
  }, []);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination.trim()) return;

    setIsGenerating(true);
    setShowResult(false);

    // Giả lập thời gian AI xử lý
    setTimeout(() => {
      setIsGenerating(false);
      setShowResult(true);
    }, 3000);
  };

  return (
    <div className={styles.aiPage}>
      {/* Dynamic Background */}
      <div className={styles.bgGlow}></div>
      <div className={styles.bgGlow2}></div>

      <div className={styles.container}>
        <div className={styles.header} data-aos="fade-down">
          <div className={styles.badge}>
            <Sparkle weight="fill" /> AI Powered
          </div>
          <h1 className={styles.title}>
            Lên Lịch Trình Thông Minh Cùng <span>LocalGoAI</span>
          </h1>
          <p className={styles.subtitle}>
            Chỉ với vài thao tác, AI của chúng tôi sẽ thiết kế một chuyến đi hoàn hảo, mang đậm bản sắc địa phương dựa trên sở thích của riêng bạn.
          </p>
        </div>

        <div className={styles.mainContent}>
          {/* Prompt Section */}
          <div className={styles.promptCard} data-aos="fade-up" data-aos-delay="200">
            <form onSubmit={handleGenerate} className={styles.formContainer}>
              <div className={styles.inputGroup}>
                <label><MapPin weight="bold" /> Điểm đến mong muốn</label>
                <input 
                  type="text" 
                  placeholder="VD: Đà Lạt, Sapa, Hội An..." 
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  disabled={isGenerating}
                  required
                />
              </div>

              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label><CalendarBlank weight="bold" /> Số ngày</label>
                  <select 
                    value={days} 
                    onChange={(e) => setDays(e.target.value)}
                    disabled={isGenerating}
                  >
                    <option value="1">1 Ngày</option>
                    <option value="2">2 Ngày 1 Đêm</option>
                    <option value="3">3 Ngày 2 Đêm</option>
                    <option value="4">4 Ngày 3 Đêm</option>
                    <option value="5+">Hơn 5 Ngày</option>
                  </select>
                </div>
                
                <div className={styles.inputGroup}>
                  <label><Wallet weight="bold" /> Ngân sách</label>
                  <select 
                    value={budget} 
                    onChange={(e) => setBudget(e.target.value)}
                    disabled={isGenerating}
                  >
                    <option value="Tiết kiệm">Tiết kiệm (Sinh viên)</option>
                    <option value="Trung bình">Trung bình (Thoải mái)</option>
                    <option value="Cao cấp">Cao cấp (Nghỉ dưỡng)</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                className={`${styles.generateBtn} ${isGenerating ? styles.loading : ""}`}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <CircleNotch weight="bold" className={styles.spinner} /> Đang phân tích...
                  </>
                ) : (
                  <>
                    <PaperPlaneRight weight="fill" /> Tạo Lịch Trình Ngay
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Result Section (Mock) */}
          {showResult && (
            <div className={styles.resultContainer} data-aos="fade-in">
              <h3 className={styles.resultHeader}>Kết quả gợi ý cho <span>{destination} ({days} ngày)</span></h3>
              <div className={styles.itineraryResult}>
                <div className={styles.journeyDay}>
                  <div className={styles.dayDot}></div>
                  <div className={styles.dayContent}>
                    <h4>Ngày 1: Khám phá bí ẩn</h4>
                    <p>Sáng: Thưởng thức đặc sản địa phương tại một quán nhỏ núp hẻm (được AI đánh giá 4.8/5 từ người dùng LocalGo).</p>
                    <p>Chiều: Tham quan các địa danh văn hóa, trải nghiệm làm đồ thủ công truyền thống.</p>
                    <p>Tối: Chill tại quán cà phê Acoustic view thung lũng, ngân sách phù hợp.</p>
                  </div>
                </div>
                
                <div className={styles.journeyDay}>
                   <div className={styles.dayDot}></div>
                   <div className={styles.dayContent}>
                    <h4>Ngày 2: Trải nghiệm thiên nhiên</h4>
                    <p>Đi dọc theo cung đường do chuyên gia đánh giá là đẹp nhất mùa này...</p>
                    <p className={styles.aiNote}>
                      <Sparkle weight="fill"/> <strong>AI Insight:</strong> Các địa điểm này hiện đang rất hot do hoa vừa nở rộ tuần trước.
                    </p>
                  </div>
                </div>
                
                <button className={styles.saveBtn}>Lưu vào máy</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AISuggestions;
