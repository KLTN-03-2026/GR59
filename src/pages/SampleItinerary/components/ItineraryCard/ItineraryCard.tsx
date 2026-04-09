import React from "react";
import { Clock, MapPin, Users, Star, Coins, CaretRight } from "@phosphor-icons/react";
import styles from "./ItineraryCard.module.scss";
import type { ItineraryType } from "../../types";

interface Props {
  data: ItineraryType;
}

const ItineraryCard: React.FC<Props> = ({ data }) => {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={data.img} alt={data.title} loading="lazy" />
        <div className={styles.overlayTags}>
          <span className={styles.priceBadge}>
            <Coins size={16} weight="fill" />
            {data.price.toLocaleString()}đ
          </span>
          <span className={styles.peopleBadge}>
            <Users size={16} weight="bold" />
            Tối đa {data.maxPeople}
          </span>
        </div>
        <div className={styles.ratingBadge}>
          <Star size={14} weight="fill" /> {data.rating}
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>{data.title}</h3>
          <div className={styles.metaInfo}>
            <span className={styles.duration}>
              <Clock size={16} weight="bold" /> {data.duration}
            </span>
            <span className={styles.location}>
              <MapPin size={16} weight="bold" /> {data.location}
            </span>
          </div>
        </div>

        <div className={styles.itineraryTimeline}>
          <p className={styles.timelineLabel}>Lịch trình dự kiến:</p>
          <div className={styles.stepsList}>
            {data.steps.map((step, idx) => (
              <div key={idx} className={styles.stepItem}>
                <div className={styles.visualLine}>
                  <div className={styles.dot} />
                  {idx !== data.steps.length - 1 && <div className={styles.line} />}
                </div>
                <div className={styles.stepInfo}>
                  <div className={styles.timeRow}>
                    <span className={styles.time}>{step.time}</span>
                    <span className={styles.distance}>{step.dist}</span>
                  </div>
                  <p className={styles.activity}>{step.activity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className={styles.selectBtn}
          onClick={() => alert("Đã chọn lộ trình!")}
        >
          Lựa chọn lộ trình này <CaretRight size={18} weight="bold" />
        </button>
      </div>
    </div>
  );
};

export default ItineraryCard;
