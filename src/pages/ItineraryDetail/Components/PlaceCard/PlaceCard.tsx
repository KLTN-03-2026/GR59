import React from 'react';
import type { RoutePoint } from '../../ItineraryDetail';
import styles from './PlaceCard.module.scss';

interface Props {
  point: RoutePoint;
  index: number;
  isActive: boolean;
  onClick: () => void;
}

const getTypeProps = (type: string) => {
  switch (type) {
    case 'hotel':
      return { icon: 'ph-bed', badgeClass: styles.badge_hotel, label: '🏨 Khách sạn' };
    case 'restaurant':
      return { icon: 'ph-fork-knife', badgeClass: styles.badge_restaurant, label: '🍽️ Nhà hàng' };
    case 'attraction':
      return { icon: 'ph-camera', badgeClass: styles.badge_attraction, label: '📷 Địa điểm tham quan' };
    case 'shopping':
      return { icon: 'ph-shopping-bag', badgeClass: styles.badge_shopping, label: '🛍️ Mua sắm' };
    default:
      return { icon: 'ph-map-pin', badgeClass: styles.badge_other, label: '📍 Địa điểm khác' };
  }
};

const PlaceCard: React.FC<Props> = ({ point, index, isActive, onClick }) => {
  const typeProps = getTypeProps(point.type);

  return (
    <div 
      className={`${styles.itiItem} ${isActive ? styles.itemActiveHighlight : ''}`} 
      onClick={onClick}
    >
      <div className={styles.itemNumber}>{index}</div>
      <div className={styles.itemImg}>
        {point.imageUrl ? (
          <img src={point.imageUrl} alt={point.name} />
        ) : (
          <div className={styles.placeholderImg}>
            <i className={`ph-fill ${typeProps.icon}`}></i>
          </div>
        )}
      </div>
      <div className={styles.itemInfo}>
        <h4>{point.name}</h4>
        {point.note && (
           <div className={styles.itemNote}>
              <i className="ph-fill ph-notepad"></i> {point.note}
           </div>
        )}
        <div className={styles.itemTime}>
          <i className="ph-bold ph-clock"></i> {point.time}
        </div>
        <div>
          <span className={`${styles.itemBadge} ${typeProps.badgeClass}`}>
            {typeProps.label}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlaceCard;