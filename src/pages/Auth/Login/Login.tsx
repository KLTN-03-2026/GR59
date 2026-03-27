import React, { useState } from "react";
import {
  EnvelopeSimple,
  LockKey,
  Eye,
  EyeSlash,
  FacebookLogo,
  GoogleLogo,
} from "phosphor-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./Login.module.scss";

interface Props {
  onToggle: () => void;
  navigate: (path: string) => void;
}

const Login: React.FC<Props> = ({ onToggle, navigate }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return toast.error("Mật khẩu tối thiểu 6 ký tự!");
    toast.success("Chào mừng bạn trở lại! 👋");
    navigate("/");
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.header}>
        <h2>Chào mừng trở lại</h2>
        <p>Vui lòng nhập thông tin để truy cập</p>
      </div>

      <div className={styles.socialButtons}>
        <button className={`${styles.socialBtn} ${styles.google}`}>
          <GoogleLogo size={20} />
          Google
        </button>
        <button className={`${styles.socialBtn} ${styles.facebook}`}>
          <FacebookLogo weight="fill" size={20} />
          Facebook
        </button>
      </div>

      <div className={styles.divider}>
        <span>Hoặc đăng nhập bằng email</span>
      </div>

      <form onSubmit={handleLogin} className={styles.form}>
        <div className={styles.group}>
          <div className={styles.labelRow}>
            <label>Email của bạn</label>
          </div>
          <div className={styles.inputWrap}>
            <EnvelopeSimple className={styles.icon} weight="duotone" />
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        <div className={styles.group}>
          <div className={styles.labelRow}>
            <label>Mật khẩu</label>
            <Link to="/forgot-password" className={styles.forgotPass}>
              Quên mật khẩu?
            </Link>
          </div>
          <div className={styles.inputWrap}>
            <LockKey className={styles.icon} weight="duotone" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className={styles.eye}
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

      <div className={styles.footer}>
        Bạn chưa có tài khoản? <button onClick={onToggle}>Đăng ký ngay</button>
      </div>
    </div>
  );
};

export default Login;
