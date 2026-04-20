import React, { useEffect, useState } from 'react';
import styles from './UserReviews.module.scss';
import { getUserReviews, updateReview } from '../../../../services/reviewService';
import { Star, PencilSimple, Trash, Image as ImageIcon, Camera, X, ChatCircleText, CalendarBlank, MapPin, Buildings, ForkKnife, Globe, MapTrifold } from '@phosphor-icons/react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

const UserReviews: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState<any | null>(null);
  const [editRating, setEditRating] = useState(0);
  const [editComment, setEditComment] = useState('');
  const [editFiles, setEditFiles] = useState<File[]>([]);
  const [editPreviews, setEditPreviews] = useState<string[]>([]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem("user");
      let userId = undefined;
      if (userStr) {
        userId = JSON.parse(userStr).id;
      }
      const res = await getUserReviews(userId);
      if (res.data && (res.data.status === 200 || res.data.status === 201)) {
        const rawData = res.data.data;
        // Kiểm tra xem dữ liệu trả về là mảng trực tiếp hay object có content (phân trang)
        if (Array.isArray(rawData)) {
          setReviews(rawData);
        } else if (rawData && typeof rawData === 'object' && Array.isArray((rawData as any).content)) {
          setReviews((rawData as any).content);
        } else {
          setReviews([]);
        }
      }
    } catch (error) {
      console.error('Lỗi khi tải đánh giá của bạn:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleStartEdit = (review: any) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment);
    setEditFiles([]);
    setEditPreviews([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      setEditFiles(prev => [...prev, ...files]);
      const newPreviews = files.map(file => URL.createObjectURL(file));
      setEditPreviews(prev => [...prev, ...newPreviews]);
    }
  };

  const removeEditImage = (index: number) => {
    setEditFiles(prev => prev.filter((_, i) => i !== index));
    setEditPreviews(prev => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleUpdate = async () => {
    if (!editingReview) return;
    try {
      // Chỉ gửi rating và comment theo yêu cầu mới của BE
      const payload = {
        rating: editRating,
        comment: editComment
      };
      
      const res = await updateReview(editingReview.id, payload, editFiles);
      if (res.data && (res.data.status === 200 || res.data.status === 201)) {
        toast.success('Cập nhật đánh giá thành công!');
        setEditingReview(null);
        setEditFiles([]);
        setEditPreviews([]);
        fetchReviews();
      }
    } catch (error) {
      toast.error('Cập nhật thất bại, vui lòng thử lại.');
    }
  };

  const getCategoryTag = (type: string) => {
    switch (type) {
      case 'HOTEL': return { label: 'Khách sạn', icon: <Buildings />, color: '#3b82f6', bg: '#eff6ff' };
      case 'RESTAURANT': return { label: 'Nhà hàng', icon: <ForkKnife />, color: '#ef4444', bg: '#fef2f2' };
      case 'ATTRACTION': return { label: 'Địa điểm', icon: <MapPin />, color: '#10b981', bg: '#ecfdf5' };
      case 'WEBSITE': return { label: 'Website', icon: <Globe />, color: '#8b5cf6', bg: '#f5f3ff' };
      case 'TRIP': return { label: 'Chuyến đi', icon: <MapTrifold />, color: '#f59e0b', bg: '#fffbeb' };
      default: return { label: 'Đánh giá', icon: <ChatCircleText />, color: '#64748b', bg: '#f8fafc' };
    }
  };

  if (loading) return (
    <div className={styles.loadingState}>
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className={styles.spinner}
      />
      <p>Đang tải đánh giá của bạn...</p>
    </div>
  );

  return (
    <div className={styles.userReviewsContainer}>
      <div className={styles.header}>
        <div className={styles.titleInfo}>
          <h2>Lịch sử đóng góp</h2>
          <p>Bạn đã chia sẻ {reviews.length} đánh giá với cộng đồng</p>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {editingReview && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={styles.editSection}
          >
            <div className={styles.editHeader}>
              <div className={styles.editTitle}>
                <PencilSimple size={20} weight="bold" />
                <h3>Chỉnh sửa đánh giá</h3>
              </div>
              <button className={styles.btnClose} onClick={() => setEditingReview(null)}>
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.editBody}>
              <div className={styles.ratingField}>
                <span>Chất lượng dịch vụ:</span>
                <div className={styles.ratingStars}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={32}
                      weight={star <= editRating ? "fill" : "regular"}
                      color={star <= editRating ? "#f59e0b" : "#cbd5e1"}
                      onClick={() => setEditRating(star)}
                      className={styles.starIcon}
                    />
                  ))}
                </div>
              </div>

              <div className={styles.textField}>
                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  placeholder="Chia sẻ thêm về trải nghiệm của bạn..."
                />
              </div>

              <div className={styles.uploadField}>
                <label className={styles.uploadTrigger}>
                  <Camera size={22} weight="bold" />
                  <div className={styles.uploadText}>
                    <strong>Thêm ảnh mới</strong>
                    <span>Tải lên hình ảnh thực tế</span>
                  </div>
                  <input type="file" hidden multiple accept="image/*" onChange={handleEditFileChange} />
                </label>
                
                {editPreviews.length > 0 && (
                  <div className={styles.previewScroll}>
                    {editPreviews.map((url, idx) => (
                      <div key={idx} className={styles.previewItem}>
                        <img src={url} alt="" />
                        <button onClick={() => removeEditImage(idx)} className={styles.btnRemoveImg}>
                          <X size={12} weight="bold" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className={styles.editFooter}>
              <button className={styles.btnCancel} onClick={() => setEditingReview(null)}>Hủy bỏ</button>
              <button className={styles.btnSave} onClick={handleUpdate}>Cập nhật ngay</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        layout
        className={styles.reviewsGrid}
      >
        {reviews.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={styles.emptyContainer}
          >
            <ChatCircleText size={64} weight="thin" color="#cbd5e1" />
            <p>Bạn chưa có đánh giá nào trên hệ thống.</p>
            <button className={styles.btnExplore}>Khám phá ngay</button>
          </motion.div>
        ) : (
          reviews.map((rev, index) => {
            const tag = getCategoryTag(rev.type);
            return (
              <motion.div 
                key={rev.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={styles.reviewCard}
              >
                <div className={styles.serviceTag}>
                  <span className={styles.serviceName}>{rev.nameService || "Travel AI Service"}</span>
                  {rev.provinceName && (
                    <span className={styles.location}>
                      <MapPin size={10} weight="fill" />
                      {rev.provinceName}
                    </span>
                  )}
                </div>
                <div className={styles.cardHeader}>
                  <div className={styles.categoryBadge} style={{ color: tag.color, backgroundColor: tag.bg }}>
                    {tag.icon}
                    <span>{tag.label}</span>
                  </div>
                  <div className={styles.dateInfo}>
                    <CalendarBlank size={14} />
                    <span>{new Date(rev.createdAt).toLocaleDateString('vi-VN')}</span>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <div className={styles.ratingRow}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} size={16} weight={i < rev.rating ? "fill" : "regular"} color={i < rev.rating ? "#f59e0b" : "#e2e8f0"} />
                    ))}
                    <span className={styles.ratingText}>{rev.rating}/5</span>
                  </div>
                  
                  <p className={styles.commentContent}>{rev.comment}</p>

                  {rev.images && rev.images.length > 0 && (
                    <div className={styles.imageGallery}>
                      {rev.images.map((img: string, i: number) => (
                        <div key={i} className={styles.imgWrapper}>
                          <img src={img} alt="User review" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.cardFooter}>
                  <button className={styles.btnEdit} onClick={() => handleStartEdit(rev)}>
                    <PencilSimple size={18} weight="bold" />
                    <span>Chỉnh sửa</span>
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </motion.div>
    </div>
  );
};

export default UserReviews;
