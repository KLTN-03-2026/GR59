import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import {
  EnvelopeSimple,
  Eye,
  EyeSlash,
  FacebookLogo,
  GoogleLogo,
  LockKey,
} from "phosphor-react";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  facebookLogin,
  initializeFacebookSDK,
} from "../../../services/facebookService";
import {
  postLogin,
  postLoginFacebook,
  postLoginGoogle,
  type AuthResponseData,
} from "../../../services/userService";
import styles from "./Login.module.scss";

interface Props {
  onToggle: () => void;
  navigate: (path: string) => void;
}

const Login: React.FC<Props> = ({ onToggle, navigate }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize Facebook SDK on component mount
  useEffect(() => {
    initializeFacebookSDK(import.meta.env.VITE_FACEBOOK_APP_ID || "");
  }, []);

  // Helper function to save user to localStorage
  const saveUserToLocalStorage = (data: AuthResponseData) => {
    if (data.accessToken) localStorage.setItem("token", data.accessToken);
    const user = data.user;
    localStorage.setItem("user", JSON.stringify(user));
    if (user.fullName) localStorage.setItem("username", user.fullName);
    if (user.email) localStorage.setItem("email", user.email);
    if (user.createdAt) localStorage.setItem("createdAt", user.createdAt);
  };

  // 1. Xử lý đăng nhập Google
  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        const response = await postLoginGoogle(tokenResponse.access_token);
        if (response.data && response.data.EC === 0) {
          saveUserToLocalStorage(response.data.DT);
          toast.success("Đăng nhập Google thành công! 🚀");
          navigate("/");
        }
      } catch (error) {
        toast.error("Lỗi đăng nhập Google!");
        console.error("Error logging in with Google:", error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  // 2. Xử lý đăng nhập Facebook
  const loginWithFacebook = async () => {
    try {
      setIsLoading(true);
      const fbResponse = await facebookLogin({
        scope: "public_profile,email",
      });

      // Gửi Facebook token lên backend
      const response = await postLoginFacebook(fbResponse.accessToken);
      if (response.data && response.data.EC === 0) {
        saveUserToLocalStorage(response.data.DT);
        toast.success("Đăng nhập Facebook thành công! 🚀");
        navigate("/");
      } else {
        toast.error(response.data?.EM || "Đăng nhập Facebook thất bại!");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const serverError = error.response?.data as {
          EM?: string;
          message?: string;
        };
        toast.error(
          serverError?.EM || serverError?.message || "Lỗi đăng nhập Facebook!",
        );
      } else {
        const errorMsg =
          error instanceof Error ? error.message : "Lỗi đăng nhập Facebook!";
        toast.error(errorMsg);
      }
      console.error("Error logging in with Facebook:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Xử lý đăng nhập Email/Password
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
        localStorage.setItem("user", JSON.stringify(user)); // Lưu ĐẦY ĐỦ JSON user Object

        if (user.fullName) localStorage.setItem("username", user.fullName);
        if (user.email) localStorage.setItem("email", user.email);
        if (user.createdAt) localStorage.setItem("createdAt", user.createdAt);

        toast.success(`Chào mừng ${user.fullName || user.email} trở lại! 👋`);
        navigate("/");
      } else {
        toast.error(
          response.data?.EM || "Email hoặc mật khẩu không chính xác!",
        );
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Backend có thể trả lỗi cấu trúc { EM, ... } hoặc { message, ... }
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
        <button
          type="button"
          className={`${styles.socialBtn} ${styles.google}`}
          onClick={() => loginWithGoogle()}
          disabled={isLoading}
        >
          <GoogleLogo size={20} /> Google
        </button>
        <button
          type="button"
          className={`${styles.socialBtn} ${styles.facebook}`}
          onClick={loginWithFacebook}
          disabled={isLoading}
        >
          <FacebookLogo weight="fill" size={20} /> Facebook
        </button>
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
