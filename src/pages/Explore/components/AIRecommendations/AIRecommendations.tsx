import React, { useEffect, useState } from "react";
import styles from "./AIRecommendations.module.scss";
import { getAIRecommendations, type AIRecommendation } from "../../../../services/aiRecommendationService";

const AIRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await getAIRecommendations();
        if (response.data && response.data.DT) {
          setRecommendations(response.data.DT);
        }
      } catch (error) {
        console.error("Failed to fetch AI recommendations", error);
      }
    };
    fetchRecommendations();
  }, []);

  return (
    <div className={styles.aiSection} data-aos="fade-right">
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.aiIcon}>✨</span>
          <h3>Gợi ý thông minh cho Qlong</h3>
        </div>
        <button className={styles.viewAllBtn}>
          Xem tất cả <span>→</span>
        </button>
      </div>
      <div className={styles.scrollWrapper}>
        {recommendations.map((item) => (
          <div key={item.id} className={styles.miniCard}>
            <img src={item.image} alt="Suggest" />
            <div className={styles.miniInfo}>
              <h4>{item.name}</h4>
              <span>{item.matchPercentage}% tương thích</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIRecommendations;
