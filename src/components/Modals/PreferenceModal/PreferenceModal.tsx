import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Leaf, 
  Mountains, 
  Bank, 
  MusicNotes, 
  Island, 
  ForkKnife, 
  Crown, 
  ShoppingBag,
  WarningCircle,
  Selection,
  Cookie,
  Car,
  Timer,
  CaretLeft,
  Check
} from "@phosphor-icons/react";
import styles from "./PreferenceModal.module.scss";
import { updateUserPreferences, type UserPreferences } from "../../../services/userService";
import { toast } from "react-toastify";

interface PreferenceModalProps {
  userId: string | number;
  onClose: () => void;
  onComplete: () => void;
}

const TRAVEL_STYLES = [
  { id: "Chill", label: "Chill & Nghỉ dưỡng", icon: <Leaf /> },
  { id: "Adventure", label: "Khám phá mạo hiểm", icon: <Mountains /> },
  { id: "Culture", label: "Văn hóa lịch sử", icon: <Bank /> },
  { id: "Nightlife", label: "Sôi động ban đêm", icon: <MusicNotes /> },
  { id: "Beach", label: "Biển đảo & Nắng", icon: <Island /> },
  { id: "Food", label: "Thiên đường ẩm thực", icon: <ForkKnife /> },
  { id: "Luxury", label: "Sang trọng & Spa", icon: <Crown /> },
  { id: "Shopping", label: "Mua sắm & Thành phố", icon: <ShoppingBag /> },
];

const PreferenceModal: React.FC<PreferenceModalProps> = ({ userId, onClose, onComplete }) => {
  const [step, setStep] = useState(1);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences>({
    travelStyles: [],
    allergies: [],
    diet: "Bình thường",
    taste: "Hài hòa",
    transport: "Ô tô",
    travelPace: "Nghỉ dưỡng chậm",
  });

  const toggleStyle = (id: string) => {
    setSelectedStyles((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Save to backend
      const finalData = { ...preferences, travelStyles: selectedStyles };
      try {
        await updateUserPreferences(userId, finalData);
        toast.success("Đã lưu sở thích của bạn! ✨");
        onComplete();
      } catch (error) {
        toast.error("Có lỗi xảy ra khi lưu sở thích.");
        console.error(error);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.header}>
          <h2>Cá nhân hóa trải nghiệm</h2>
          <p>Hãy để AI giúp bạn thiết kế chuyến đi hoàn hảo nhất</p>
        </div>

        <div className={styles.stepIndicator}>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`${styles.dot} ${step === s ? styles.active : ""}`}
            />
          ))}
        </div>

        <div className={styles.body}>
          <AnimatePresence mode="wait" custom={step}>
            {step === 1 && (
              <motion.div
                key="step1"
                custom={1}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className={styles.tagsGrid}>
                  {TRAVEL_STYLES.map((style) => (
                    <div
                      key={style.id}
                      className={`${styles.tagCard} ${
                        selectedStyles.includes(style.id) ? styles.selected : ""
                      }`}
                      onClick={() => toggleStyle(style.id)}
                    >
                      <div className={styles.iconWrapper}>{style.icon}</div>
                      <span>{style.label}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                custom={1}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className={styles.selectionGroup}>
                  <h3><WarningCircle weight="bold" /> Dị ứng thực phẩm</h3>
                  <div className={styles.options}>
                    {["Hải sản", "Đậu phộng", "Sữa/Bơ", "Không có"].map((opt) => (
                      <div
                        key={opt}
                        className={`${styles.optionChip} ${
                          preferences.allergies.includes(opt) ? styles.active : ""
                        }`}
                        onClick={() =>
                          setPreferences((prev) => ({
                            ...prev,
                            allergies: prev.allergies.includes(opt)
                              ? prev.allergies.filter((a) => a !== opt)
                              : [...prev.allergies, opt],
                          }))
                        }
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.selectionGroup}>
                  <h3><Selection weight="bold" /> Chế độ ăn uống</h3>
                  <div className={styles.options}>
                    {["Bình thường", "Ăn chay", "Ăn thuần chay", "Keto"].map((opt) => (
                      <div
                        key={opt}
                        className={`${styles.optionChip} ${
                          preferences.diet === opt ? styles.active : ""
                        }`}
                        onClick={() => setPreferences({ ...preferences, diet: opt })}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.selectionGroup}>
                  <h3><Cookie weight="bold" /> Khẩu vị yêu thích</h3>
                  <div className={styles.options}>
                    {["Hài hòa", "Cay nồng", "Đậm đà", "Ngọt ngào", "Thanh đạm"].map((opt) => (
                      <div
                        key={opt}
                        className={`${styles.optionChip} ${
                          preferences.taste === opt ? styles.active : ""
                        }`}
                        onClick={() => setPreferences({ ...preferences, taste: opt })}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                custom={1}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.3 }}
              >
                <div className={styles.selectionGroup}>
                  <h3><Car weight="bold" /> Phương tiện di chuyển</h3>
                  <div className={styles.options}>
                    {["Ô tô riêng", "Xe máy", "Phương tiện công cộng", "Taxi/Grab"].map((opt) => (
                      <div
                        key={opt}
                        className={`${styles.optionChip} ${
                          preferences.transport === opt ? styles.active : ""
                        }`}
                        onClick={() => setPreferences({ ...preferences, transport: opt })}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.selectionGroup}>
                  <h3><Timer weight="bold" /> Tốc độ & Phong cách trải nghiệm</h3>
                  <div className={styles.options}>
                    {["Nghỉ dưỡng chậm", "Cân bằng", "Check-in nhanh", "Hành xác mạo hiểm"].map((opt) => (
                      <div
                        key={opt}
                        className={`${styles.optionChip} ${
                          preferences.travelPace === opt ? styles.active : ""
                        }`}
                        onClick={() => setPreferences({ ...preferences, travelPace: opt })}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ marginTop: '40px', padding: '20px', background: 'rgba(0,0,0,0.02)', borderRadius: '16px', fontSize: '14px', color: '#666', fontStyle: 'italic', textAlign: 'center' }}>
                  "Hệ thống sẽ dựa vào những lựa chọn này để gợi ý các địa điểm và lộ trình phù hợp nhất với con người bạn."
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={styles.footer}>
          {step > 1 ? (
            <button className={styles.btnBack} onClick={handleBack}>
              <CaretLeft weight="bold" style={{ verticalAlign: 'middle', marginRight: '4px' }} />
              Quay lại
            </button>
          ) : (
            <button className={styles.btnBack} onClick={onClose}>Bỏ qua</button>
          )}

          <button
            className={styles.btnNext}
            onClick={handleNext}
            disabled={step === 1 && selectedStyles.length === 0}
          >
            {step === 3 ? (
              <>Hoàn tất <Check weight="bold" style={{ marginLeft: '8px' }} /></>
            ) : (
              "Tiếp tục"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferenceModal;
