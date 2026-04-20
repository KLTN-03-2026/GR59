import React, { useState, useRef, useEffect } from 'react';
import styles from './FilterBar.module.scss';
import { CaretDown } from "@phosphor-icons/react";

interface FilterBarProps {
  searchTerm: string;
  activeTab: string; // Thêm prop này để biết đang ở tab nào
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onProvinceChange: (value: string) => void;
  onPriceRangeChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
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
    // Khi options thay đổi (do đổi tab), cập nhật lại selected
    const newSelected = options.find(o => o.value === defaultValue) || options[0];
    setSelected(newSelected);
  }, [defaultValue, options]);

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
  activeTab,
  onSearchChange,
  onProvinceChange,
  onPriceRangeChange,
  onCategoryChange,
  onSortChange
}) => {
  const sortOptions = [
    { value: "rating", label: "⭐ Số sao cao nhất" },
    { value: "priceAsc", label: "💰 Giá: Thấp đến Cao" },
    { value: "priceDesc", label: "💰 Giá: Cao đến Thấp" },
  ];

  const provinceOptions = [
    { value: "all", label: "📍 Toàn quốc" },
    { value: "1", label: "🏮 Thừa Thiên Huế" },
    { value: "2", label: "🌉 Đà Nẵng" },
    { value: "3", label: "🏺 Quảng Nam" },
    { value: "4", label: "🏛️ Hà Nội" },
    { value: "5", label: "🏙️ TP. Hồ Chí Minh" },
  ];

  // Logic lấy danh mục động dựa theo Tab
  const getCategoryOptions = () => {
    const baseOptions = [{ value: "all", label: "🏷️ Tất cả danh mục" }];
    
    if (activeTab === "bed") {
      return [
        ...baseOptions,
        { value: "LUXURY", label: "✨ Cao cấp (Luxury)" },
        { value: "RESORT", label: "🏰 Resort / Nghỉ dưỡng" },
        { value: "BOUTIQUE", label: "🎨 Boutique / Phong cách" },
        { value: "BUDGET", label: "💰 Bình dân / Giá rẻ" },
        { value: "BUSINESS", label: "💼 Công tác / Business" },
        { value: "HOMESTAY", label: "🏡 Homestay" },
        { value: "VILLA", label: "🏠 Villa / Biệt thự" },
      ];
    }
    
    if (activeTab === "food") {
      return [
        ...baseOptions,
        { value: "VIETNAMESE", label: "🥢 Món Việt" },
        { value: "SEAFOOD", label: "🦀 Hải sản" },
        { value: "DESSERT", label: "🍰 Tráng miệng / Cafe" },
        { value: "WESTERN", label: "🍔 Món Âu" },
        { value: "ASIAN", label: "🍣 Món Á (Hàn, Nhật...)" },
        { value: "VEGETARIAN", label: "🥦 Đồ chay" },
      ];
    }
    
    if (activeTab === "pin") {
      return [
        ...baseOptions,
        { value: "CULTURE", label: "🏛️ Văn hóa & Lịch sử" },
        { value: "NATURE", label: "🌿 Thiên nhiên & Cảnh sắc" },
        { value: "ATTRACTION", label: "🗺️ Điểm tham quan chung" },
        { value: "RELAX", label: "🧘 Nghỉ dưỡng & Thư giãn" },
        { value: "ENTERTAINMENT", label: "🎡 Vui chơi giải trí" },
      ];
    }

    // Default cho Tab "Tất cả"
    return [
      ...baseOptions,
      { value: "resort", label: "🏰 Resort / Luxury" },
      { value: "hotel", label: "🏨 Khách sạn" },
      { value: "restaurant", label: "🍽️ Nhà hàng" },
      { value: "cafe", label: "☕ Cafe" },
      { value: "attraction", label: "🎡 Điểm tham quan" },
    ];
  };

  const categoryOptions = getCategoryOptions();

  const priceOptions = [
    { value: "all", label: "💵 Tất cả mức giá" },
    { value: "budget", label: "🌱 Tiết kiệm (< 500k)" },
    { value: "mid", label: "🌤 Phổ thông (500k-2tr)" },
    { value: "luxury", label: "✨ Cao cấp (> 2tr)" },
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
        <CustomSelect 
          key={activeTab} // Dùng key để re-render select khi đổi tab
          options={categoryOptions} 
          defaultValue="all" 
          onChange={onCategoryChange} 
        />
        <CustomSelect options={priceOptions} defaultValue="all" onChange={onPriceRangeChange} />
        <CustomSelect options={sortOptions} defaultValue="rating" onChange={onSortChange} />
        
       
      </div>
    </div>
  );
};

export default FilterBar;