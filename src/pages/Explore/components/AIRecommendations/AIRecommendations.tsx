import React, { useEffect, useState } from "react";
import styles from "./AIRecommendations.module.scss";
import { type AIRecommendation } from "../../../../services/aiRecommendationService";
import { getFeaturedAttractions } from "../../../../services/highlightService";
import AnimatedButton from "../../../../components/Ui/AnimatedButton/AnimatedButton";
import RecommendationCard from "../../../../components/Ui/RecommendationCard/RecommendationCard";

const AIRecommendations: React.FC = () => {
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await getFeaturedAttractions(8);
        const data = response.data?.data || [];
        
        // Map HighlightItem sang AIRecommendation
        const mappedData: AIRecommendation[] = data
          .filter(item => {
            const name = item.name || "";
            return name && 
                   !name.toLowerCase().includes("unknown attraction") && 
                   !name.toLowerCase().includes("be đang thiếu");
          })
          .map((item, idx) => ({
            id: Number(item.id),
            name: item.name,
            image: item.image,
            matchPercentage: 90 + (idx % 10),
          }));

        setRecommendations(mappedData);
      } catch {
        console.error("Failed to fetch featured attractions for recommendations");
      }
    };
    fetchRecommendations();
  }, []);

  return (
    <div className={styles.aiSection} data-aos="fade-right">
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <span className={styles.aiIcon}>✨</span>
          <h3>Gợi ý thông minh</h3>
        </div>
        <AnimatedButton text="XEM TẤT CẢ" />
      </div>
      <div className={styles.scrollWrapper}>
        {recommendations.map((item) => (
          <RecommendationCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default AIRecommendations;
