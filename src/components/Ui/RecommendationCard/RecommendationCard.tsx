import React from "react";
import styles from "./RecommendationCard.module.scss";
import type { AIRecommendation } from "../../../services/aiRecommendationService";

interface RecommendationCardProps {
  item: AIRecommendation;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ item }) => {
  return (
    <div className={styles.miniCard}>
      <img src={item.image} alt={item.name} loading="lazy" />
      <div className={styles.miniInfo}>
        <h4>{item.name}</h4>
        <div className={styles.matchBadge}>
          <span className={styles.sparkle}>✨</span>
          {item.matchPercentage}% tương thích
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;
