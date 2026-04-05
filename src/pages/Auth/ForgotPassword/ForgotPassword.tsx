import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  EnvelopeSimple,
  ArrowBendUpLeft,
  PaperPlaneTilt,
  ShieldCheck,
  Lock,
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeSlash,
} from "phosphor-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify"; // Đảm bảo bạn đã cài react-toastify
import styles from "./ForgotPassword.module.scss";
import {
  postResetPassword,
  postSendOTP,
  postVerifyOTP,
} from "../../../services/userService";

type Step = "email" | "otp" | "reset" | "success";

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step === "otp") {
      otpRefs.current[0]?.focus();
    }
  }, [step]);

  const slideVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
    transition: { duration: 0.3 },
  };

  // 1. Xử lý gửi Email (Bước 1)
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail) return toast.error("Vui lòng nhập email!");

    try {
      setIsLoading(true);
      const res = await postSendOTP(cleanEmail);
      if (res.data && (res.data.status === 200 || res.data.EC === 0)) {
        setStep("otp");
        toast.success(
          res.data.message || "Mã OTP đã được gửi về Email của bạn! 📧",
        );
      } else {
        toast.error(
          res.data?.EM || res.data?.message || "Gửi mã OTP thất bại!",
        );
      }
    } catch (error) {
      toast.error("Lỗi kết nối Server khi gửi OTP!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // 2. Xử lý xác nhận mã OTP (Bước 2)
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join("");

    if (fullOtp.length < 6) {
      return toast.error("Vui lòng nhập đủ 6 số OTP!");
    }

    try {
      setIsLoading(true);
      // Gọi API xác minh OTP
      const res = await postVerifyOTP(email, Number(fullOtp));

      if (res.data && (res.data.status === 200 || res.data.EC === 0)) {
        setStep("reset");
        toast.success(res.data.message || "Xác minh danh tính thành công!");
      } else {
        toast.error(
          res.data?.EM ||
            res.data?.message ||
            "Mã OTP không đúng hoặc đã hết hạn!",
        );
      }
    } catch (error) {
      toast.error("Lỗi kết nối Server khi xác minh OTP!");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Xử lý cập nhật mật khẩu mới (Bước 3 - Cập nhật db.json)
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return toast.error("Mật khẩu xác nhận không khớp!");
    }

    if (newPassword.length < 6) {
      return toast.error("Mật khẩu mới phải từ 6 ký tự trở lên!");
    }

    try {
      setIsLoading(true);
      // Gọi API đặt lại mật khẩu mới
      const res = await postResetPassword(email, newPassword);
      
      if (res.data && (res.data.status === 200 || res.data.EC === 0)) {
        setStep("success");
        toast.success(res.data.message || "Cập nhật mật khẩu thành công!");
      } else {
        toast.error(res.data.EM || res.data.message || "Có lỗi xảy ra, vui lòng thử lại!");
      }
    } catch (error: unknown) {
      // Xử lý lỗi chuẩn TypeScript (Tránh lỗi 'error' is of type 'unknown')
      let errorMessage = "Lỗi kết nối Server!";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
          <div className={styles.leftContentBox}>
            <h1 className={styles.gradientText}>
              {step === "email" && "Lấy lại quyền \n truy cập của bạn."}
              {step === "otp" && "Xác minh \n danh tính của bạn."}
              {step === "reset" && "Thiết lập \n mật khẩu mới."}
              {step === "success" && "Khôi phục \n thành công!"}
            </h1>
            <p className={styles.description}>
              {step === "email" &&
                "Đừng lo lắng! Nhập email tài khoản của bạn và làm theo hướng dẫn. Chúng tôi giúp bạn:"}
              {step === "otp" &&
                "Mã xác minh đã được gửi đến email của bạn. Vui lòng kiểm tra và nhập mã để tiếp tục."}
              {step === "reset" &&
                "Vui lòng chọn một mật khẩu mạnh để bảo vệ tài khoản của bạn tốt hơn."}
              {step === "success" &&
                "Tài khoản của bạn đã được cập nhật thành công. Bây giờ bạn có thể trải nghiệm lại Travel AI."}
            </p>

            <ul className={styles.authFeatures}>
              <li>
                <div className={styles.featureIcon}>
                  <PaperPlaneTilt weight="duotone" />
                </div>
                Nhận đường dẫn khôi phục cấp tốc
              </li>
              <li>
                <div className={styles.featureIcon}>
                  <ShieldCheck weight="duotone" />
                </div>
                Xác minh qua mã OTP 6 chữ số
              </li>
              <li>
                <div className={styles.featureIcon}>
                  <Lock weight="duotone" />
                </div>
                Đặt lại mật khẩu mới an toàn
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.authRight}>
          <div className={styles.formSection}>
            <AnimatePresence mode="wait">
              {step === "email" && (
                <motion.div key="email" {...slideVariants}>
                  <div className={styles.formHeader}>
                    <h2>Quên mật khẩu?</h2>
                    <p>Vui lòng nhập Email để nhận mã OTP</p>
                  </div>
                  <form
                    onSubmit={handleEmailSubmit}
                    className={styles.authForm}
                  >
                    <div className={styles.formGroup}>
                      <label>Email tài khoản</label>
                      <div className={styles.inputContainer}>
                        <EnvelopeSimple
                          className={styles.inputIcon}
                          weight="duotone"
                        />
                        <input
                          type="email"
                          placeholder="name@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <button type="submit" className={styles.btnSubmit}>
                      Gửi mã xác nhận
                    </button>
                  </form>
                  <div className={styles.authFooterText}>
                    <button onClick={() => navigate("/auth?mode=login")}>
                      <ArrowBendUpLeft size={16} weight="bold" /> Quay lại Đăng
                      nhập
                    </button>
                  </div>
                </motion.div>
              )}

              {step === "otp" && (
                <motion.div key="otp" {...slideVariants}>
                  <button
                    className={styles.btnBack}
                    onClick={() => setStep("email")}
                  >
                    <div className={styles.btnIcon}>
                      <ArrowLeft size={20} />
                    </div>
                  </button>
                  <div className={styles.formHeader}>
                    <h2>Xác minh OTP</h2>
                    <p>
                      Đã gửi tới{" "}
                      <span style={{ color: "#ff4c94", fontWeight: 700 }}>
                        {email}
                      </span>
                    </p>
                  </div>
                  <form onSubmit={handleOtpSubmit} className={styles.authForm}>
                    <div className={styles.otpContainer}>
                      {otp.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => {
                            otpRefs.current[idx] = el;
                          }}
                          type="text"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          className={styles.otpInput}
                        />
                      ))}
                    </div>
                    <button type="submit" className={styles.btnSubmit}>
                      Xác minh ngay
                    </button>
                  </form>
                  <div className={styles.authFooterText}>
                    Chưa nhận được mã?{" "}
                    <button onClick={() => toast.info("Mã mới: 123456")}>
                      Gửi lại mã
                    </button>
                  </div>
                </motion.div>
              )}

              {step === "reset" && (
                <motion.div key="reset" {...slideVariants}>
                  <div className={styles.formHeader}>
                    <h2>Mật khẩu mới</h2>
                    <p>Hãy tạo mật khẩu mới cho tài khoản của bạn</p>
                  </div>
                  <form
                    onSubmit={handleResetSubmit}
                    className={styles.authForm}
                  >
                    <div className={styles.formGroup}>
                      <label>Mật khẩu mới</label>
                      <div className={styles.inputContainer}>
                        <Lock className={styles.inputIcon} weight="duotone" />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Nhập mật khẩu mới"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                          disabled={isLoading}
                        />
                        <span
                          className={styles.eyeIcon}
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeSlash weight="duotone" />
                          ) : (
                            <Eye weight="duotone" />
                          )}
                        </span>
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Xác nhận lại</label>
                      <div className={styles.inputContainer}>
                        <Lock className={styles.inputIcon} weight="duotone" />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Nhập lại mật khẩu"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className={styles.btnSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? "Đang xử lý..." : "Cập nhật mật khẩu"}
                    </button>
                  </form>
                </motion.div>
              )}

              {step === "success" && (
                <motion.div
                  key="success"
                  {...slideVariants}
                  style={{ textAlign: "center" }}
                >
                  <div className={styles.successIconBox}>
                    <CheckCircle size={60} weight="fill" />
                  </div>
                  <div
                    className={styles.formHeader}
                    style={{ textAlign: "center" }}
                  >
                    <h2>Thành công!</h2>
                    <p>Mật khẩu đã được thay đổi. Chào mừng bạn trở lại!</p>
                  </div>
                  <button
                    className={styles.btnSubmit}
                    style={{
                      background:
                        "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      boxShadow: "0 8px 25px rgba(16, 185, 129, 0.3)",
                    }}
                    onClick={() => navigate("/auth?mode=login")}
                  >
                    Đăng nhập ngay
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </main>
  );
};

export default ForgotPassword;
