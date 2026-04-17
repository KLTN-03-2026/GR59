import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './PlaceDetailPanel.module.scss';
import { 
  X, 
  MapPin, 
  Clock, 
  Star, 
  ArrowRight, 
  SpeakerHigh, 
  Bookmark, 
  ShareNetwork,
  Info
} from '@phosphor-icons/react';
import type { RoutePoint } from '../../ItineraryDetail';

interface Props {
  pointId: string | null;
  points: RoutePoint[];
  onClose: () => void;
  onOpenNavigation: (lat: number, lng: number, name: string) => void;
}

const PlaceDetailPanel: React.FC<Props> = ({ pointId, points, onClose, onOpenNavigation }) => {
  const [point, setPoint] = useState<RoutePoint | null>(null);
  const [wikiData, setWikiData] = useState<{ title: string; desc: string; image: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (pointId) {
      const found = points.find(p => p.id === pointId);
      setPoint(found || null);
    } else {
      setPoint(null);
    }
  }, [pointId, points]);

  useEffect(() => {
    if (!point) return;

    const fetchWiki = async () => {
      setIsLoading(true);
      try {
        const searchRes = await axios.get(`https://vi.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(point.name)}&utf8=&format=json&origin=*`);
        
        if (searchRes.data.query.search.length > 0) {
          const title = searchRes.data.query.search[0].title;
          const res = await axios.get(`https://vi.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
          
          if (res.data && res.data.extract) {
            setWikiData({
              title: res.data.title,
              desc: res.data.extract,
              image: res.data.thumbnail?.source || point.imageUrl || ''
            });
            setIsLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error("Wikipedia API error", err);
      }
      
      setWikiData({
        title: point.name,
        desc: point.description || 'Không có mô tả chi tiết cho địa điểm này.',
        image: point.imageUrl || ''
      });
      setIsLoading(false);
    };

    fetchWiki();
  }, [point]);

  const handleTTS = () => {
    if (!wikiData?.desc) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(wikiData.desc);
      utterance.lang = 'vi-VN';
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const handleOpenNavigation = () => {
    if (!point) return;
    onOpenNavigation(point.lat, point.lng, point.name);
  };

  if (!pointId || !point) return null;

  return (
    <div className={`${styles.panelContainer} ${pointId ? styles.isOpen : ''}`}>
      <div className={styles.header}>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={24} weight="bold" />
        </button>
        <div className={styles.headerActions}>
           <button><Bookmark size={20} /></button>
           <button><ShareNetwork size={20} /></button>
        </div>
      </div>

      <div className={styles.contentScroll}>
        <div className={styles.heroImage} style={{ backgroundImage: `url(${wikiData?.image || point.imageUrl})` }}>
           <div className={styles.heroOverlay}>
              <span className={styles.typeBadge}>{point.type}</span>
           </div>
        </div>

        <div className={styles.mainInfo}>
          <h2 className={styles.title}>{point.name}</h2>
          <div className={styles.ratingRow}>
            <div className={styles.stars}>
              {[1,2,3,4,5].map(s => <Star key={s} size={16} weight="fill" color="#facc15" />)}
              <span>4.8 (1.2k đánh giá)</span>
            </div>
          </div>

          <div className={styles.quickSpecs}>
             <div className={styles.spec}>
                <Clock size={20} weight="fill" color="#33d7d1" />
                <div>
                   <p>Thời gian tới</p>
                   <b>{point.time}</b>
                </div>
             </div>
             <div className={styles.spec}>
                <MapPin size={20} weight="fill" color="#ef4444" />
                <div>
                   <p>Vị trí</p>
                   <b>Quận 1, TP. HCM</b>
                </div>
             </div>
          </div>

          <div className={styles.actionGrid}>
             <button className={styles.primaryAction} onClick={handleOpenNavigation}>
                <ArrowRight size={20} weight="bold" />
                Chỉ đường
             </button>
             <button className={`${styles.secondaryAction} ${isSpeaking ? styles.speaking : ''}`} onClick={handleTTS}>
                <SpeakerHigh size={20} weight="fill" />
                {isSpeaking ? 'Đang đọc...' : 'Nghe miêu tả'}
             </button>
          </div>

          <div className={styles.descriptionSection}>
             <div className={styles.sectionTitle}>
                <Info size={20} weight="bold" />
                <h3>Thông tin chi tiết</h3>
             </div>
             {isLoading ? (
                <div className={styles.loader}>
                   <div className={styles.line}></div>
                   <div className={styles.line}></div>
                   <div className={styles.line}></div>
                </div>
             ) : (
                <p className={styles.descText}>{wikiData?.desc}</p>
             )}
          </div>
          
          <div className={styles.photoGallery}>
             <h3>Hình ảnh thực tế</h3>
             <div className={styles.photoGrid}>
                <div className={styles.photoItem} style={{backgroundImage: `url(${point.imageUrl})`}}></div>
                <div className={styles.photoItem} style={{backgroundImage: `url(https://images.unsplash.com/photo-1555412654-72a95a495858?q=80&w=200&auto=format&fit=crop)`}}></div>
                <div className={styles.photoItem} style={{backgroundImage: `url(https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?q=80&w=200&auto=format&fit=crop)`}}></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetailPanel;
