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
}

const ItinerarySidebar: React.FC<Props> = ({
  points,
  activePointId,
  onPointClick,
  isPreviewing,
  onTogglePreview,
  onOpenAddModal,
  planData,
  metrics = {}
}) => {
  const [activeTab, setActiveTab] = useState<'day1' | 'day2' | 'day3' | 'stats'>('day1');
  const [placeInfo, setPlaceInfo] = useState<{ title: string; desc: string; image: string } | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingInfo, setIsLoadingInfo] = useState(false);

  // Fetch Wikipedia data when activePointId changes
  useEffect(() => {
    if (!activePointId) {
      setPlaceInfo(null);
      return;
    }

    const point = points.find(p => p.id === activePointId);
    if (!point || point.name.toLowerCase() === 'khách sạn') {
      setPlaceInfo(null);
      return;
    }

    const fetchWiki = async () => {
      setIsLoadingInfo(true);
      try {
        const searchRes = await axios.get(`https://vi.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(point.name)}&utf8=&format=json&origin=*`);
        
        if (searchRes.data.query.search.length > 0) {
          const title = searchRes.data.query.search[0].title;
          const res = await axios.get(`https://vi.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
          
          if (res.data && res.data.extract) {
            setPlaceInfo({
              title: res.data.title,
              desc: res.data.extract,
              image: res.data.thumbnail?.source || point.imageUrl || ''
            });
            return;
          }
        }
      } catch (err) {
        console.error("Wikipedia API fall back to local description", err);
      } finally {
        setIsLoadingInfo(false);
      }
      
      setPlaceInfo({
        title: point.name,
        desc: point.description || 'Một địa điểm tuyệt vời trong chuyến hành trình của bạn.',
        image: point.imageUrl || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=400&fit=crop'
      });
    };

    fetchWiki();
  }, [activePointId, points]);

  // Handle Text-to-Speech
  const handleTTS = () => {
    if (!placeInfo?.desc) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(placeInfo.desc);
      utterance.lang = 'vi-VN';
      utterance.volume = 1;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  // Cleanup TTS on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  // Lấy số ngày hiện tại từ activeTab (vắt từ "day1", "day2"...)
  const currentDay = activeTab.startsWith('day') ? parseInt(activeTab.replace('day', ''), 10) : 1;

  // Lọc points theo ngày đang chọn
  const dailyPoints = points.filter(p => (p.day || 1) === currentDay);

  // Split daily points into morning and afternoon
  const morningPoints = dailyPoints.filter(p => {
    const hours = parseInt(p.time.split(':')[0], 10);
    return hours < 12;
  });

  const afternoonPoints = dailyPoints.filter(p => {
    const hours = parseInt(p.time.split(':')[0], 10);
    return hours >= 12;
  });

  const renderTimelineGroup = (title: string, groupPoints: RoutePoint[], icon: string, bgClass: string, textClass: string) => {
    if (groupPoints.length === 0) return null;

    return (
      <div className={styles.timeGroup}>
        <div className={styles.timeGroupIcon} style={{ background: bgClass, color: textClass }}>
          <i className={icon}></i>
        </div>
        <h3 className={styles.groupTitle}>{title}</h3>
        
        {groupPoints.map((point, idx) => {
          const globalIdx = points.findIndex(p => p.id === point.id) + 1;
          
          return (
            <React.Fragment key={point.id}>
              <PlaceCard 
                point={point} 
                index={globalIdx} 
                isActive={activePointId === point.id}
                onClick={() => onPointClick(point.id)}
              />
              
              {idx < groupPoints.length - 1 && (
                <div className={styles.transportInfo}>
                  <div className={styles.transportLine}></div>
                  <div className={styles.transportBadge}>
                    <i className="ph-fill ph-car-profile"></i>
                    {(() => {
                      const nextPoint = groupPoints[idx + 1];
                      const metric = metrics[`${point.id}-${nextPoint.id}`];
                      if (metric) {
                        return <span>{metric.distance} km • {metric.duration} phút</span>;
                      }
                      return <span className={styles.loadingPulse}>Đang tính...</span>;
                    })()}
                  </div>
                  <div className={styles.transportLine}></div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  return (
    <aside className={styles.itinerarySidebar}>
      <div className={styles.itiSidebarHeader}>
        <div className={styles.itiTitleRow}>
          <h1 className={styles.itiMainTitle}>
            {planData ? `Lộ trình tại ${planData.destination}` : 'Lịch trình chi tiết'}
          </h1>
        </div>
        <p className={styles.itiDescription}>
          {planData 
            ? `Dành cho nhóm ${planData.peopleGroup} người với phong cách ${planData.interests.join(', ')}.`
            : 'Theo dõi các địa điểm tham quan theo từng ngày và dễ dàng quản lý chuyến đi của bạn.'}
        </p>
      </div>

      <div className={styles.itiContentScrollable}>
        <div className={styles.itiDaysTabs}>
          {/* Tự động sinh Tab dựa trên số ngày thực tế từ Backend/Dữ liệu */}
          {(() => {
            const maxDay = points.length > 0 ? Math.max(...points.map(p => p.day || 1)) : 1;
            const tabs = [];
            for (let i = 1; i <= maxDay; i++) {
              tabs.push(
                <button 
                  key={`day-${i}`}
                  className={`${styles.dayTab} ${activeTab === `day${i}` ? styles.active : ''}`}
                  onClick={() => setActiveTab(`day${i}` as any)}
                >
                  Ngày {i}
                </button>
              );
            }
            return tabs;
          })()}
          
          <button 
            className={`${styles.dayTab} ${activeTab === 'stats' ? styles.active : ''} ${styles.tabStats}`}
            onClick={() => setActiveTab('stats')}
          >
            <i className="ph-bold ph-chart-pie-slice"></i> Chi phí
          </button>
        </div>

        {isLoadingInfo && (
           <div className={styles.loadingInfo}>Đang tải thông tin địa điểm...</div>
        )}
        {!isLoadingInfo && placeInfo && activeTab !== 'stats' && (
          <div className={styles.wikiInfoBox}>
            {placeInfo.image && (
              <div className={styles.wikiImage} style={{ backgroundImage: `url(${placeInfo.image})` }}></div>
            )}
            <div className={styles.wikiContent}>
              <h3 className={styles.wikiTitle}>{placeInfo.title}</h3>
              <p className={styles.wikiDesc}>
                {placeInfo.desc.substring(0, 150)}...
              </p>
              <button 
                onClick={handleTTS}
                className={`${styles.btnTTS} ${isSpeaking ? styles.speaking : styles.idle}`}
              >
                {isSpeaking ? (
                  <><i className="ph-fill ph-speaker-high"></i> Đang đọc âm thanh...</>
                ) : (
                  <><i className="ph-fill ph-play-circle"></i> Truyền tải âm thanh (Voice)</>
                )}
              </button>
            </div>
          </div>
        )}

        {activeTab !== 'stats' ? (
          <div className={`${styles.itineraryTimeline} ${styles.fadeIn}`} key={activeTab}>
            {renderTimelineGroup("BUỔI SÁNG", morningPoints, "ph-fill ph-sun", "#e0f2fe", "#0ea5e9")}
            {renderTimelineGroup("BUỔI CHIỀU", afternoonPoints, "ph-fill ph-cloud-sun", "#fff7ed", "#f97316")}
            {dailyPoints.length === 0 && (
              <div className={styles.emptyDay}>
                <i className="ph-bold ph-calendar-blank"></i>
                <p>Chưa có địa điểm nào cho ngày này.</p>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.statsBox}>
            <h3 className={styles.statsTitle}>
              <i className="ph-fill ph-money"></i> Dự toán chi phí
            </h3>
            <div className={styles.statsRow}>
              <span className={styles.statsLabel}>Khách sạn</span>
              <span className={styles.statsValue}>1,200,000 ₫</span>
            </div>
            <div className={styles.statsRow}>
              <span className={styles.statsLabel}>Ăn uống</span>
              <span className={styles.statsValue}>800,000 ₫</span>
            </div>
            <div className={styles.statsRow}>
              <span className={styles.statsLabel}>Di chuyển</span>
              <span className={styles.statsValue}>300,000 ₫</span>
            </div>
            <div className={styles.statsTotalRow}>
              <span className={styles.statsTotalLabel}>Tổng cộng</span>
              <span className={styles.statsTotalValue}>2,300,000 ₫</span>
            </div>
          </div>
        )}

        <div className={styles.footerActions}>
          <button 
            className={`${styles.btnItiPreview} ${isPreviewing ? styles.btnItiPreviewActive : ''}`}
            onClick={onTogglePreview}
          >
            {isPreviewing ? <><i className="ph-bold ph-stop-circle"></i> Dừng</> : <><i className="ph-fill ph-play-circle"></i> Xem trước</>}
          </button>
          
          <button 
            className={styles.btnAddSpot}
            onClick={onOpenAddModal}
          >
            <i className="ph-bold ph-plus"></i> Thêm địa điểm
          </button>
        </div>
      </div>
    </aside>
  );
};

export default ItinerarySidebar;