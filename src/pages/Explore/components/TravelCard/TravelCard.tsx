import React from "react";
import { Heart, Star, MapPin, Play, X, ArrowRight } from "@phosphor-icons/react";
import styles from "./TravelCard.module.scss";
import AnimatedButton from "../../../../components/Ui/AnimatedButton/AnimatedButton";

interface Props {
  image: string;
  title: string;
  rating: number;
  location?: string;
  description: string;
  isHot?: boolean;
  previewVideo?: string;
  isLiked?: boolean;
  onToggleLike?: () => void;
  onDetail?: () => void;
  status?: string;
  price?: number;
}

const TravelCard: React.FC<Props> = ({
  image,
  title,
  rating,
  location,
  description,
  isHot,
  previewVideo,
  isLiked = false,
  onToggleLike,
  onDetail,
  status,
  price,
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
      <div className={styles.imageContainer}>
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

        <div className={styles.statusBadge}>
          {status && !isPlaying && (
            <div className={`${styles.modernBadge} ${styles[status.toLowerCase()]}`}>
              {status === 'ACTIVE' || status === 'OPENING' || status === 'OPEN' ? 'Mở cửa' : 
               status === 'MAINTENANCE' ? 'Bảo trì' : 'Đóng cửa'}
            </div>
          )}
        </div>

        {isHot && !isPlaying && (
          <div className={styles.hotTag}>
            HOT
          </div>
        )}

        <button
          className={`${styles.heartBtn} ${localLiked ? styles.liked : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setLocalLiked(!localLiked);
            if (onToggleLike) onToggleLike();
          }}
          aria-label="Yêu thích"
        >
          <Heart
            size={26}
            weight={localLiked ? "fill" : "bold"}
          />
        </button>

        {price && price > 0 && (
          <div className={styles.floatingPrice}>
            {price.toLocaleString("vi-VN")}đ
          </div>
        )}

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
      </div>

      <div className={styles.cardInfo}>
        <div className={styles.infoHead}>
          <div className={styles.ratingBadge}>
            <Star size={16} weight="fill" className={styles.starIcon} />{" "}
            {rating}
          </div>
          {location && (
            <span className={styles.locationTag}>
              <MapPin size={18} weight="bold" /> {location}
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
                <Play size={18} weight="fill" /> Video
              </button>
            )}
          </div>
          <AnimatedButton 
            text="CHI TIẾT" 
            size="mini" 
            onClick={onDetail}
          />
        </div>
      </div>
    </div>
  );
};

export default TravelCard;
