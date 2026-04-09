import React from 'react';
import styles from './AddTripCard.module.scss';
import { Plus } from "@phosphor-icons/react";

const AddTripCard: React.FC = () => {
  return (
    <div className={styles.addTripCard} data-aos="fade-up" data-aos-delay="200">
      <div className={styles.addNewContent}>
        <div className={styles.plusCircle}>
          <Plus size={32} weight="bold" />
        </div>
        <h3>Thêm lịch trình</h3>
        <p>Bắt đầu hành trình mới của bạn</p>
      </div>
    </div>
  );
};

export default AddTripCard;