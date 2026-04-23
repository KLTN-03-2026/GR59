import React, { useState } from "react";
import {
  EnvelopeSimple,
  LockKey,
  FacebookLogo,
} from "phosphor-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./Login.module.scss";
import { GoogleLogin } from "@react-oauth/google";
import FacebookLoginExport from "@greatsumini/react-facebook-login";
import {
  postLogin,
  postLoginGoogle,
  postLoginFacebook,
  type AuthResponseData,
  type BackendResponse,
} from "../../../services/userService";
import axios from "axios";
import InputGroup from "../../../components/Ui/InputGroup/InputGroup";
import PremiumButton from "../../../components/Ui/PremiumButton/PremiumButton";

const FacebookLogin =
  (FacebookLoginExport as { default?: typeof FacebookLoginExport }).default ||
  FacebookLoginExport;

interface Props {
  onToggle: () => void;
}

const Login: React.FC<Props> = ({ onToggle }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const saveAuthData = (data: AuthResponseData) => {
    const { user, accessToken, refreshToken } = data;
    if (accessToken) localStorage.setItem("accessToken", accessToken);
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
    if (user.fullName) localStorage.setItem("username", user.fullName);
    if (user.email) localStorage.setItem("email", user.email);
    if (user.createdAt) localStorage.setItem("createdAt", user.createdAt);
  };

  const handleSocialSuccess = async (provider: 'google' | 'facebook', token: string) => {
    try {
      setIsLoading(true);
      const fetcher = provider === 'google' ? postLoginGoogle : postLoginFacebook;
      const res = await fetcher(token);
      if (res.data && res.data.status === 200 && res.data.data) {
        saveAuthData(res.data.data);
        toast.success(`Đăng nhập ${provider === 'google' ? 'Google' : 'Facebook'} thành công! 🚀`);
        navigate("/");
      } else {
        toast.error(res.data?.message || `Đăng nhập ${provider} thất bại!`);
      }
    } catch (error) {
      console.error(`${provider} Login Error:`, error);
      toast.error(`Lỗi đăng nhập ${provider}!`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();
    if (!cleanEmail || !password) return toast.error("Vui lòng nhập đầy đủ thông tin!");

    setIsLoading(true);
    try {
      const response = await postLogin(cleanEmail, password);
      if (response.data && response.data.status === 200 && response.data.data) {
        saveAuthData(response.data.data);
        toast.success(`Chào mừng ${response.data.data.user.fullName || cleanEmail} trở lại! 👋`);
        navigate("/");
      } else {
        toast.error(response.data?.message || "Email hoặc mật khẩu không chính xác!");
      }
    } catch (error: unknown) {
      let msg = "Đã xảy ra lỗi không xác định!";
      if (axios.isAxiosError(error)) {
        const errorData = error.response?.data as BackendResponse;
        msg = errorData?.message || msg;
      }
      toast.error(msg);
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
            onSuccess={(resp) => resp.credential && handleSocialSuccess('google', resp.credential)}
            onError={() => toast.error("Đăng nhập Google thất bại!")}
            theme="outline" shape="pill" text="signin" logo_alignment="center"
            width="100%"
          />
        </div>
        <div className={styles.facebookButtonWrap}>
          <FacebookLogin
            appId={import.meta.env.VITE_FACEBOOK_APP_ID || "1493682952374744"}
            onSuccess={(resp: { accessToken: string }) => handleSocialSuccess('facebook', resp.accessToken)}
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

      <div className={styles.divider}><span>Hoặc đăng nhập bằng email</span></div>

      <form onSubmit={handleLogin} className={styles.form}>
        <InputGroup
          label="Email của bạn" name="email" type="email" placeholder="name@example.com"
          value={email} onChange={(e) => setEmail(e.target.value)}
          icon={<EnvelopeSimple weight="duotone" />} disabled={isLoading}
        />

        <div className={styles.passwordGroupWrap}>
          <div className={styles.labelRow}>
            <label>Mật khẩu</label>
            <Link to="/forgot-password" className={styles.forgotPass}>Quên mật khẩu?</Link>
          </div>
          <InputGroup
            label="" name="password" type="password" placeholder="Nhập mật khẩu"
            value={password} onChange={(e) => setPassword(e.target.value)}
            icon={<LockKey weight="duotone" />} disabled={isLoading}
            showToggle isShown={showPassword} onToggleShow={() => setShowPassword(!showPassword)}
          />
        </div>

        <PremiumButton type="submit" loading={isLoading} variant="sunset">
          Đăng nhập
        </PremiumButton>
      </form>

      <div className={styles.footer}>
        Bạn chưa có tài khoản?{" "}
        <button type="button" onClick={onToggle}>Đăng ký ngay</button>
      </div>
    </div>
  );
};

export default Login;
