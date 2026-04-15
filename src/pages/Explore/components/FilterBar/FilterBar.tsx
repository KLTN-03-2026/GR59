import React, { useState, useRef, useEffect } from 'react';
import styles from './FilterBar.module.scss';
import { CaretDown } from "@phosphor-icons/react";

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProvinceChange: (value: string) => void;
  onPriceRangeChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

interface Option {
  value: string;
  label: string;
}

// Custom Select Component for a premium look
const CustomSelect: React.FC<{ 
  options: Option[], 
  defaultValue: string,
  onChange?: (value: string) => void 
}> = ({ options, defaultValue, onChange }) => {
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

  const handleSelect = (option: Option) => {
    setSelected(option);
    setIsOpen(false);
    if (onChange) {
      onChange(option.value);
    }
  };

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
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const FilterBar: React.FC<FilterBarProps> = ({ 
  searchTerm, 
  onSearchChange,
  onProvinceChange,
  onPriceRangeChange,
  onSortChange
}) => {
  const sortOptions = [
    { value: "rating", label: "⭐️ Đánh giá cao" },
    { value: "priceAsc", label: "💰 Giá: Thấp - Cao" },
    { value: "priceDesc", label: "💰 Giá: Cao - Thấp" },
  ];

  const provinceOptions = [
    { value: "all", label: "📍 Toàn quốc" },
    { value: "1", label: "🏮 Thừa Thiên Huế" },
    { value: "2", label: "🌉 Đà Nẵng" },
    { value: "3", label: "🏺 Quảng Nam" },
    { value: "4", label: "🏛️ Hà Nội" },
    { value: "5", label: "🏙️ TP. Hồ Chí Minh" },
  ];

  const priceOptions = [
    { value: "all", label: "💵 Tất cả mức giá" },
    { value: "budget", label: "🌱 Dưới 500k" },
    { value: "mid", label: "🌤 500k - 2tr" },
    { value: "luxury", label: "✨ Trên 2tr" },
  ];

  return (
    <div className={styles.filterBar}>
      <div className={styles.searchSide}>
        <div className={styles.inputGroup}>
          <span className={styles.searchIcon}>🔍</span>
          <input 
            type="text" 
            placeholder="Tìm kiếm địa điểm, món ăn..." 
            value={searchTerm}
            onChange={onSearchChange}
          />
        </div>
      </div>
      
      <div className={styles.selectSide}>
        <CustomSelect options={provinceOptions} defaultValue="all" onChange={onProvinceChange} />
        <CustomSelect options={priceOptions} defaultValue="all" onChange={onPriceRangeChange} />
        <CustomSelect options={sortOptions} defaultValue="rating" onChange={onSortChange} />
        
        <button className={styles.btnAdvance}>
          <span>🛠</span> Lọc
        </button>
      </div>
    </div>
  );
};

export default FilterBar;