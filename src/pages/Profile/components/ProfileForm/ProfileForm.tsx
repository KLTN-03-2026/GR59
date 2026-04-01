import React from 'react';
import styles from './ProfileForm.module.scss';

interface ProfileFormProps {
  title: string;
  mode: 'info' | 'password';
  profile?: ProfileData;
}

import type { ProfileData } from "../../../../services/profileService";

const ProfileForm: React.FC<ProfileFormProps> = ({ title, mode, profile }) => {
  const [showCurrent, setShowCurrent] = React.useState(false);
  const [showNew, setShowNew] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Submitting ${mode} form...`);
  };

  return (
    <div className={styles.sectionCard}>
      <div className={styles.cardHeader}>
        <div className={styles.iconBox}>
          <i className={mode === 'info' ? "ph-fill ph-user-circle" : "ph-fill ph-lock-key"}></i>
        </div>
        <div className={styles.cardHeaderText}>
          <h3>{title}</h3>
          <p>{mode === 'info' ? 'Quản lý thông tin cá nhân của bạn' : 'Cập nhật mật khẩu để bảo vệ tài khoản'}</p>
        </div>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {mode === 'info' ? (
          <div className={styles.fieldsGrid}>
            <div className={styles.formGroup}>
              <label>Họ và tên</label>
              <div className={styles.inputWrapper}>
                <i className="ph-bold ph-user"></i>
                <input type="text" defaultValue={profile?.name || ""} placeholder="Nhập họ tên" />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label>Số điện thoại</label>
              <div className={styles.inputWrapper}>
                <i className="ph-bold ph-phone"></i>
                <input type="text" defaultValue={profile?.phone || ""} placeholder="Nhập số điện thoại" />
              </div>
            </div>

            <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
              <label>Địa chỉ</label>
              <div className={styles.inputWrapper}>
                <i className="ph-bold ph-map-pin"></i>
                <input type="text" defaultValue={profile?.address || ""} placeholder="Nhập địa chỉ" />
              </div>
            </div>

            <div className={styles.formGroup} style={{ gridColumn: 'span 2' }}>
              <label>Giới thiệu bản thân</label>
              <textarea 
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
                <input type={showCurrent ? "text" : "password"} placeholder="********" />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowCurrent(!showCurrent)}>
                  <i className={showCurrent ? "ph-bold ph-eye-slash" : "ph-bold ph-eye"}></i>
                </button>
              </div>
            </div>
            <div className={styles.passwordRow}>
              <div className={styles.formGroup}>
                <label>Mật khẩu mới</label>
                <div className={styles.inputWrapper}>
                  <i className="ph-bold ph-password"></i>
                  <input type={showNew ? "text" : "password"} placeholder="********" />
                  <button type="button" className={styles.eyeBtn} onClick={() => setShowNew(!showNew)}>
                    <i className={showNew ? "ph-bold ph-eye-slash" : "ph-bold ph-eye"}></i>
                  </button>
                </div>
              </div>
              <div className={styles.formGroup}>
                <label>Xác nhận mật khẩu</label>
                <div className={styles.inputWrapper}>
                  <i className="ph-bold ph-check-circle"></i>
                  <input type={showConfirm ? "text" : "password"} placeholder="********" />
                  <button type="button" className={styles.eyeBtn} onClick={() => setShowConfirm(!showConfirm)}>
                    <i className={showConfirm ? "ph-bold ph-eye-slash" : "ph-bold ph-eye"}></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className={styles.formFooter}>
          <button 
            type="submit" 
            className={mode === 'info' ? styles.btnPrimary : styles.btnSecondary}
          >
            {mode === 'info' ? (
              <><i className="ph-bold ph-check"></i> Lưu thay đổi</>
            ) : (
              <><i className="ph-bold ph-shield-check"></i> Cập nhật mật khẩu</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;