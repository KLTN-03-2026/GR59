import React, { useState } from "react";
import {
  EnvelopeSimple,
  LockKey,
  Eye,
  EyeSlash,
  FacebookLogo,
} from "phosphor-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./Login.module.scss";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLoginExport from '@greatsumini/react-facebook-login';
const FacebookLogin = (FacebookLoginExport as any).default || FacebookLoginExport;
import { postLogin, postLoginGoogle, postLoginFacebook } from "../../../services/userService";
import axios from "axios";

interface Props {
  onToggle: () => void;
  navigate: (path: string) => void;
}

const Login: React.FC<Props> = ({ onToggle, navigate }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Xử lý đăng nhập Email/Password
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // --- Validation ---
    const cleanEmail = email.trim();
    const isValidEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!cleanEmail || !password) {
      return toast.error("Vui lòng nhập đầy đủ thông tin!");
    }
    if (!isValidEmail.test(cleanEmail)) {
      return toast.error("Email không đúng định dạng!");
    }

    setIsLoading(true);
    try {
      // Gọi API đăng nhập thật
      const response = await postLogin(cleanEmail, password);

      if (response.data && response.data.EC === 0) {
        const data = response.data.DT;
        const user = data.user;

        // Lưu thông tin vào LocalStorage
        if (data.accessToken) localStorage.setItem("token", data.accessToken);
        if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(user)); 
        
        if (user.fullName) localStorage.setItem("username", user.fullName);
        if (user.email) localStorage.setItem("email", user.email);
        if (user.createdAt) localStorage.setItem("createdAt", user.createdAt);

        toast.success(`Chào mừng ${user.fullName || user.email} trở lại! 👋`);
        navigate("/");
      } else {
        toast.error(response.data?.EM || "Email hoặc mật khẩu không chính xác!");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const serverError = error.response?.data as { EM?: string; message?: string };
        toast.error(serverError?.EM || serverError?.message || "Tài khoản hoặc mật khẩu không đúng!");
      } else {
        toast.error("Đã xảy ra lỗi không xác định!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.header}>
        <h2>Chào mừng trở lại</h2>
        <p>Vui lòng nhập thông tin để truy cập</p>
      </div>

      <div className={styles.socialButtons} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <div style={{ flex: 1, padding: "0 24px", height: "44px", overflow: "hidden", borderRadius: "30px", display: "flex", justifyContent: "center" }}>
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              try {
                setIsLoading(true);
                if (!credentialResponse.credential) throw new Error("No credential");
                const response = await postLoginGoogle(credentialResponse.credential);
                
                if (response.data && response.data.EC === 0) {
                  const data = response.data.DT;
                  const user = data.user;
                  if (data.accessToken) localStorage.setItem("token", data.accessToken);
                  if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
                  localStorage.setItem("user", JSON.stringify(user)); 
                  if (user.fullName) localStorage.setItem("username", user.fullName);
                  if (user.email) localStorage.setItem("email", user.email);
                  if (user.createdAt) localStorage.setItem("createdAt", user.createdAt);
                  toast.success("Đăng nhập Google thành công! 🚀");
                  navigate("/");
                } else {
                  toast.error(response.data?.EM || "Đăng nhập Google thất bại!");
                }
              } catch (error) {
                toast.error("Lỗi đăng nhập Google!");
              } finally {
                setIsLoading(false);
              }
            }}
            onError={() => {
              toast.error("Đăng nhập Google thất bại!");
            }}
            useOneTap={false}
            theme="outline"
            size="large"
            text="signin_with"
            shape="pill"
            logo_alignment="center"
          />
        </div>
        <div style={{ flex: 1, height: "44px" }}>
          <FacebookLogin
            appId={import.meta.env.VITE_FACEBOOK_APP_ID || "3832704913701035"}
            onSuccess={async (response: any) => {
              try {
                setIsLoading(true);
                const res = await postLoginFacebook(response.accessToken);
                if (res.data && res.data.EC === 0) {
                  const data = res.data.DT;
                  const user = data.user;
                  if (data.accessToken) localStorage.setItem("token", data.accessToken);
                  if (data.refreshToken) localStorage.setItem("refreshToken", data.refreshToken);
                  localStorage.setItem("user", JSON.stringify(user));
                  if (user.fullName) localStorage.setItem("username", user.fullName);
                  if (user.email) localStorage.setItem("email", user.email);
                  if (user.createdAt) localStorage.setItem("createdAt", user.createdAt);
                  toast.success("Đăng nhập Facebook thành công! 🚀");
                  navigate("/");
                } else {
                  toast.error(res.data?.EM || "Đăng nhập Facebook thất bại!");
                }
              } catch (error: any) {
                toast.error("Lỗi đăng nhập Facebook!");
              } finally {
                setIsLoading(false);
              }
            }}
            onFail={(error: any) => {
              console.error("Facebook Login Failed:", error);
              toast.error("Đăng nhập Facebook bị hủy bỏ hoặc thất bại!");
            }}
            render={({ onClick }: any) => (
              <button
                type="button"
                className={`${styles.socialBtn} ${styles.facebook}`}
                onClick={onClick}
                disabled={isLoading}
                style={{ width: "100%", height: "100%", margin: 0 }}
              >
                <FacebookLogo weight="fill" size={20} /> Facebook
              </button>
            )}
          />
        </div>
      </div>

      <div className={styles.divider}>
        <span>Hoặc đăng nhập bằng email</span>
      </div>

      <form onSubmit={handleLogin} className={styles.form}>
        <div className={styles.group}>
          <div className={styles.labelRow}>
            <label>Email của bạn</label>
          </div>{" "}
          <div className={styles.inputWrap}>
            <EnvelopeSimple className={styles.icon} weight="duotone" />
            <input
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
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
              disabled={isLoading}
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

        <button type="submit" className={styles.btnSubmit} disabled={isLoading}>
          {isLoading ? "Đang kiểm tra..." : "Đăng nhập"}
        </button>
      </form>

      <div className={styles.footer}>
        Bạn chưa có tài khoản?{" "}
        <button type="button" onClick={onToggle}>
          Đăng ký ngay
        </button>
      </div>
    </div>
  );
};

export default Login;
