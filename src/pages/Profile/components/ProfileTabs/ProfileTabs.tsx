import React, { useState } from 'react';
import styles from './ProfileTabs.module.scss';

interface ProfileTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'info', label: 'Thông tin cá nhân', icon: 'ph-bold ph-user' },
    { id: 'trips', label: 'Lịch trình đã lưu', icon: 'ph-bold ph-airplane-tilt' },
    { id: 'reviews', label: 'Lịch sử đánh giá', icon: 'ph-bold ph-chat-circle-dots' },
    { id: 'security', label: 'Bảo mật', icon: 'ph-bold ph-shield-check' },
    { id: 'settings', label: 'Cài đặt', icon: 'ph-bold ph-gear-six' },
  ];

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabsList}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tabItem} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <i className={tab.icon}></i>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProfileTabs;