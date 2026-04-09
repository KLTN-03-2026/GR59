import React, { useState } from 'react';
import { 
  CalendarBlank, 
  Users, 
  PencilSimple, 
  Trash,
  DotsThreeVertical,
  MapPin,
  Check
} from "@phosphor-icons/react";
import styles from './TripCard.module.scss';
import type { TripPlan } from '../../types';

interface Props {
  data: TripPlan;
}

const TripCard: React.FC<Props> = ({ data }) => {
  const [checklist, setChecklist] = useState(data.checklist);

  const getStatusLabel = (status: string) => {
    switch(status) {
      case 'upcoming': return 'Sắp tới';
      case 'ongoing': return 'Đang đi';
      case 'completed': return 'Đã xong';
      default: return status;
    }
  };

  const toggleItem = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, isCompleted: !item.isCompleted } : item
    ));
  };

  const completedChecks = checklist.filter(c => c.isCompleted).length;
  const progressPercent = Math.round((completedChecks / checklist.length) * 100);

  return (
    <div className={styles.tripCard} data-aos="fade-up">
      <div className={styles.cardHeader}>
        <img src={data.image} alt={data.title} className={styles.cardImage} />
        <div className={styles.headerOverlays}>
          <span className={`${styles.statusBadge} ${styles[data.status]}`}>
            {getStatusLabel(data.status)}
          </span>
          <button className={styles.btnMenu}>
            <DotsThreeVertical size={20} weight="bold" />
          </button>
        </div>
      </div>

      <div className={styles.cardBody}>
        <div className={styles.tripMainInfo}>
          <h3 className={styles.tripTitle}>{data.title}</h3>
          <div className={styles.metaRow}>
            <div className={styles.metaItem}>
              <CalendarBlank size={16} />
              <span>{data.days} ngày</span>
            </div>
            <div className={styles.metaItem}>
              <Users size={16} />
              <span>{data.people} người</span>
            </div>
          </div>
        </div>

        <div className={styles.timelineSection}>
          <div className={styles.sectionTitle}>
            <MapPin size={16} weight="bold" />
            <span>CHUẨN BỊ LỘ TRÌNH</span>
            <span className={styles.progressText}>{progressPercent}%</span>
          </div>
          <div className={styles.checklistMini}>
            {checklist.slice(0, 3).map(item => (
              <label key={item.id} className={`${styles.checkItem} ${item.isCompleted ? styles.completed : ''}`}>
                <div className={styles.checkboxContainer}>
                  <input 
                    type="checkbox" 
                    checked={item.isCompleted} 
                    onChange={() => toggleItem(item.id)} 
                    className={styles.realCheckbox}
                  />
                  <span className={styles.customCheckbox}>
                    {item.isCompleted && <Check size={12} weight="bold" />}
                  </span>
                </div>
                <span className={styles.itemLabel}>{item.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.cardFooter}>
          <button className={styles.btnActionPrimary}>Xem chi tiết</button>
          <div className={styles.actionGroup}>
            <button className={styles.btnIcon} title="Chỉnh sửa">
              <PencilSimple size={18} weight="bold" />
            </button>
            <button className={`${styles.btnIcon} ${styles.btnDelete}`} title="Xóa">
              <Trash size={18} weight="bold" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripCard;
