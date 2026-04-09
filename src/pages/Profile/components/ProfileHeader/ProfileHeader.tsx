import React from 'react';
import styles from './ProfileHeader.module.scss';

interface Props {
  name: string;
  email: string;
  badge: string;
  avatar: string;
  cover: string;
  joinDate: string;
  location: string;
}

const ProfileHeader: React.FC<Props> = ({ name, email, badge, avatar, cover, joinDate, location }) => {
  return (
    <div className={styles.profileHeaderWrapper}>
      <div className={styles.coverPhoto}>
        <img 
          src={cover} 
          alt="Cover" 
        />
        <button className={styles.editCoverBtn}>
          <i className="ph-bold ph-camera"></i> Thay đổi ảnh bìa
        </button>
      </div>
      
      <div className={styles.headerContent}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatarWrapper}>
            <img src={avatar} alt="Avatar" className={styles.avatar} />
            <button className={styles.changeAvatarBtn}>
              <i className="ph-bold ph-camera"></i>
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
              <button className={styles.editProfileBtn}>
                Chỉnh sửa hồ sơ
              </button>
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