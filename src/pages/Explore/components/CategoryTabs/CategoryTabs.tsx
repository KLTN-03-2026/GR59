import styles from './CategoryTabs.module.scss';

const categories = [
  { id: 'all', label: 'TẤT CẢ', icon: '🔍' },
  { id: 'food', label: 'NHÀ HÀNG', icon: '🍴' },
  { id: 'bed', label: 'KHÁCH SẠN', icon: '🏨' },
  { id: 'pin', label: 'THAM QUAN', icon: '🏛️' },
  { id: 'cafe', label: 'CÀ PHÊ', icon: '☕' },
];

interface CategoryTabsProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ activeCategory, onCategoryChange }) => {
  return (
    <div className={styles.tabsContainer}>
      {categories.map((cat) => (
        <button
          key={cat.id}
          className={`${styles.tabItem} ${activeCategory === cat.id ? styles.active : ''}`}
          onClick={() => onCategoryChange(cat.id)}
        >
          <span className={styles.icon}>{cat.icon}</span>
          <span className={styles.label}>{cat.label}</span>
        </button>
      ))}
    </div>
  );
};

export default CategoryTabs;