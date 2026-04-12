import React, { useRef, useState } from "react";
import styles from "./ProfileHeader.module.scss";
import { uploadImage } from "../../../../services/profileService";
import { toast } from "react-toastify";

import ProtectedImage from "../../../../components/ProtectedImage/ProtectedImage";

interface Props {
  name: string;
  email: string;
  badge: string;
  avatar_url: string;
  cover_url: string;
  joinDate: string;
  location: string;
  onAvatarUpdate?: (newUrl: string) => void;
  onCoverUpdate?: (newUrl: string) => void;
}

const ProfileHeader: React.FC<Props> = ({
  name,
  email,
  badge,
  avatar_url,
  cover_url,
  joinDate,
  location,
  onAvatarUpdate,
  onCoverUpdate,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Kiểm tra định dạng ảnh
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn tệp hình ảnh!");
      return;
    }

    // Kiểm tra kích thước (ví dụ 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh không được vượt quá 5MB!");
      return;
    }

    try {
      setIsUploading(true);
      const res = await uploadImage(file);
      // Phản hồi từ backend: { status: 200, data: "/api/v1/users/images/..." }
      if (res.data && res.data.status === 200 && res.data.data) {
        const path = res.data.data as string;
        
        // Cập nhật cả hai cùng lúc
        onAvatarUpdate?.(path);
        onCoverUpdate?.(path);
        
        toast.success("Cập nhật ảnh đại diện và ảnh bìa thành công!");
      } else {
        throw new Error("Không nhận được URL ảnh");
      }
    } catch (error) {
      console.error("Lỗi khi tải ảnh lên:", error);
      toast.error("Không thể tải ảnh lên. Vui lòng thử lại!");
    } finally {
      setIsUploading(false);
      if (event.target) event.target.value = "";
    }
  };

  const defaultAvatar = "https://res.cloudinary.com/dwyzqwupm/image/upload/v1741528643/user-avatar_hpxv4t.png";
  const defaultCover = "https://res.cloudinary.com/dwyzqwupm/image/upload/v1738733306/halong_lbbmro.jpg";

  return (
    <div className={styles.profileHeaderWrapper}>
      <div className={styles.coverPhoto}>
        <ProtectedImage 
          src={cover_url} 
          alt="Cover" 
          fallbackSrc={defaultCover}
        />
        <input
          type="file"
          ref={fileInputRef}
          hidden
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      <div className={styles.headerContent}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatarWrapper}>
            <ProtectedImage 
              src={avatar_url} 
              alt="Avatar" 
              className={styles.avatar} 
              fallbackSrc={defaultAvatar}
            />
            {isUploading && (
              <div className={styles.uploadOverlay}>
                <i className="ph-bold ph-spinner ph-spin"></i>
              </div>
            )}
            <button
              className={styles.changeAvatarBtn}
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              title="Thay đổi ảnh"
            >
              <i className={`ph-bold ${isUploading ? "ph-spinner ph-spin" : "ph-camera"}`}></i>
            </button>
          </div>
        </div>

        <div className={styles.mainInfo}>
          <div className={styles.titleRow}>
            <div className={styles.nameBlock}>
              <h1>{name}</h1>
              <span className={styles.email}>{email}</span>
            </div>
            <div className={styles.actions}>
              <button className={styles.shareBtn}>
                <i className="ph-bold ph-share-network"></i>
                Chia sẻ
              </button>
              <button className={styles.editProfileBtn}>Chỉnh sửa hồ sơ</button>
            </div>
          </div>

          <div className={styles.metaRow}>
            <div className={styles.badge}>
              <i className="ph-fill ph-crown"></i>
              {badge}
            </div>
            <div className={styles.statItem}>
              <i className="ph-bold ph-calendar-blank"></i>
              Tham gia từ {joinDate}
            </div>
            <div className={styles.statItem}>
              <i className="ph-bold ph-map-pin"></i>
              {location}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;