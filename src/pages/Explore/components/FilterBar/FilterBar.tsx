import React from 'react';
import styles from './FilterBar.module.scss';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ searchTerm, onSearchChange }) => {
  return (
    <div className={styles.filterBar}>
      <div className={styles.searchSide}>
        <div className={styles.inputGroup}>
          <span className={styles.searchIcon}>🔍</span>
          <input 
            type="text" 
            placeholder="Bạn muốn đi đâu hôm nay?..." 
            value={searchTerm}
            onChange={onSearchChange}
          />
        </div>
      </div>
      
      <div className={styles.selectSide}>
        <select className={styles.selectBox}>
          <option value="price">💰 Giá tốt nhất</option>
          <option value="near">📍 Gần tôi nhất</option>
          <option value="rating">⭐️ Xếp hạng cao</option>
        </select>
        
        <select className={styles.selectBox}>
          <option value="all">🕒 Mọi lúc</option>
          <option value="open">🟢 Đang mở cửa</option>
        </select>
        
        <button className={styles.btnAdvance}>
          <span>🛠</span> Lọc
        </button>
        <button className={styles.btnSort}>
          <span>⇅</span> Sắp xếp
        </button>
      </div>
    </div>
  );
};

export default FilterBar;