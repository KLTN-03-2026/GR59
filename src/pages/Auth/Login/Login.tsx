import React, { useState } from "react";
import {
  EnvelopeSimple,
  LockKey,
  Eye,
  EyeSlash,
  FacebookLogo,
  GoogleLogo,
} from "phosphor-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./Login.module.scss";
import { GoogleLogin } from "@react-oauth/google";
import type { CredentialResponse } from "@react-oauth/google";
import FacebookLoginExport from "@greatsumini/react-facebook-login";
const FacebookLogin =
  (FacebookLoginExport as { default?: typeof FacebookLoginExport }).default ||
  FacebookLoginExport;
import {
  postLogin,
  postLoginGoogle,
  postLoginFacebook,
} from "../../../services/userService";
import axios from "axios";

interface Props {
  onToggle: () => void;
}

const Login: React.FC<Props> = ({ onToggle }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Logic xử lý khi đăng nhập Google thành công
  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      toast.error("Đăng nhập Google thất bại (Không có ID Token)!");
      return;
    }

    try {
      setIsLoading(true);
      // Gửi Credential (ID Token JWT) lên backend
      const res = await postLoginGoogle(response.credential);

      if (res.data && res.data.status === 200 && res.data.data) {
        const data = res.data.data;
        const user = data.user;
        if (data.accessToken) localStorage.setItem("accessToken", data.accessToken);
        if (data.refreshToken)
          localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
        if (user.fullName) localStorage.setItem("username", user.fullName);
        if (user.email) localStorage.setItem("email", user.email);
        if (user.createdAt) localStorage.setItem("createdAt", user.createdAt);
        toast.success("Đăng nhập Google thành công! 🚀");
        navigate("/");
      } else {
        toast.error(res.data?.message || "Đăng nhập Google thất bại!");
      }
    } catch (error) {
      console.error("Google Login Error:", error);
      toast.error("Lỗi đăng nhập Google!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
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
      const response = await postLogin(cleanEmail, password);
      if (response.data && response.data.status === 200 && response.data.data) {
        const data = response.data.data;
        const user = data.user;
        if (data.accessToken) localStorage.setItem("accessToken", data.accessToken);
        if (data.refreshToken)
          localStorage.setItem("refreshToken", data.refreshToken);
        localStorage.setItem("user", JSON.stringify(user));
        if (user.fullName) localStorage.setItem("username", user.fullName);
        if (user.email) localStorage.setItem("email", user.email);
        if (user.createdAt) localStorage.setItem("createdAt", user.createdAt);
        toast.success(`Chào mừng ${user.fullName || user.email} trở lại! 👋`);
        navigate("/");
      } else {
        toast.error(
          response.data?.message || "Email hoặc mật khẩu không chính xác!",
        );
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const serverError = error.response?.data as {
          EM?: string;
          message?: string;
        };
        toast.error(
          serverError?.EM ||
            serverError?.message ||
            "Tài khoản hoặc mật khẩu không đúng!",
        );
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

      <div className={styles.socialButtons}>
        <div className={styles.googleButtonWrap}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => toast.error("Đăng nhập Google thất bại!")}
            theme="outline"
            shape="pill"
            text="signin"
            logo_alignment="center"
          />
        </div>
        <div className={styles.facebookButtonWrap}>
          <FacebookLogin
            appId={import.meta.env.VITE_FACEBOOK_APP_ID || "1493682952374744"}
            fields="name,email,picture"
            scope="public_profile email"
            onSuccess={async (response: { accessToken: string }) => {
              try {
                setIsLoading(true);
                const res = await postLoginFacebook(response.accessToken);
                if (res.data && res.data.status === 200 && res.data.data) {
                  const data = res.data.data;
                  const user = data.user;
                  if (data.accessToken)
                    localStorage.setItem("accessToken", data.accessToken);
                  if (data.refreshToken)
                    localStorage.setItem("refreshToken", data.refreshToken);
                  localStorage.setItem("user", JSON.stringify(user));
                  if (user.fullName)
                    localStorage.setItem("username", user.fullName);
                  if (user.email) localStorage.setItem("email", user.email);
                  if (user.createdAt)
                    localStorage.setItem("createdAt", user.createdAt);
                  toast.success("Đăng nhập Facebook thành công! 🚀");
                  navigate("/");
                } else {
                  toast.error(
                    res.data?.message || "Đăng nhập Facebook thất bại!",
                  );
                }
              } catch (error: unknown) {
                console.error("Facebook Login Error:", error);
                toast.error("Lỗi đăng nhập Facebook!");
              } finally {
                setIsLoading(false);
              }
            }}
            onFail={(error: unknown) => {
              console.error("Facebook Login Failed:", error);
              toast.error("Đăng nhập Facebook không thành công. Vui lòng thử lại!");
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
              onClick={() => !isLoading && setShowPassword(!showPassword)}
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
