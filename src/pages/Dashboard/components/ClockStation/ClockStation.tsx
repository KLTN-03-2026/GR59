import React, { useState, useEffect } from 'react';
import { Sun, CloudSun, Moon } from "@phosphor-icons/react";
import styles from './ClockStation.module.scss';

const ClockStation: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const format = (num: number) => num.toString().padStart(2, '0');

  const getGreeting = () => {
    const hour = time.getHours();
    if (hour < 12) return { text: "CHÀO BUỔI SÁNG", icon: <Sun size={32} weight="fill" color="#ff7a00" /> };
    if (hour < 18) return { text: "CHÀO BUỔI CHIỀU", icon: <CloudSun size={32} weight="fill" color="#ff7a00" /> };
    return { text: "CHÀO BUỔI TỐI", icon: <Moon size={32} weight="fill" color="#ff7a00" /> };
  };

  const greeting = getGreeting();

  return (
    <div className={styles.clockStation}>
      <div className={styles.stationLeft}>
        <div className={styles.greetingHeader}>
          <div className={styles.statusIcon}>{greeting.icon}</div>
          <div className={styles.greetingText}>
            <span>{greeting.text},</span>
            <span className={styles.userName}>NGƯỜI DÙNG</span>
          </div>
        </div>

        <div className={styles.digitalClock}>
          <span className={styles.timeDigit}>{format(time.getHours())}</span>
          <span className={styles.clockSep}>
            <span className={styles.sepDot}></span>
            <span className={styles.sepDot}></span>
          </span>
          <span className={styles.timeDigit}>{format(time.getMinutes())}</span>
          <span className={styles.clockSep}>
             <span className={styles.sepDotAlt}></span>
             <span className={styles.sepDotAlt}></span>
          </span>
          <span className={styles.timeDigit}>{format(time.getSeconds())}</span>
        </div>

        <div className={styles.stationDate}>
          Thứ Tư, 25 tháng 3, 2026
        </div>
      </div>

   
    </div>
  );
};

export default ClockStation;