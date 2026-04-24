import React from "react";
import { Star, MapPin, NavigationArrow, Phone, Clock } from "@phosphor-icons/react";
import styles from "./ServicesTab.module.scss";
import type { NearbyService } from "../../../../services/destinationService";

interface ServicesTabProps {
  services: NearbyService[];
}

const ServicesTab: React.FC<ServicesTabProps> = ({ services }) => {
  if (!services || services.length === 0) {
    return (
      <div className={styles.emptyServices}>
        <p>Hiện chưa có dịch vụ lân cận nào được cập nhật.</p>
      </div>
    );
  }

  const getServiceLabel = (type: string) => {
    switch (type) {
      case 'RESTAURANT': return 'Nhà hàng';
      case 'HOTEL': return 'Khách sạn';
      case 'ATM': return 'ATM';
      case 'STORE': return 'Cửa hàng';
      case 'COFFEE': return 'Cà phê';
      default: return type;
    }
  };

  return (
    <div className={styles.servicesContainer} data-aos="fade-up">
      <div className={styles.headerFlex}>
        <h2 className={styles.tabTitle}>Dịch vụ lân cận</h2>
        <span className={styles.viewAll}>Xem tất cả</span>
      </div>

      <div className={styles.servicesGrid}>
        {services.map((service) => (
          <div key={service.id} className={styles.serviceCard}>
            <div className={styles.cardThumb}>
              <img 
                src={service.imageUrl || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop"} 
                alt={service.serviceName} 
              />
              <span className={styles.badge}>{getServiceLabel(service.serviceType)}</span>
              {service.distanceKm && (
                <div className={styles.distanceBadge}>
                  <NavigationArrow size={12} weight="fill" /> {service.distanceKm} km
                </div>
              )}
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardHeader}>
                <h4 title={service.serviceName}>{service.serviceName}</h4>
                <div className={styles.ratingGroup}>
                  <span className={styles.rating}>
                    <Star weight="fill" /> {service.rating || "5.0"}
                  </span>
                  <span className={styles.reviewCount}>({service.reviewCount || 0})</span>
                </div>
              </div>
              
              <div className={styles.infoRows}>
                <p className={styles.location}>
                  <MapPin size={14} /> {service.address}
                </p>
                <p className={styles.timeInfo}>
                  <Clock size={14} /> {service.openingHours || "Đang mở cửa"}
                </p>
                {service.phoneNumber && (
                  <p className={styles.phoneInfo}>
                    <Phone size={14} /> {service.phoneNumber}
                  </p>
                )}
              </div>

              <div className={styles.cardFooter}>
                <p className={styles.price}>
                  {service.priceLevel || "Liên hệ"}
                </p>
                <button className={styles.btnAction}>
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesTab;
