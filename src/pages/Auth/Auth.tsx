import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

import {
  EnvelopeSimple,
  LockKey,
  Eye,
  EyeSlash,
  User,
  MagicWand,
  MapPinLine,
  CurrencyCircleDollar,
  Sparkle,
  UsersThree,
  CheckCircle,
} from "phosphor-react";
import styles from "./Auth.module.scss";

const Auth: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(
    searchParams.get("mode") === "register",
  );
  const [showPassword, setShowPassword] = useState(false);

  // --- TÁCH RIÊNG CÁC STATE NHƯ BẠN MUỐN ---
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);

  // Đồng bộ URL với giao diện
  useEffect(() => {
    setIsSignUp(searchParams.get("mode") === "register");
  }, [searchParams]);

  const validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

// --- XỬ LÝ ĐĂNG NHẬP ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      toast.error("Email không đúng định dạng!");
      return;
    }
    if (password.length < 6) {
      toast.error("Mật khẩu phải có ít nhất 6 ký tự!");
      return;
    }

    // Giả lập gọi API thành công
    toast.success("Chào mừng bạn trở lại! 👋");
    navigate("/");
  };

// --- XỬ LÝ ĐĂNG KÝ ---
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    // Thực hiện Validate từng bước
    if (fullName.trim().length < 2) {
      toast.warn("Vui lòng nhập đầy đủ họ tên!");
      return;
    }
    if (!validateEmail(email)) {
      toast.error("Email không hợp lệ!");
      return;
    }
    if (password.length < 8) {
      toast.error("Mật khẩu đăng ký phải từ 8 ký tự trở lên!");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Xác nhận mật khẩu không khớp!");
      return;
    }
    if (!terms) {
      toast.info("Bạn cần đồng ý với điều khoản để tiếp tục!");
      return;
    }

    // Nếu mọi thứ OK
    toast.success("Đăng ký tài khoản thành công! 🎉");
    setTimeout(() => {
        navigate("/auth?mode=login");
    }, 1500);
  };
const toggleMode = () => {
    const newMode = isSignUp ? "login" : "register";
    navigate(`/auth?mode=${newMode}`);
    // Reset form khi chuyển chế độ nếu muốn
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <main className={styles.authMain}>
      <div
        className={`${styles.authContainer} ${isSignUp ? styles.isSignup : ""}`}
      >
        {/* Phần bên trái: Info Panels */}
        <div className={styles.authLeft}>
          <div
            className={`${styles.leftContentBox} ${!isSignUp ? styles.infoActive : ""}`}
          >
            <h1 className={styles.gradientText}>
              Hành trình mơ ước <br /> trong tầm tay.
            </h1>
            <ul className={styles.authFeatures}>
              <li>
                <div className={styles.featureIcon}>
                  <MagicWand weight="duotone" />
                </div>{" "}
                Tự động hóa lịch trình
              </li>
              <li>
                <div className={styles.featureIcon}>
                  <MapPinLine weight="duotone" />
                </div>{" "}
                Khám phá địa điểm ẩn
              </li>
              <li>
                <div className={styles.featureIcon}>
                  <CurrencyCircleDollar weight="duotone" />
                </div>{" "}
                Tối ưu ngân sách
              </li>
            </ul>
          </div>

          <div
            className={`${styles.leftContentBox} ${isSignUp ? styles.infoActive : ""}`}
          >
            <h1 className={styles.gradientText}>
              Bắt đầu hành trình <br /> tuyệt vời ngay.
            </h1>
            <ul className={styles.authFeatures}>
              <li>
                <div className={styles.featureIcon}>
                  <Sparkle weight="duotone" />
                </div>{" "}
                Lên kế hoạch trong giây lát
              </li>
              <li>
                <div className={styles.featureIcon}>
                  <UsersThree weight="duotone" />
                </div>{" "}
                Chia sẻ hành trình cá nhân
              </li>
              <li>
                <div className={styles.featureIcon}>
                  <CheckCircle weight="duotone" />
                </div>{" "}
                Gợi ý chính xác từ AI
              </li>
            </ul>
          </div>
        </div>

        {/* Phần bên phải: Forms */}
        <div className={styles.authRight}>
          {/* FORM ĐĂNG NHẬP */}
          <div
            className={`${styles.formSection} ${!isSignUp ? styles.sectionActive : ""}`}
          >
            <div className={styles.formHeader}>
              <h2>Chào mừng trở lại</h2>
              <p>Vui lòng nhập thông tin để truy cập</p>
            </div>

            <form onSubmit={handleLogin} className={styles.authForm}>
              <div className={styles.formGroup}>
                <label>Email của bạn</label>
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

              <div className={styles.formGroup}>
                <label>Mật khẩu</label>
                <div className={styles.inputContainer}>
                  <LockKey className={styles.inputIcon} weight="duotone" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
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

              <button type="submit" className={styles.btnSubmit}>
                Đăng nhập
              </button>
            </form>
            <div className={styles.authFooterText}>
              Bạn chưa có tài khoản?{" "}
              <button onClick={toggleMode}>Đăng ký ngay</button>
            </div>
          </div>

          {/* FORM ĐĂNG KÝ */}
          <div
            className={`${styles.formSection} ${isSignUp ? styles.sectionActive : ""}`}
          >
            <div className={styles.formHeader}>
              <h2>Tạo tài khoản mới</h2>
            </div>

            <form onSubmit={handleRegister} className={styles.authForm}>
              <div className={styles.formGroup}>
                <label>Họ và tên</label>
                <div className={styles.inputContainer}>
                  <User className={styles.inputIcon} weight="duotone" />
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Email</label>
                <div className={styles.inputContainer}>
                  <EnvelopeSimple
                    className={styles.inputIcon}
                    weight="duotone"
                  />
                  <input
                    type="email"
                    placeholder="name@example.com"
                    value={email} // Dùng chung state email hoặc tách ra tùy bạn
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Mật khẩu</label>
                <div className={styles.inputContainer}>
                  <LockKey className={styles.inputIcon} weight="duotone" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Tạo mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Xác nhận mật khẩu</label>
                <div className={styles.inputContainer}>
                  <LockKey className={styles.inputIcon} weight="duotone" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập lại mật khẩu"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.checkboxGroup}>
                <input
                  type="checkbox"
                  checked={terms}
                  onChange={(e) => setTerms(e.target.checked)}
                  required
                />
                <label>Tôi đồng ý với Điều khoản & Chính sách</label>
              </div>

              <button type="submit" className={styles.btnSubmit}>
                Đăng ký hoàn tất
              </button>
            </form>
            <div className={styles.authFooterText}>
              Bạn đã có tài khoản?{" "}
              <button onClick={toggleMode}>Đăng nhập</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Auth;
