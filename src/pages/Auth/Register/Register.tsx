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
import { useNavigate } from "react-router-dom"; // Sửa lại từ "react-router" thành "react-router-dom"
import { postSignUp } from "../../../services/userService"; // Đường dẫn file service của bạn
import axios from "axios";

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
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- 1. Validation Logic ---
    const cleanName = formData.name.trim();
    const cleanEmail = formData.email.trim();
    const isValidEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,32}$/;

    if (cleanName.length < 4) return toast.error("Tên quá ngắn, không hợp lệ");
    if (!isValidEmail.test(cleanEmail))
      return toast.error("Email không đúng định dạng");
    if (!passwordRegex.test(formData.pass)) {
      return toast.error(
        "Mật khẩu phải từ 8-32 ký tự, bao gồm chữ hoa, chữ thường và số",
      );
    }
    if (formData.pass !== formData.confirm)
      return toast.error("Mật khẩu xác nhận không khớp!");
    if (!terms) return toast.warn("Bạn cần đồng ý với điều khoản!");

    // --- 2. Gọi API Thật (Backend) ---
    setIsLoading(true);
    try {
      // Gọi service (File axios-customize đã bọc sẵn EC, EM, DT)
      const res = await postSignUp(cleanName, cleanEmail, formData.pass);
      console.log(res);

      if (res.data && res.data.EC === 0) {
        toast.success(res.data.EM);
        setTimeout(() => {
          navigate("/auth?mode=login");
        }, 1500);
      } else {
        toast.error(res.data.EM || "Đăng ký thất bại!");
      }
    } catch (error: unknown) {
      // Xử lý lỗi mà không dùng 'any'
      if (axios.isAxiosError(error)) {
        const serverError = error.response?.data as { EM?: string; message?: string };
        toast.error(serverError?.EM || serverError?.message || "Lỗi xử lý từ server");
      } else {
        toast.error("Đã xảy ra lỗi không xác định");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.header}>
        <h2>Tạo tài khoản mới</h2>
        <p>Gia nhập cộng đồng du lịch thông minh</p>
      </div>

      <div className={styles.socialButtons}>
        <button
          type="button"
          className={`${styles.socialBtn} ${styles.google}`}
        >
          <GoogleLogo size={20} /> Google
        </button>
        <button
          type="button"
          className={`${styles.socialBtn} ${styles.facebook}`}
        >
          <FacebookLogo weight="fill" size={20} /> Facebook
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
              name="name"
              type="text"
              placeholder="Nguyễn Văn A"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className={styles.group}>
          <label>Email của bạn</label>
          <div className={styles.inputWrap}>
            <EnvelopeSimple className={styles.icon} weight="duotone" />
            <input
              name="email"
              type="email"
              placeholder="name@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className={styles.group}>
          <label>Mật khẩu</label>
          <div className={styles.inputWrap}>
            <LockKey className={styles.icon} weight="duotone" />
            <input
              name="pass"
              type={showPass ? "text" : "password"}
              placeholder="8-32 ký tự, hoa, thường, số"
              value={formData.pass}
              onChange={handleChange}
              required
              disabled={isLoading}
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
              name="confirm"
              type={showConfirm ? "text" : "password"}
              placeholder="Nhập lại mật khẩu"
              value={formData.confirm}
              onChange={handleChange}
              required
              disabled={isLoading}
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
            disabled={isLoading}
          />
          <label htmlFor="terms">Tôi đồng ý với Điều khoản và Chính sách</label>
        </div>

        <button type="submit" className={styles.btnSubmit} disabled={isLoading}>
          {isLoading ? "Đang xử lý..." : "Đăng ký hoàn tất"}
        </button>
      </form>

      <div className={styles.footer}>
        Bạn đã có tài khoản?{" "}
        <button type="button" onClick={onToggle}>
          Đăng nhập
        </button>
      </div>
    </div>
  );
};

export default Register;
