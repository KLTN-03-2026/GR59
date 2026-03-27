import React, { useState } from "react";
import {
  User,
  EnvelopeSimple,
  LockKey,
  Eye,
  EyeSlash,
  FacebookLogo,
  GoogleLogo,
} from "phosphor-react";
import { toast } from "react-toastify";
import styles from "./Register.module.scss";

interface Props {
  onToggle: () => void;
}

const Register: React.FC<Props> = ({ onToggle }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    pass: "",
    confirm: "",
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [terms, setTerms] = useState(false);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.pass !== formData.confirm)
      return toast.error("Mật khẩu không khớp!");
    if (!terms) return toast.warn("Bạn cần đồng ý với điều khoản!");

    toast.success("Đăng ký thành công! 🎉");
    setTimeout(() => onToggle(), 1500);
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.header}>
        <h2>Tạo tài khoản mới</h2>
        <p>Điền thông tin của bạn để gia nhập cộng đồng</p>
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
        <span>Hoặc tham gia bằng email</span>
      </div>

      <form onSubmit={handleRegister} className={styles.form}>
        <div className={styles.group}>
          <label>Họ và tên</label>
          <div className={styles.inputWrap}>
            <User className={styles.icon} weight="duotone" />
            <input
              type="text"
              placeholder="Nguyễn Văn A"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className={styles.group}>
          <label>Email của bạn</label>
          <div className={styles.inputWrap}>
            <EnvelopeSimple className={styles.icon} weight="duotone" />
            <input
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className={styles.group}>
          <label>Mật khẩu</label>
          <div className={styles.inputWrap}>
            <LockKey className={styles.icon} weight="duotone" />
            <input
              type={showPass ? "text" : "password"}
              placeholder="Tạo mật khẩu (ít nhất 6 ký tự)"
              value={formData.pass}
              onChange={(e) =>
                setFormData({ ...formData, pass: e.target.value })
              }
              required
            />
            <span className={styles.eye} onClick={() => setShowPass(!showPass)}>
              {showPass ? (
                <EyeSlash weight="duotone" />
              ) : (
                <Eye weight="duotone" />
              )}
            </span>
          </div>
        </div>

        <div className={styles.group}>
          <label>Xác nhận mật khẩu</label>
          <div className={styles.inputWrap}>
            <LockKey className={styles.icon} weight="duotone" />
            <input
              type={showConfirm ? "text" : "password"}
              placeholder="Nhập lại mật khẩu"
              value={formData.confirm}
              onChange={(e) =>
                setFormData({ ...formData, confirm: e.target.value })
              }
              required
            />
            <span
              className={styles.eye}
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? (
                <EyeSlash weight="duotone" />
              ) : (
                <Eye weight="duotone" />
              )}
            </span>
          </div>
        </div>

        <div className={styles.checkboxGroup}>
          <input
            type="checkbox"
            id="terms"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            required
          />
          <label htmlFor="terms">Tôi đồng ý với Điều khoản và Chính sách</label>
        </div>

        <button type="submit" className={styles.btnSubmit}>
          Đăng ký hoàn tất
        </button>
      </form>

      <div className={styles.footer}>
        Bạn đã có tài khoản? <button onClick={onToggle}>Đăng nhập</button>
      </div>
    </div>
  );
};

export default Register;
