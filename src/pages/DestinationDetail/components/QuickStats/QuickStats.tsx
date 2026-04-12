import React from "react";
import { Star, MapPin, Money, Clock } from "phosphor-react";
import styles from "./QuickStats.module.scss";
import type { Destination } from "../../../../services/destinationService";


const QuickStats: React.FC<{ data: Destination }> = ({ data }) => {
  const stats = [
    { icon: <Star weight="fill" color="#33d7d1" />, label: "Đánh giá", value: `${data.rating}/5.0` },
    { icon: <MapPin weight="fill" color="#33d7d1" />, label: "Từ Hà Nội", value: data.distance },
    { icon: <Money weight="fill" color="#33d7d1" />, label: "Mức giá", value: data.price },
    { icon: <Clock weight="fill" color="#33d7d1" />, label: "Thời gian", value: data.time },
  ];

  return (
    <div className={styles.quickStats} data-aos="fade-up">
      {stats.map((stat, idx) => (
        <div key={idx} className={styles.statBox}>
          <div className={styles.statIcon}>{stat.icon}</div>
          <div className={styles.statInfo}>
            <span className={styles.statLabel}>{stat.label}</span>
            <span className={styles.statValue}><strong>{stat.value}</strong></span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStats;