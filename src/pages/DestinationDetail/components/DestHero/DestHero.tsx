import React, { useState } from "react";
import {
  MapPin,
  Star,
  StarHalf,
  ShareNetwork,
  Heart,
  BookmarkSimple,
} from "phosphor-react";

import styles from "./DestHero.module.scss";
import type { Destination } from "../../../../services/destinationService";

const DestHero: React.FC<{ data: Destination }> = ({ data }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  return (
    <div className={styles.destHero} data-aos="zoom-out">
      <img src={data.heroImage} alt={data.title} className={styles.heroBgImg} />
      <div className={styles.heroOverlay} />
      <div className={styles.heroContent}>
        <div className={styles.locationTag}>
          <MapPin size={18} weight="fill" /> {data.location}
        </div>
        <h1 className={styles.heroTitle}>{data.title}</h1>
        <div className={styles.heroMeta}>
          <div className={styles.heroRating}>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => {
                // Nếu là 4 sao đầu (index 0-3) thì dùng Star fill
                if (i < 4) {
                  return (
                    <Star key={i} size={18} weight="fill" color="#33d7d1" />
                  );
                }
                // Nếu là sao cuối cùng (index 4) thì dùng StarHalf
                return (
                  <StarHalf key={i} size={18} weight="fill" color="#33d7d1" />
                );
              })}
            </div>
            <span>
              {data.rating} ({data.reviews} đánh giá)
            </span>
          </div>
          <div className={styles.heroCategory}>{data.category}</div>
        </div>
      </div>

      <div className={styles.heroActions}>
        <button className={styles.btnIconCircle}>
          <div className={styles.btnIcon}>
            <ShareNetwork weight="bold" />
          </div>
        </button>
        <button
          className={`${styles.btnIconCircle} ${isFavorite ? styles.activeHeart : ""}`}
          onClick={() => setIsFavorite(!isFavorite)}
        >
          <div className={styles.btnIcon}>
            <Heart
              weight={isFavorite ? "fill" : "bold"}
              color={isFavorite ? "#ef4444" : "currentColor"}
            />
          </div>
        </button>
        <button className={styles.btnIconCircle}>
          <div className={styles.btnIcon}>
            <BookmarkSimple weight="bold" />
          </div>
        </button>
      </div>
    </div>
  );
};

export default DestHero;
