import { useNavigate, useSearchParams } from "react-router-dom";
import { Sparkle, UsersThree, ShieldCheck, MagicWand, MapPinLine, CurrencyCircleDollar } from "phosphor-react";
import { motion, AnimatePresence } from "framer-motion";
import Login from "./Login/Login";
import Register from "./Register/Register";
import styles from "./Auth.module.scss";

const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const isSignUp = searchParams.get("mode") === "register";

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
        <div className={styles.authLeft}>
          <AnimatePresence mode="wait">
            {isSignUp ? (
              <motion.div
                key="register-info"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className={styles.leftContentBox}
              >
                <h1 className={styles.gradientText}>Bắt đầu hành trình <br /> tuyệt vời ngay.</h1>
                <p className={styles.description}>
                  Tham gia cộng đồng du lịch thông minh để mở khóa toàn bộ tính năng độc quyền:
                </p>
                <ul className={styles.authFeatures}>
                  <li>
                    <div className={styles.featureIcon}><Sparkle weight="duotone" /></div>
                    Lên kế hoạch chuyến đi chỉ trong giây lát
                  </li>
                  <li>
                    <div className={styles.featureIcon}><UsersThree weight="duotone" /></div>
                    Chia sẻ và lưu trữ hành trình cá nhân
                  </li>
                  <li>
                    <div className={styles.featureIcon}><ShieldCheck weight="duotone" /></div>
                    Nhận gợi ý địa điểm chính xác từ chuyên gia AI
                  </li>
                </ul>
              </motion.div>
            ) : (
              <motion.div
                key="login-info"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.4 }}
                className={styles.leftContentBox}
              >
                <h1 className={styles.gradientText}>Chào mừng bạn <br /> quay trở lại.</h1>
                <p className={styles.description}>
                  Tiếp tục hành trình khám phá thế giới cùng TravelAi. Mọi kế hoạch của bạn vẫn đang chờ đợi:
                </p>
                <ul className={styles.authFeatures}>
                  <li>
                    <div className={styles.featureIcon}><MagicWand weight="duotone" /></div>
                    Tiếp tục các lịch trình đang dang dở
                  </li>
                  <li>
                    <div className={styles.featureIcon}><MapPinLine weight="duotone" /></div>
                    Xem lại các địa điểm yêu thích đã lưu
                  </li>
                  <li>
                    <div className={styles.featureIcon}><CurrencyCircleDollar weight="duotone" /></div>
                    Đồng bộ hóa ngân sách trên mọi thiết bị
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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