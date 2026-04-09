import React from 'react';
import { MagnifyingGlass, TrendUp,  } from "@phosphor-icons/react";
import styles from './NewsSidebar.module.scss';
import type { NewsItem } from '../../types';

interface Props {
  trendingNews: NewsItem[];
  categories: string[];
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  onSearch: (query: string) => void;
}

const NewsSidebar: React.FC<Props> = ({ 
  trendingNews, 
 
  onSearch 
}) => {
  return (
    <aside className={styles.sidebar}>
      {/* Search Bar */}
      <div className={styles.section} data-aos="fade-left">
        <div className={styles.searchBox}>
          <MagnifyingGlass size={20} weight="bold" />
          <input 
            type="text" 
            placeholder="Tìm kiếm tin tức..." 
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Trending News */}
      <div className={styles.section} data-aos="fade-left" data-aos-delay="100">
        <h3 className={styles.title}>
          <TrendUp size={24} weight="bold" /> Xu hướng
        </h3>
        <div className={styles.trendingList}>
          {trendingNews.map((news, index) => (
            <div key={news.id} className={styles.trendingItem}>
              <span className={styles.index}>{index + 1}</span>
              <div className={styles.info}>
                <h4>{news.title}</h4>
                <span>{news.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories Quick Link */}
      {/* <div className={styles.section} data-aos="fade-left" data-aos-delay="200">
        <h3 className={styles.title}>
          <Tag size={24} weight="bold" /> Danh mục
        </h3>
        <div className={styles.categoryLinks}>
          {categories.map(cat => (
            <button 
              key={cat}
              className={`${styles.catLink} ${activeCategory === cat ? styles.active : ''}`}
              onClick={() => onCategoryChange(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div> */}

      {/* Ad/Promo Placeholder */}
      <div className={styles.promoBanner} data-aos="fade-left" data-aos-delay="300">
        <h4>Bắt đầu hành trình của bạn</h4>
        <p>Để AI thiết kế lịch trình du lịch hoàn hảo cho bạn chỉ trong 30 giây.</p>
        <button>Thử ngay</button>
      </div>
    </aside>
  );
};

export default NewsSidebar;
