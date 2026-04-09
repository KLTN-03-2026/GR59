import React, { useState } from "react";
import styles from "./ProfileSidebar.module.scss";

import type { SavedTrip } from "../../../../services/profileService";

interface Props {
  savedTrips?: SavedTrip[];
}

const ProfileSidebar: React.FC<Props> = ({ savedTrips = [] }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayedTrips = isExpanded ? savedTrips : savedTrips.slice(0, 3);

  return (
    <div className={styles.sidebar}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span>
            <i className="ph-fill ph-bookmarks"></i> Địa điểm yêu thích
          </span>
          {savedTrips.length > 3 && (
            <a 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                setIsExpanded(!isExpanded);
              }}
            >
              {isExpanded ? "Thu gọn" : "Xem tất cả"}
            </a>
          )}
        </div>
        <div className={styles.tripList}>
          {displayedTrips.map((trip) => (
            <div key={trip.id} className={styles.tripItem}>
              <div className={styles.imageWrapper}>
                <img src={trip.image} alt={trip.title} />
              </div>
              <div className={styles.tripInfo}>
                <div className={styles.tripTitle}>{trip.title}</div>
                <div className={styles.time}>
                  <i className="ph-bold ph-clock"></i> {trip.timeAgo}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.referral}>
        <div className={styles.referralIcon}>
          <i className="ph-fill ph-gift"></i>
        </div>
        <h4>Mời bạn bè</h4>
        <p>Nhận ngay <strong>100 điểm</strong> MyPoints khi bạn bè đăng ký qua liên kết của bạn.</p>
        <button className={styles.copyBtn}>
          <i className="ph-bold ph-copy"></i>
          Sao chép liên kết
        </button>
      </div>
    </div>
  );
};

export default ProfileSidebar;
