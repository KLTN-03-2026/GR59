import React from 'react';
import styles from './TripCard.module.scss';
import type { TripPlan } from '../../types';

interface Props {
  trip: TripPlan;
}

const TripCard: React.FC<Props> = ({ trip }) => {
  // 1. Tính toán % hoàn thành checklist
  const completed = trip.checklist.filter(i => i.isCompleted).length;
  const total = trip.checklist.length;
  const progress = total > 0 ? (completed / total) * 100 : 0;

  // 2. Hàm xác định màu sắc dựa trên tiến độ (Tùy chọn thêm cho xịn)
  const getProgressColor = () => {
    if (progress < 30) return '#ef4444'; // Đỏ nếu chuẩn bị quá ít
    if (progress < 70) return '#ff7a00'; // Cam nếu đang chuẩn bị
    return '#3fc2b3'; // Xanh ngọc nếu gần xong
  };

  return (
    <div className={styles.card} data-aos="fade-up">
      <div className={styles.imageHeader}>
        <img src={trip.image} alt={trip.title} />
        <span className={`${styles.badge} ${styles[trip.status]}`}>
          {trip.status === 'upcoming' ? '• Sắp tới' : '• Hoàn thành'}
        </span>
      </div>

      <div className={styles.body}>
        <h3 className={styles.title}>{trip.title}</h3>
        <p className={styles.date}>{trip.dateRange}</p>

        <div className={styles.quickStats}>
          <span>📍 {trip.locationCount} điểm</span>
          <span>👥 {trip.guestCount} khách</span>
        </div>

        {/* --- PHẦN MỚI: THANH TIẾN ĐỘ --- */}
        <div className={styles.progressContainer}>
          <div className={styles.progressText}>
            <span>Độ sẵn sàng</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className={styles.progressTrack}>
            <div 
              className={styles.progressFill} 
              style={{ 
                width: `${progress}%`,
                backgroundColor: getProgressColor() 
              }} 
            />
          </div>
        </div>
        {/* ------------------------------ */}

        <div className={styles.detailsGrid}>
          <span>📅 {trip.duration}</span>
          <span>🍱 {trip.activityCount} hoạt động</span>
          <span>🏨 {trip.hotelCount} khách sạn</span>
        </div>

        <div className={styles.checklist}>
          <div className={styles.checkHeader}>
            <h4>CHUẨN BỊ CHUYẾN ĐI</h4>
            <button className={styles.addBtn}>+</button>
          </div>
          {trip.checklist.map(item => (
            <label key={item.id} className={styles.checkItem}>
              <input type="checkbox" defaultChecked={item.isCompleted} />
              <span className={styles.customCheck}></span>
              {item.label}
            </label>
          ))}
        </div>

        <div className={styles.actions}>
          <button className={styles.btnView}>👁️</button>
          <button className={styles.btnEdit}>✏️</button>
          <button className={styles.btnDelete}>🗑️</button>
        </div>
      </div>
    </div>
  );
};

export default TripCard;