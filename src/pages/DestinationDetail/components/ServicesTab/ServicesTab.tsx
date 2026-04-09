import React from "react";
import { Star, MapPin } from "@phosphor-icons/react";
import styles from "./ServicesTab.module.scss";
import type { Destination } from "../../DestinationDetail";

interface ServicesTabProps {
  services: Destination["services"];
}

const ServicesTab: React.FC<ServicesTabProps> = ({ services }) => {
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
              <img src={service.image} alt={service.name} />
              <span className={styles.badge}>{service.type}</span>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.cardHeader}>
                <h4>{service.name}</h4>
                <span className={styles.rating}>
                  <Star weight="fill" /> {service.rating}
                </span>
              </div>
              <p className={styles.location}>
                <MapPin size={14} /> {service.location}
              </p>
              <div className={styles.cardFooter}>
                <p className={styles.price}>
                  ~ {service.price}
                  <span>/{service.unit}</span>
                </p>
                <button className={styles.btnAction}>
                  {service.buttonText}
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
