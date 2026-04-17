import React, { useState, useEffect } from 'react';
import type { RoutePoint } from '../../ItineraryDetail';
import styles from './ItinerarySidebar.module.scss';
import PlaceCard from '../PlaceCard/PlaceCard';
import axios from 'axios';

interface TravelMetric {
  distance: string;
  duration: number;
}

interface Props {
  points: RoutePoint[];
  activePointId: string | null;
  onPointClick: (id: string) => void;
  isPreviewing: boolean;
  onTogglePreview: () => void;
  onOpenAddModal: () => void;
  planData?: {
    destination: string;
    budget: string;
    peopleGroup: string;
    interests: string[];
    travelDate: string;
  };
  metrics?: Record<string, TravelMetric>;
  activeDay: number;
  setActiveDay: (day: number) => void;
  onOpenNavigation: (lat: number, lng: number, name: string) => void;
}

const ItinerarySidebar: React.FC<Props> = ({
  points,
  activePointId,
  onPointClick,
  isPreviewing,
  onTogglePreview,
  onOpenAddModal,
  planData,
  metrics = {},
  activeDay,
  setActiveDay,
  onOpenNavigation
}) => {
  const [showStats, setShowStats] = useState(false);

  const dailyPoints = points.filter(p => (p.day || 1) === activeDay);

  // Split daily points into morning and afternoon
  const morningPoints = dailyPoints.filter(p => {
    const hours = parseInt(p.time.split(':')[0], 10);
    return hours < 12;
  });

  const afternoonPoints = dailyPoints.filter(p => {
    const hours = parseInt(p.time.split(':')[0], 10);
    return hours >= 12;
  });

  const handleTabClick = (day: number) => {
    setActiveDay(day);
    setShowStats(false);
  };

  const renderTimelineGroup = (title: string, groupPoints: RoutePoint[], icon: string, color: string) => {
    if (groupPoints.length === 0) return null;

    return (
      <div className={styles.timeGroup}>
        <div className={styles.groupHeader}>
           <div className={styles.iconBox} style={{ color: color, background: `${color}15` }}>
              <i className={icon}></i>
           </div>
           <h3 className={styles.groupTitle}>{title}</h3>
           <span className={styles.countBadge}>{groupPoints.length} địa điểm</span>
        </div>
        
        <div className={styles.groupContent}>
          {groupPoints.map((point, idx) => {
            const globalIdx = points.findIndex(p => p.id === point.id) + 1;
            return (
              <React.Fragment key={point.id}>
                <PlaceCard 
                  point={point} 
                  index={globalIdx} 
                  isActive={activePointId === point.id}
                  onClick={() => onPointClick(point.id)}
                  onOpenNavigation={onOpenNavigation}
                />
                
                {idx < groupPoints.length - 1 && (
                  <div className={styles.transportInfo}>
                    <div className={styles.line}></div>
                    <div className={styles.transportCard}>
                      <i className="ph-fill ph-car-profile"></i>
                      {(() => {
                        const nextPoint = groupPoints[idx + 1];
                        const metric = metrics[`${point.id}-${nextPoint.id}`];
                        return metric ? (
                          <span className={styles.metricText}>
                            <b>{metric.distance} km</b> • {metric.duration} phút
                          </span>
                        ) : (
                          <span className={styles.calculating}>Đang tính toán...</span>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <aside className={styles.itinerarySidebar}>
      <div className={styles.itiSidebarHeader}>
        <div className={styles.topBar}>
           <div className={styles.locationTag}>
              <i className="ph-fill ph-map-pin"></i>
              <span>{planData?.destination || 'Việt Nam'}</span>
           </div>
           <div className={styles.dateTag}>
              <i className="ph-bold ph-calendar"></i>
              <span>{planData?.travelDate || 'Tháng 5, 2024'}</span>
           </div>
        </div>

        <h1 className={styles.itiMainTitle}>
          Lộ trình khám phá
        </h1>
        
        <div className={styles.itiDaysTabs}>
          <div className={styles.tabsTrack}>
            {(() => {
              const maxDay = points.length > 0 ? Math.max(...points.map(p => p.day || 1)) : 1;
              const tabs = [];
              for (let i = 1; i <= maxDay; i++) {
                tabs.push(
                  <button 
                    key={`day-${i}`}
                    className={`${styles.dayTab} ${!showStats && activeDay === i ? styles.active : ''}`}
                    onClick={() => handleTabClick(i)}
                  >
                    Ngày {i}
                  </button>
                );
              }
              return tabs;
            })()}
          </div>
          
          <button 
            className={`${styles.statsBtn} ${showStats ? styles.active : ''}`}
            onClick={() => setShowStats(true)}
          >
            <i className="ph-fill ph-money"></i>
          </button>
        </div>
      </div>

      <div className={styles.itiContentScrollable}>
        {!showStats ? (
          <div className={styles.itineraryTimeline} key={activeDay}>
            {renderTimelineGroup("Buổi sáng", morningPoints, "ph-fill ph-sun-horizon", "#0ea5e9")}
            {renderTimelineGroup("Buổi chiều & Tối", afternoonPoints, "ph-fill ph-moon-stars", "#8b5cf6")}
            
            {dailyPoints.length === 0 && (
              <div className={styles.emptyDay}>
                <div className={styles.emptyIcon}><i className="ph-bold ph-calendar-blank"></i></div>
                <p>Hôm nay chưa có lịch trình nào.</p>
                <span onClick={onOpenAddModal}>Thêm địa điểm ngay</span>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.statsBox} data-aos="zoom-in">
            <div className={styles.statsGlass}>
              <h3 className={styles.statsTitle}>Dự toán ngân sách</h3>
              <div className={styles.chartPlaceholder}>
                 <div className={styles.chartBar} style={{ height: '60%', background: '#33d7d1' }}></div>
                 <div className={styles.chartBar} style={{ height: '40%', background: '#0ea5e9' }}></div>
                 <div className={styles.chartBar} style={{ height: '80%', background: '#8b5cf6' }}></div>
              </div>
              <div className={styles.statsList}>
                <div className={styles.row}><span>🏠 Lưu trú</span><b>1,200,000₫</b></div>
                <div className={styles.row}><span>🍜 Ăn uống</span><b>850,000₫</b></div>
                <div className={styles.row}><span>🚗 Di chuyển</span><b>400,000₫</b></div>
                <div className={styles.divider}></div>
                <div className={styles.totalRow}><span>Tổng cộng</span><b>2,450,000₫</b></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={styles.footerActions}>
        <button 
          className={`${styles.btnPreview} ${isPreviewing ? styles.active : ''}`}
          onClick={onTogglePreview}
        >
          {isPreviewing ? <><i className="ph-bold ph-stop"></i> Dừng phát</> : <><i className="ph-fill ph-play-circle"></i> Xem trước</>}
        </button>
        
        <button className={styles.btnAdd} onClick={onOpenAddModal}>
          <i className="ph-bold ph-plus-circle"></i> Thêm mới
        </button>
      </div>
    </aside>
  );
};

export default ItinerarySidebar;