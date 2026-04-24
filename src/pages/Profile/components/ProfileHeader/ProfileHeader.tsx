import React, { useRef, useState } from "react";
import styles from "./ProfileHeader.module.scss";
import { anhmatdinh, cover as defaultCoverImg } from "../../../../assets/images/img";
import { uploadImage } from "../../../../services/profileService";
import { toast } from "react-toastify";
import { 
  Camera, 
  CircleNotch, 
  ShareNetwork, 
  Crown, 
  CalendarBlank, 
  MapPin 
} from "@phosphor-icons/react";
import GlossyButton from "../../../../components/Ui/GlossyButton/GlossyButton";

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
  onEditClick?: () => void;
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
  onEditClick,
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
      if (res.data && res.data.status === 200 && res.data.data) {
        const path = res.data.data as string;
        onAvatarUpdate?.(path);
        toast.success("Cập nhật ảnh đại diện thành công!");
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

  const defaultAvatar = anhmatdinh;
  const defaultCover = defaultCoverImg;

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
                <CircleNotch size={32} weight="bold" className={styles.spin} />
              </div>
            )}
            <button
              className={styles.changeAvatarBtn}
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              title="Thay đổi ảnh"
            >
              <div className={styles.cameraIconWrapper}>
                {isUploading ? (
                  <CircleNotch size={18} weight="bold" className={styles.spin} />
                ) : (
                  <Camera size={18} weight="bold" />
                )}
              </div>
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
                <ShareNetwork size={18} weight="bold" />
                Chia sẻ
              </button>
              <GlossyButton 
                variant="primary"
                onClick={onEditClick}
              >
                Chỉnh sửa hồ sơ
              </GlossyButton>
            </div>
          </div>

          <div className={styles.metaRow}>
            <div className={styles.badge}>
              <Crown size={16} weight="fill" />
              {badge}
            </div>
            <div className={styles.statItem}>
              <CalendarBlank size={18} weight="bold" />
              Tham gia từ {joinDate}
            </div>
            <div className={styles.statItem}>
              <MapPin size={18} weight="bold" />
              {location}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
