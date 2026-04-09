import React from 'react';
import styles from './Topbar.module.scss';
import { MagnifyingGlass, Bell, Question } from "@phosphor-icons/react";

interface TopbarProps {
  viewTitle: string;
}

const Topbar: React.FC<TopbarProps> = ({ viewTitle }) => {
  return (
    <header className={styles.topbar}>
      <h2 className={styles.viewTitle}>{viewTitle}</h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div className={styles.searchRel}>
          <MagnifyingGlass size={20} className={styles.searchIcon} />
          <input type="text" placeholder={`Tìm kiếm trong ${viewTitle.toLowerCase()}...`} />
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button className={styles.iconBtn}>
            <Bell size={22} />
            <span className={styles.badge}></span>
          </button>
          <button className={styles.iconBtn}>
            <Question size={22} />
          </button>
        </div>

        <div style={{ width: '1px', height: '28px', backgroundColor: '#f1f5f9', margin: '0 4px' }}></div>

        <div className={styles.userProfile}>
          <div className={styles.userInfo}>
            <p>Quản trị viên</p>
            <p>Super Admin</p>
          </div>
          <img 
            src="https://i.pravatar.cc/100?u=admin" 
            alt="Avatar" 
            className={styles.avatar}
          />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
