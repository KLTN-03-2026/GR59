import React from "react";
import { Link } from "react-router-dom";
import { MapPin, Star, Bed as BedIcon, ForkKnife } from "@phosphor-icons/react";
import styles from "./LocationCard.module.scss";
import AnimatedButton from "../AnimatedButton/AnimatedButton";
import type { HighlightItem } from "../../../services/highlightService";

interface LocationCardProps {
  item: HighlightItem;
  idx?: number;
}

const LocationCard: React.FC<LocationCardProps> = ({ item, idx = 0 }) => {
  const renderIcon = (type: string) => {
    if (type === "bed") return <BedIcon size={16} weight="fill" />;
    if (type === "food") return <ForkKnife size={16} weight="fill" />;
    return <MapPin size={16} weight="fill" />;
  };

  return (
    <Link
      to={
        item.type === "bed"
          ? `/hotel/${item.id}`
          : item.type === "food"
          ? `/restaurant/${item.id}`
          : `/attraction/${item.id}`
      }
      className={styles.cardWrapperLink}
      data-aos="fade-up"
      data-aos-delay={idx * 100}
    >
      <div className={styles.locationCard}>
        <div className={styles.imageContainer}>
          <img src={item.image} alt={item.name} loading="lazy" />
          <div className={styles.imageOverlay}></div>
          <div className={styles.statusBadge}>
            <span
              className={`${styles.ribbon} ${
                styles[item.status?.toLowerCase() || "active"]
              }`}
            >
              {item.status === "ACTIVE" || item.status === "OPEN"
                ? "Đang mở cửa"
                : item.status === "MAINTENANCE"
                ? "Đang bảo trì"
                : "Đã đóng cửa"}
            </span>
          </div>
          {item.isHot && <div className={styles.hotTag}>HOT</div>}
          {item.price > 0 && (
            <div className={styles.floatingPrice}>
              {item.price.toLocaleString("vi-VN")}đ
            </div>
          )}
        </div>

        <div className={styles.cardInfo}>
          <div className={styles.infoHead}>
            <div className={styles.typeBadge}>
              {renderIcon(item.type)}{" "}
              {item.type === "bed"
                ? "Khách sạn"
                : item.type === "food"
                ? "Ẩm thực"
                : "Địa điểm"}
            </div>
            <div className={styles.ratingBadge}>
              <Star size={14} weight="fill" /> {item.rating}
            </div>
          </div>

          <h3>{item.name}</h3>
          <p>{item.desc}</p>

          <div className={styles.infoFooter}>
            <div className={styles.locationName}>
              <MapPin size={14} weight="fill" /> {item.location}
            </div>
            <div className={styles.viewDetail}>
              <AnimatedButton text="XEM THÊM" size="mini" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default LocationCard;
