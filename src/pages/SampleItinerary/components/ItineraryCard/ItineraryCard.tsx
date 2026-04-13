import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  MapPin,
  Users,
  Star,
  Coins,
  CaretRight,
  Eye,
} from "@phosphor-icons/react";
import styles from "./ItineraryCard.module.scss";
import type { ItineraryType } from "../../types";

interface Props {
  data: ItineraryType;
}

const ItineraryCard: React.FC<Props> = ({ data }) => {
  const navigate = useNavigate();

  const handleViewDetail = () => {
    navigate(`/itinerary-detail/${data.id}`, {
      state: { itineraryData: data },
    });
  };
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={data.img} alt={data.trip_name} loading="lazy" />
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
          <h3 className={styles.title}>{data.trip_name}</h3>
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
          <div className={styles.daysList}>
            {data.itinerary.slice(0, 2).map((day, dayIdx) => (
              <div key={dayIdx} className={styles.dayGroup}>
                <div className={styles.dayHeader}>
                  <span className={styles.dayBadge}>Ngày {day.day}</span>
                  <span className={styles.dayTheme}>{day.theme}</span>
                </div>
                <div className={styles.activitiesList}>
                  {day.activities.map((act, actIdx) => (
                    <div key={actIdx} className={styles.stepItem}>
                      <div className={styles.visualLine}>
                        <div className={styles.dot} />
                        {(dayIdx !== 1 ||
                          actIdx !== day.activities.length - 1) && (
                          <div className={styles.line} />
                        )}
                      </div>
                      <div className={styles.stepInfo}>
                        <div className={styles.timeRow}>
                          <span className={styles.time}>{act.time}</span>
                          <span className={styles.distance}>{act.note}</span>
                        </div>
                        <p className={styles.activity}>{act.location}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {data.itinerary.length > 2 && (
              <p className={styles.moreDays}>
                ... và {data.itinerary.length - 2} ngày khác
              </p>
            )}
          </div>
        </div>

        <div className={styles.cardFooter}>
          <button className={styles.detailBtn} onClick={handleViewDetail}>
            <Eye size={18} weight="bold" /> Xem chi tiết
          </button>
          <button
            className={styles.selectBtn}
            onClick={() => alert("Đã chọn lộ trình!")}
          >
            Bắt đầu <CaretRight size={18} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ItineraryCard;
