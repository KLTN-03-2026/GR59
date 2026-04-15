import React from "react";
import { Heart, Star, MapPin, Play, X } from "@phosphor-icons/react";
import styles from "./TravelCard.module.scss";

interface Props {
  image: string;
  title: string;
  rating: number;
  distance?: string;
  description: string;
  isHot?: boolean;
  previewVideo?: string;
  isLiked?: boolean;
  onToggleLike?: () => void;
  status?: string;
}

const TravelCard: React.FC<Props> = ({
  image,
  title,
  rating,
  distance,
  description,
  isHot,
  previewVideo,
  isLiked = false,
  onToggleLike,
}) => {
  const [localLiked, setLocalLiked] = React.useState(isLiked);
  const [isHovered, setIsHovered] = React.useState(false);

  React.useEffect(() => {
    setLocalLiked(isLiked);
  }, [isLiked]);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  React.useEffect(() => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isPlaying]);

  return (
    <div
      className={`${styles.card} ${isPlaying ? styles.isPlayingVideo : ""} ${isHovered && previewVideo ? styles.isHovered : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPlaying(false);
      }}
      data-is-playing={isPlaying}
    >
      <div className={styles.imageWrapper}>
        <img
          src={image}
          alt={title}
          loading="lazy"
          className={isPlaying ? styles.hideImage : ""}
        />

        {previewVideo && isPlaying && (
          <video
            ref={videoRef}
            src={previewVideo}
            className={styles.previewVideo}
            muted
            loop
            playsInline
            autoPlay
          />
        )}

        <div className={styles.imageOverlay} />

        <button
          className={`${styles.heartBtn} ${localLiked ? styles.liked : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setLocalLiked(!localLiked);
            if (onToggleLike) onToggleLike();
          }}
          aria-label="Yêu thích"
        >
          <div style={{ fontSize: "1rem" }}>
            <Heart
              size={24}
              weight={localLiked ? "fill" : "bold"}
              color={localLiked ? "#ff4d4d" : "currentColor"}
            />
          </div>
        </button>

        {isPlaying && (
          <button
            aria-label="Dừng video"
            className={styles.btnCloseVideo}
            onClick={(e) => {
              e.stopPropagation();
              setIsPlaying(false);
            }}
          >
            <X size={20} weight="bold" />
          </button>
        )}

        {isHot && !isPlaying && (
          <div className={styles.hotBadge}>
            <span className={styles.dot} />
            HẤP DẪN
          </div>
        )}

        {status === "MAINTENANCE" && !isPlaying && (
          <div className={`${styles.hotBadge} ${styles.maintenanceBadge}`}>
            <span className={`${styles.dot} ${styles.maintenanceDot}`} />
            BẢO TRÌ
          </div>
        )}
      </div>
      {}

      <div className={styles.floatingContent}>
        <div className={styles.topMeta}>
          <span className={styles.ratingBadge}>
            <Star size={14} weight="fill" className={styles.starIcon} />{" "}
            {rating}
          </span>
          {distance && (
            <span className={styles.distanceTag}>
              <MapPin size={16} weight="bold" /> {distance}
            </span>
          )}
        </div>

        <h3 className={styles.title}>{title}</h3>
        <p className={styles.shortDesc}>{description}</p>

        <div className={styles.cardFooter}>
          <div className={styles.tags}>
            {previewVideo && !isPlaying && (
              <button
                className={styles.btnVideo}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsPlaying(true);
                }}
              >
                <Play size={16} weight="fill" /> Xem video
              </button>
            )}
          </div>
          <button className={styles.btnExplore}>Xem chi tiết</button>
        </div>
      </div>
    </div>
  );
};

export default TravelCard;
