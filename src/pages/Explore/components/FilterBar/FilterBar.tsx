import React, { useState, useRef, useEffect } from 'react';
import styles from './FilterBar.module.scss';
import { CaretDown } from "@phosphor-icons/react";

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface Option {
  value: string;
  label: string;
}

// Custom Select Component for a premium look
const CustomSelect: React.FC<{ options: Option[], defaultValue: string }> = ({ options, defaultValue }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState(options.find(o => o.value === defaultValue) || options[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.customSelect} ref={dropdownRef}>
      <div 
        className={`${styles.selectBox} ${isOpen ? styles.activeBox : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.selectLabel}>{selected.label}</span>
        <CaretDown 
          size={14} 
          weight="bold" 
          className={`${styles.caretIcon} ${isOpen ? styles.rotated : ''}`} 
        />
      </div>
      
      {isOpen && (
        <div className={styles.dropdownMenu}>
          {options.map((option) => (
            <div 
              key={option.value}
              className={`${styles.dropdownItem} ${selected.value === option.value ? styles.selectedItem : ''}`}
              onClick={() => {
                setSelected(option);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FilterBar: React.FC<FilterBarProps> = ({ searchTerm, onSearchChange }) => {
  const sortOptions = [
    { value: "price", label: "💰 Giá tốt nhất" },
    { value: "near", label: "📍 Gần tôi nhất" },
    { value: "rating", label: "⭐️ Xếp hạng cao" },
  ];

  const timeOptions = [
    { value: "all", label: "🕒 Mọi lúc" },
    { value: "open", label: "🟢 Đang mở cửa" },
  ];

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
        <CustomSelect options={sortOptions} defaultValue="price" />
        <CustomSelect options={timeOptions} defaultValue="all" />
        
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