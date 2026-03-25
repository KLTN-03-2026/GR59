import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import styles from './Dashboard.module.scss';
import TripCard from './components/TripCard/TripCard';
import type { TripPlan } from './types';

const MOCK_DATA: TripPlan[] = [
  {
    id: '1',
    title: 'Khám phá Hà Nội',
    dateRange: '25/03/2026 - 01/04/2026',
    locationCount: 10, guestCount: 4, duration: '3 ngày',
    activityCount: 5, hotelCount: 2, status: 'upcoming',
    image: 'https://picsum.photos/400/250?v=1',
    checklist: [
      { id: '1', label: 'Vé máy bay', isCompleted: true },
      { id: '2', label: 'Khách sạn', isCompleted: false },
      { id: '3', label: 'Lịch trình', isCompleted: false }
    ]
  },
  // Thêm các trip khác tương tự...
];

const Dashboard: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={styles.dashboard}>
      {/* 1. Top Section: Clock & Map */}
      <section className={styles.topSection}>
        <div className={styles.timeWidget} data-aos="fade-right">
          <div className={styles.timeLabel}>NGƯỜI DÙNG</div>
          <h1 className={styles.clock}>
            {time.toLocaleTimeString('en-GB', { hour12: false })}
          </h1>
          <p className={styles.fullDate}>Thứ Tư, 25 tháng 3, 2026</p>
        </div>

        <div className={styles.mapWidget} data-aos="fade-left">
          <div className={styles.mapHeader}>
            <h4>Bản đồ hành trình</h4>
            <button>Toàn màn hình</button>
          </div>
          <div className={styles.mapBox}>
             <div className={styles.placeholderMap}>📍 Map Preview</div>
          </div>
        </div>
      </section>

      {/* 2. Management Section */}
      <section className={styles.mainSection}>
        <div className={styles.header}>
          <div className={styles.titleGroup}>
            <h2>Quản lý lịch trình</h2>
            <p>Tổ chức và theo dõi các kế hoạch của bạn chuyên nghiệp.</p>
          </div>
          <div className={styles.tabs}>
            <button className={styles.active}>Tất cả</button>
            <button>Sắp tới</button>
            <button>Đã xong</button>
          </div>
        </div>

        <div className={styles.grid}>
          {MOCK_DATA.map(trip => <TripCard key={trip.id} trip={trip} />)}
          
          <div className={styles.addCard} data-aos="zoom-in">
            <div className={styles.addIcon}>+</div>
            <h3>Thêm lịch trình mới</h3>
            <p>Lên kế hoạch cho hành trình tiếp theo của bạn.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;