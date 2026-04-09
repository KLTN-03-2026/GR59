import React from 'react';
import styles from './InterestItem.module.scss';

interface Props {
  label: string;
  icon: string;
  color: string;
  isActive: boolean;
  onClick: () => void;
}

const InterestItem: React.FC<Props> = ({ label, icon, color, isActive, onClick }) => {
  return (
    <div 
      className={`${styles.item} ${isActive ? styles.active : ''}`} 
      onClick={onClick}
      style={{ borderColor: isActive ? '#ff7e00' : undefined }}
    >
      <i className={icon} style={{ color: isActive ? color : '#94a3b8' }}></i>
      <span style={{ color: isActive ? '#1e293b' : '#64748b' }}>{label}</span>
    </div>
  );
};

export default InterestItem;