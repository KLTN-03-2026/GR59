import React, { useState } from "react";
import {
  EnvelopeSimple,
  Eye,
  EyeSlash,
  FacebookLogo,
  GoogleLogo,
  LockKey,
  User,
} from "phosphor-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  postLoginFacebook,
  postLoginGoogle,
  postSignUp,
  type AuthResponseData,
} from "../../../services/userService";
import styles from "./Register.module.scss";
import { useGoogleLogin } from "@react-oauth/google";
import FacebookLoginExport from "@greatsumini/react-facebook-login";
const FacebookLogin =
  (FacebookLoginExport as { default?: typeof FacebookLoginExport }).default ||
  FacebookLoginExport;
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

  // Helper function to save tokens and user data
  const saveAuthData = (data: AuthResponseData) => {
    if (data.accessToken) localStorage.setItem("token", data.accessToken);
    if (data.refreshToken)
      localStorage.setItem("refreshToken", data.refreshToken);

    const user = data.user;
    localStorage.setItem("user", JSON.stringify(user));
    if (user.fullName) localStorage.setItem("username", user.fullName);
    if (user.email) localStorage.setItem("email", user.email);
    if (user.createdAt) localStorage.setItem("createdAt", user.createdAt);
  };

  const loginGoogle = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      if (tokenResponse.access_token) {
        handleGoogleSuccess(tokenResponse.access_token);
      }
    },
    onError: () => {
      toast.error("Đăng ký Google thất bại!");
    },
  });

  // Logic xử lý khi đăng ký/đăng nhập Google thành công
  const handleGoogleSuccess = async (credential: string) => {
    try {
      setIsLoading(true);
      const response = await postLoginGoogle(credential);

      if (response.data && response.data.status === 200 && response.data.data) {
        saveAuthData(response.data.data);
        toast.success("Đăng ký Google thành công! 🚀");
        navigate("/");
      } else {
        toast.error(response.data?.message || "Đăng ký Google thất bại!");
      }
    } catch (error) {
      console.error("Google Register Error:", error);
      toast.error("Lỗi đăng ký Google!");
    } finally {
      setIsLoading(false);
    }
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

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

    setIsLoading(true);
    try {
      const res = await postSignUp(cleanName, cleanEmail, formData.pass);

      if (res.data && res.data.status === 200) {
        toast.success(res.data.message || "Đăng ký thành công!");
        setTimeout(() => {
          onToggle();
        }, 1500);
      } else {
        toast.error(res.data.message || "Đăng ký thất bại!");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const serverError = error.response?.data as {
          EM?: string;
          message?: string;
        };
        toast.error(
          serverError?.EM || serverError?.message || "Lỗi xử lý từ server",
        );
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
        <div className={styles.googleButtonWrap}>
          <button
            type="button"
            className={styles.socialBtn}
            onClick={() => loginGoogle()}
            disabled={isLoading}
          >
            <GoogleLogo weight="bold" size={20} /> Google
          </button>
        </div>
        <div className={styles.facebookButtonWrap}>
          <FacebookLogin
            appId={import.meta.env.VITE_FACEBOOK_APP_ID || "3832704913701035"}
            onSuccess={async (response: { accessToken: string }) => {
              try {
                setIsLoading(true);
                const res = await postLoginFacebook(response.accessToken);
                if (
                  res.data &&
                  res.data.status === 200 &&
                  res.data.data
                ) {
                  saveAuthData(res.data.data);
                  toast.success("Đăng ký Facebook thành công! 🚀");
                  navigate("/");
                } else {
                  toast.error(
                    res.data?.message ||
                      "Đăng ký Facebook thất bại!",
                  );
                }
              } catch (error: unknown) {
                console.error("Facebook Register Error:", error);
                toast.error("Lỗi đăng ký Facebook!");
              } finally {
                setIsLoading(false);
              }
            }}
            render={({ onClick }: { onClick?: () => void }) => (
              <button
                type="button"
                className={`${styles.socialBtn} ${styles.facebook}`}
                onClick={onClick}
                disabled={isLoading}
              >
                <FacebookLogo weight="fill" size={20} /> Facebook
              </button>
            )}
          />
        </div>
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
            <span className={styles.eye} onClick={() => !isLoading && setShowPass(!showPass)}>
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
              onClick={() => !isLoading && setShowConfirm(!showConfirm)}
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
