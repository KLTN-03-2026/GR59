import React from 'react';
import styles from './StatCard.module.scss';
import * as Icons from "@phosphor-icons/react";

export type IconName = keyof typeof Icons;

interface StatCardProps {
  label: string;
  value: string;
  trend?: string;
  trendUp?: boolean;
  icon: IconName;
  colorClass: string;
  footerText?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  trend, 
  trendUp, 
  icon, 
  colorClass, 
  footerText 
}) => {
  const IconComponent = Icons[icon] as React.ElementType;

  return (
    <div className={styles.statCard}>
      <div className={styles.statHeader}>
        <div>
          <p className={styles.statLabel}>{label}</p>
          <p className={styles.statValue}>{value}</p>
        </div>
        <div className={`${styles.statIcon} ${styles[colorClass]}`}>
          {IconComponent && <IconComponent size={24} weight="fill" />}
        </div>
      </div>
      {trend && (
        <div className={`${styles.statTrend} ${trendUp ? styles.textEmerald : styles.textAmber}`}>
          {trendUp ? <Icons.TrendUp size={14} /> : <Icons.TrendDown size={14} />}
          <span>{trend}</span>
        </div>
      )}
      {footerText && <p className={styles.footerLabel}>{footerText}</p>}
    </div>
  );
};

export default StatCard;
