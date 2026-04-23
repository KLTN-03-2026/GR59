import React from "react";
import styles from "./FilterSection.module.scss";
import type { FilterState } from "../../types";
import { MapPin, CurrencyCircleDollar, Users } from "@phosphor-icons/react";

interface Props {
  onFilterChange: (newFilters: FilterState) => void;
  filters: FilterState;
}

const FilterSection: React.FC<Props> = ({ onFilterChange, filters }) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      [name]: name === "people" ? parseInt(value) || 1 : value,
    });
  };

  return (
    <section className={styles.wrapper} data-aos="fade-up" data-aos-delay="600">
      <div className={styles.filterGroup}>
        <label htmlFor="location">
          <MapPin size={20} weight="fill" color="#00a8a2" /> Địa điểm
        </label>
        <div className={styles.selectWrapper}>
          <select
            id="location"
            name="location"
            title="Chọn địa điểm"
            value={filters.location}
            onChange={handleChange}
          >
            <option value="all">Tất cả địa điểm</option>
            <option value="Đà Nẵng">Đà Nẵng</option>
            <option value="Hội An">Hội An</option>
          </select>
        </div>
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="priceRange">
          <CurrencyCircleDollar size={20} weight="fill" color="#00a8a2" /> Ngân
          sách
        </label>
        <div className={styles.selectWrapper}>
          <select
            id="priceRange"
            name="priceRange"
            title="Chọn mức ngân sách"
            value={filters.priceRange}
            onChange={handleChange}
          >
            <option value="all">Tất cả mức giá</option>
            <option value="low">Tiết kiệm (Dưới 600k)</option>
            <option value="mid">Tiêu chuẩn (600k - 1tr)</option>
            <option value="high">Cao cấp (Trên 1tr)</option>
          </select>
        </div>
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="people">
          <Users size={20} weight="fill" color="#00a8a2" /> Số người
        </label>
        <div className={styles.inputWrapper}>
          <input
            id="people"
            type="number"
            name="people"
            title="Nhập số người"
            min="1"
            max="20"
            value={filters.people}
            onChange={handleChange}
          />
        </div>
      </div>
    </section>
  );
};

export default FilterSection;
