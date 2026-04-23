import React, { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { 
  Sparkle, UsersThree, ShieldCheck, MagicWand, 
  MapPinLine, CurrencyCircleDollar 
} from "phosphor-react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "./Login/Login";
import Register from "./Register/Register";
import styles from "./Auth.module.scss";

/**
 * Cấu hình nội dung hiển thị bên cánh trái cho từng chế độ (Login/Register)
 */
const AUTH_CONFIG = {
  register: {
    title: <>Bắt đầu hành trình <br /> tuyệt vời ngay.</>,
    description: "Tham gia cộng đồng du lịch thông minh để mở khóa toàn bộ tính năng độc quyền:",
    features: [
      { icon: <Sparkle weight="duotone" />, text: "Lên kế hoạch chuyến đi chỉ trong giây lát" },
      { icon: <UsersThree weight="duotone" />, text: "Chia sẻ và lưu trữ hành trình cá nhân" },
      { icon: <ShieldCheck weight="duotone" />, text: "Nhận gợi ý địa điểm chính xác từ chuyên gia AI" },
    ]
  },
  login: {
    title: <>Chào mừng bạn <br /> quay trở lại.</>,
    description: "Tiếp tục hành trình khám phá thế giới cùng TravelAi. Mọi kế hoạch của bạn vẫn đang chờ đợi:",
    features: [
      { icon: <MagicWand weight="duotone" />, text: "Tiếp tục các lịch trình đang dang dở" },
      { icon: <MapPinLine weight="duotone" />, text: "Xem lại các địa điểm yêu thích đã lưu" },
      { icon: <CurrencyCircleDollar weight="duotone" />, text: "Đồng bộ hóa ngân sách trên mọi thiết bị" },
    ]
  }
};

const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isSignUp = searchParams.get("mode") === "register";
  
  // Lấy cấu trúc nội dung dựa trên mode hiện tại
  const content = useMemo(() => isSignUp ? AUTH_CONFIG.register : AUTH_CONFIG.login, [isSignUp]);

  const toggleMode = () => {
    navigate(`/auth?mode=${isSignUp ? "login" : "register"}`);
  };

  return (
    <main className={styles.authMain}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={styles.authContainer}
      >
        {/* Cánh trái: Thông tin giới thiệu */}
        <div className={styles.authLeft}>
          <AnimatePresence mode="wait">
            <motion.div
              key={isSignUp ? "register-info" : "login-info"}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className={styles.leftContentBox}
            >
              <h1 className={styles.gradientText}>{content.title}</h1>
              <p className={styles.description}>{content.description}</p>
              <ul className={styles.authFeatures}>
                {content.features.map((feature, idx) => (
                  <li key={idx}>
                    <div className={styles.featureIcon}>{feature.icon}</div>
                    {feature.text}
                  </li>
                ))}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Cánh phải: Form Đăng nhập/Đăng ký */}
        <div className={styles.authRight}>
          <div className={styles.formWrapper}>
            <AnimatePresence mode="wait">
              <motion.div
                key={isSignUp ? "register" : "login"}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                {isSignUp ? (
                  <Register onToggle={toggleMode} />
                ) : (
                  <Login onToggle={toggleMode} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </main>
  );
};

export default Auth;