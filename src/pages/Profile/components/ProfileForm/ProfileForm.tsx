import React from "react";
import styles from "./ProfileForm.module.scss";

interface ProfileFormProps {
  title: string;
  mode: "info" | "password";
  profile?: ProfileData;
}

import type { ProfileData } from "../../../../services/profileService";
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
        name: formData.get("name") as string,
        phone: formData.get("phone") as string,
        address: formData.get("address") as string,
        bio: formData.get("bio") as string,
      };

      try {
        await updateProfile(data);
        alert("Cập nhật thông tin thành công!");
        // Tải lại trang để hiển thị thông tin mới nhất
        window.location.reload();
      } catch (error) {
        console.error("Lỗi cập nhật thông tin:", error);
        alert("Đã xảy ra lỗi khi cập nhật thông tin.");
      }
    } else if (mode === "password") {
      const currentPassword = formData.get("currentPassword") as string;
      const newPassword = formData.get("newPassword") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      if (newPassword !== confirmPassword) {
        alert("Mật khẩu xác nhận không khớp!");
        return;
      }

      try {
        await changePassword({ currentPassword, newPassword });
        alert("Cập nhật mật khẩu thành công!");
        form.reset();
      } catch (error) {
        console.error("Lỗi cập nhật mật khẩu:", error);
        alert(
          "Đã xảy ra lỗi khi cập nhật mật khẩu. (Có thể API mock chưa hỗ trợ route này)",
        );
      }
    }
  };

  return (
    <div className={styles.sectionCard}>
      <div className={styles.cardHeader}>
        <div className={styles.iconBox}>
          <i
            className={
              mode === "info" ? "ph-fill ph-user-circle" : "ph-fill ph-lock-key"
            }
          ></i>
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
          <div className={styles.fieldsGrid}>
            <div className={styles.formGroup}>
              <label>Họ và tên</label>
              <div className={styles.inputWrapper}>
                <i className="ph-bold ph-user"></i>
                <input
                  type="text"
                  name="name"
                  defaultValue={profile?.name || ""}
                  placeholder="Nhập họ tên"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Số điện thoại</label>
              <div className={styles.inputWrapper}>
                <i className="ph-bold ph-phone"></i>
                <input
                  type="text"
                  name="phone"
                  defaultValue={profile?.phone || ""}
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>

            <div className={styles.formGroup} style={{ gridColumn: "span 2" }}>
              <label>Địa chỉ</label>
              <div className={styles.inputWrapper}>
                <i className="ph-bold ph-map-pin"></i>
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
        ) : (
          <div className={styles.passwordFields}>
            <div className={styles.formGroup}>
              <label>Mật khẩu hiện tại</label>
              <div className={styles.inputWrapper}>
                <i className="ph-bold ph-key"></i>
                <input
                  type={showCurrent ? "text" : "password"}
                  name="currentPassword"
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
                  <i
                    className={
                      showCurrent ? "ph-bold ph-eye-slash" : "ph-bold ph-eye"
                    }
                  ></i>
                </button>
              </div>
            </div>
            <div className={styles.passwordRow}>
              <div className={styles.formGroup}>
                <label>Mật khẩu mới</label>
                <div className={styles.inputWrapper}>
                  <i className="ph-bold ph-password"></i>
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
                    <i
                      className={
                        showNew ? "ph-bold ph-eye-slash" : "ph-bold ph-eye"
                      }
                    ></i>
                  </button>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Xác nhận mật khẩu</label>
                <div className={styles.inputWrapper}>
                  <i className="ph-bold ph-check-circle"></i>
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
                    <i
                      className={
                        showConfirm ? "ph-bold ph-eye-slash" : "ph-bold ph-eye"
                      }
                    ></i>
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
                <i className="ph-bold ph-check"></i> Lưu thay đổi
              </>
            ) : (
              <>
                <i className="ph-bold ph-shield-check"></i> Cập nhật mật khẩu
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
