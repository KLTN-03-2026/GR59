import React, { useState, useEffect } from "react";
import styles from "./ProfileSidebar.module.scss";
import { 
  getFavorites, 
  removeFavorite, 
  type FavoriteItem 
} from "../../../../services/profileService";
import { useNavigate } from "react-router-dom";
import { Star, MapPin, Tag, Heart, Trash } from "@phosphor-icons/react";
import AddressDisplay from "../../../../components/Ui/AddressDisplay/AddressDisplay";
import { anhmatdinh } from "../../../../assets/images/img";
import { toast } from "react-toastify";
import ConfirmModal from "../../../../components/Ui/ConfirmModal/ConfirmModal";

const ProfileSidebar: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    item: FavoriteItem | null;
  }>({ isOpen: false, item: null });
  
  const navigate = useNavigate();

  const fetchFavorites = async () => {
    try {
      setIsLoading(true);
      const res = await getFavorites(0, 10);
      
      const rawData = res.data?.data as any;
      if (rawData) {
        if (rawData.content && Array.isArray(rawData.content)) {
          setFavorites(rawData.content);
        } else if (Array.isArray(rawData)) {
          setFavorites(rawData);
        }
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách yêu thích trong sidebar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemoveFavorite = (e: React.MouseEvent, item: FavoriteItem) => {
    e.stopPropagation();
    setDeleteModal({ isOpen: true, item });
  };

  const confirmDelete = async () => {
    if (!deleteModal.item) return;
    
    const item = deleteModal.item;
    const originalFavorites = [...favorites];
    
    // Đóng modal trước
    setDeleteModal({ isOpen: false, item: null });
    
    // Optimistic UI
    setFavorites(prev => prev.filter(f => f.id !== item.id));
    
    try {
      await removeFavorite(item.locationId, item.locationType);
      toast.info("Đã xóa khỏi danh sách yêu thích");
    } catch (error) {
      console.error("Lỗi khi xóa yêu thích:", error);
      toast.error("Không thể xóa yêu thích lúc này");
      setFavorites(originalFavorites);
    }
  };

  const displayedFavorites = isExpanded ? favorites : favorites.slice(0, 3);

  const handleNavigate = (item: FavoriteItem) => {
    const type = item.locationType.toLowerCase();
    navigate(`/${type}/${item.locationId}`);
  };

  const getLocationTypeLabel = (type: string) => {
    switch (type) {
      case "ATTRACTION": return "Địa điểm";
      case "HOTEL": return "Khách sạn";
      case "RESTAURANT": return "Nhà hàng";
      default: return "Khác";
    }
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <div className={styles.titleWrapper}>
            <Heart size={20} weight="fill" color="#33d7d1" />
            <span>Địa điểm yêu thích</span>
          </div>
          {favorites.length > 3 && (
            <button 
              className={styles.toggleBtn}
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Thu gọn" : "Xem tất cả"}
            </button>
          )}
        </div>

        <div className={styles.tripList}>
          {isLoading ? (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <span>Đang tải...</span>
            </div>
          ) : favorites.length > 0 ? (
            displayedFavorites.map((item) => (
              <div 
                key={item.id} 
                className={styles.tripItem} 
                onClick={() => handleNavigate(item)}
              >
                <div className={styles.imageWrapper}>
                  <img 
                    src={item.imageUrl || anhmatdinh} 
                    alt={item.locationName} 
                  />
                  <div className={styles.typeBadge}>
                    {getLocationTypeLabel(item.locationType)}
                  </div>
                </div>

                <div className={styles.tripInfo}>
                  <div className={styles.titleRow}>
                    <h4 className={styles.tripTitle}>{item.locationName}</h4>
                    <button 
                      className={styles.deleteBtn}
                      onClick={(e) => handleRemoveFavorite(e, item)}
                      title="Xóa khỏi yêu thích"
                    >
                      <Trash size={16} weight="bold" />
                    </button>
                  </div>
                  
                  <div className={styles.metaRow}>
                    <div className={styles.rating}>
                      <Star size={14} weight="fill" />
                      <span>{item.rating?.toFixed(1) || "0.0"}</span>
                    </div>
                    <div className={styles.separator}>•</div>
                    <div className={styles.type}>
                      <Tag size={12} weight="bold" />
                      <span>{getLocationTypeLabel(item.locationType)}</span>
                    </div>
                  </div>

                  <div className={styles.address}>
                    <MapPin size={12} weight="bold" />
                    <span className={styles.addressText}>
                      <AddressDisplay address={item.address} />
                    </span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.empty}>
              <Heart size={32} weight="thin" />
              <p>Chưa có địa điểm yêu thích nào.</p>
            </div>
          )}
        </div>
      </div>

      <div className={styles.referral}>
        <div className={styles.referralIcon}>
          <i className="ph-fill ph-gift"></i>
        </div>
        <h4>Mời bạn bè</h4>
        <p>Nhận ngay <strong>100 điểm</strong> MyPoints khi bạn bè đăng ký qua liên kết của bạn.</p>
        <button className={styles.copyBtn}>
          <i className="ph-bold ph-copy"></i>
          Sao chép liên kết
        </button>
      </div>

      <ConfirmModal 
        isOpen={deleteModal.isOpen}
        message={`Bạn có chắc chắn muốn xóa "${deleteModal.item?.locationName}" khỏi danh sách yêu thích?`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, item: null })}
      />
    </div>
  );
};

export default ProfileSidebar;
