import React from 'react';
import styles from './ItineraryHero.module.scss';

import { Mouse } from "@phosphor-icons/react";

const ItineraryHero: React.FC = () => {
  const scrollToContent = () => {
    window.scrollTo({
      top: 600,
      behavior: "smooth"
    });
  };

  return (
    <section className={styles.hero}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 data-aos="zoom-out" data-aos-duration="1200">
          Lộ Trình <span>Du Lịch Mẫu</span>
        </h1>
        <p data-aos="fade-up" data-aos-delay="400">
          Những hành trình được thiết kế tối ưu bởi AI và chuyên gia bản địa mang lại trải nghiệm độc bản.
        </p>
        <div className={styles.accentBar} data-aos="stretch-x" data-aos-delay="600" />
      </div>
      
      <button 
        className={styles.scrollDown} 
        onClick={scrollToContent}
        data-aos="fade-up"
        data-aos-delay="1000"
        data-aos-offset="0"
      >
        <span>Khám phá ngay</span>
        <Mouse size={32} weight="light" className={styles.mouseIcon} />
      </button>
    </section>
  );
};
export default ItineraryHero;