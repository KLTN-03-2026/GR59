import React from "react";
import { toast } from "react-toastify";
import styles from "./ProfileForm.module.scss";

interface ProfileFormProps {
  title: string;
  mode: "info" | "password";
  profile?: ProfileData;
}

import type { ProfileData } from "../../../../services/profileService";
import {
  UserCircle,
  LockKey,
  User,
  Phone,
  MapPin,
  Key,
  Password,
  CheckCircle,
  Eye,
  EyeSlash,
  Check,
  ShieldCheck,
} from "phosphor-react";
import {
  updateProfile,
  changePassword,
} from "../../../../services/profileService";

const ProfileForm: React.FC<ProfileFormProps> = ({ title, mode, profile }) => {
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    if (mode === "info") {
      const data = {
        fullName: formData.get("fullName") as string,
        phone: formData.get("phone") as string,
        address: formData.get("address") as string,
        bio: formData.get("bio") as string,
      };

      try {
        await updateProfile(data);
        toast.success("Cập nhật thông tin thành công! ✨");
        // Tải lại trang để hiển thị thông tin mới nhất
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        console.error("Lỗi cập nhật thông tin:", error);
        toast.error("Đã xảy ra lỗi khi cập nhật thông tin.");
      }
    } else if (mode === "password") {
      const old_password = formData.get("old_password") as string;
      const new_password = formData.get("newPassword") as string;
      const confirm_password = formData.get("confirmPassword") as string;

      if (new_password !== confirm_password) {
        toast.error("Mật khẩu xác nhận không khớp! ❌");
        return;
      }

      try {
        const res = await changePassword({
          old_password,
          new_password,
          confirm_password,
        });
        if (res.data && res.data.status === 200) {
          toast.success(res.data.message || "Đổi mật khẩu thành công! 🔐");
          form.reset();
        } else {
          toast.error(res.data?.message || "Đổi mật khẩu thất bại!");
        }
      } catch (error) {
        console.error("Lỗi cập nhật mật khẩu:", error);
        toast.error("Đã xảy ra lỗi khi cập nhật mật khẩu.");
      }
    }
  };

  return (
    <div className={styles.sectionCard}>
      <div className={styles.cardHeader}>
        <div className={styles.iconBox}>
          {mode === "info" ? (
            <UserCircle weight="fill" />
          ) : (
            <LockKey weight="fill" />
          )}
        </div>
        <div className={styles.cardHeaderText}>
          <h3>{title}</h3>
          <p>
            {mode === "info"
              ? "Quản lý thông tin cá nhân của bạn"
              : "Cập nhật mật khẩu để bảo vệ tài khoản"}
          </p>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {mode === "info" ? (
          <div className={styles.formContent}>
            <div className={styles.fieldSection}>
              <h4 className={styles.sectionTitle}>
                <i className="ph-bold ph-identification-card"></i> Thông tin cơ bản
              </h4>
              <div className={styles.fieldsGrid}>
                <div className={styles.formGroup}>
                  <label>Họ và tên</label>
                  <div className={styles.inputWrapper}>
                    <User weight="bold" />
                    <input
                      type="text"
                      name="fullName"
                      defaultValue={profile?.fullName || ""}
                      placeholder="Nhập họ tên"
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Số điện thoại</label>
                  <div className={styles.inputWrapper}>
                    <Phone weight="bold" />
                    <input
                      type="text"
                      name="phone"
                      defaultValue={profile?.phone || ""}
                      placeholder="Nhập số điện thoại"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.fieldSection}>
              <h4 className={styles.sectionTitle}>
                <i className="ph-bold ph-address-book"></i> Liên hệ & Giới thiệu
              </h4>
              <div className={styles.fieldsGrid}>
                <div className={styles.formGroup} style={{ gridColumn: "span 2" }}>
                  <label>Địa chỉ</label>
                  <div className={styles.inputWrapper}>
                    <MapPin weight="bold" />
                    <input
                      type="text"
                      name="address"
                      defaultValue={profile?.address || ""}
                      placeholder="Nhập địa chỉ"
                    />
                  </div>
                </div>

                <div className={styles.formGroup} style={{ gridColumn: "span 2" }}>
                  <label>Giới thiệu bản thân</label>
                  <textarea
                    name="bio"
                    rows={4}
                    defaultValue={profile?.bio || ""}
                    placeholder="Viết vài dòng giới thiệu về bạn..."
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.passwordFields}>
            <div className={styles.formGroup}>
              <label>Mật khẩu hiện tại</label>
              <div className={styles.inputWrapper}>
                <Key weight="bold" />
                <input
                  type={showCurrent ? "text" : "password"}
                  name="old_password"
                  required
                  placeholder="********"
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowCurrent(!showCurrent)}
                  aria-label={
                    showCurrent
                      ? "Hide current password"
                      : "Show current password"
                  }
                >
                  {showCurrent ? (
                    <EyeSlash weight="bold" />
                  ) : (
                    <Eye weight="bold" />
                  )}
                </button>
              </div>
            </div>
            <div className={styles.passwordRow}>
              <div className={styles.formGroup}>
                <label>Mật khẩu mới</label>
                <div className={styles.inputWrapper}>
                  <Password weight="bold" />
                  <input
                    type={showNew ? "text" : "password"}
                    name="newPassword"
                    required
                    placeholder="********"
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowNew(!showNew)}
                    aria-label={
                      showNew ? "Hide new password" : "Show new password"
                    }
                  >
                    {showNew ? (
                      <EyeSlash weight="bold" />
                    ) : (
                      <Eye weight="bold" />
                    )}
                  </button>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Xác nhận mật khẩu</label>
                <div className={styles.inputWrapper}>
                  <CheckCircle weight="bold" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    required
                    placeholder="********"
                  />
                  <button
                    type="button"
                    className={styles.eyeBtn}
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={
                      showConfirm
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirm ? (
                      <EyeSlash weight="bold" />
                    ) : (
                      <Eye weight="bold" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={styles.formFooter}>
          <button
            type="submit"
            className={
              mode === "info" ? styles.btnPrimary : styles.btnSecondary
            }
          >
            {mode === "info" ? (
              <>
                <Check weight="bold" /> Lưu thay đổi
              </>
            ) : (
              <>
                <ShieldCheck weight="bold" /> Cập nhật mật khẩu
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
