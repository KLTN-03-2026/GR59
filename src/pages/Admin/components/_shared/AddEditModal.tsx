import React, { useState, useEffect, useRef } from 'react';
import styles from './AddEditModal.module.scss';
import { X, Plus, Trash, Image as ImageIcon, Info, MapTrifold, Cloud, Lightbulb, ListChecks, Airplane, Video, UploadSimple, CircleNotch } from "@phosphor-icons/react";
import { uploadAdminImage } from '../../../../services/adminService';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

interface AddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  title: string;
  type: 'destination' | 'hotel' | 'restaurant';
  initialData?: any;
}

const AddEditModal: React.FC<AddEditModalProps> = ({ isOpen, onClose, onSave, title, type, initialData }) => {
  const [formData, setFormData] = useState<any>({});
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        mapCoordinates: initialData.mapCoordinates || initialData.coordinates || { lat: 21.0285, lng: 105.8542 }
      });
    } else {
      const baseData = {
        status: type === 'restaurant' ? 'ĐANG MỞ' : 'HOẠT ĐỘNG',
        rating: 5,
        reviews: '0',
        gallery: [],
        description: '',
        previewVideo: '',
      };

      if (type === 'destination') {
        setFormData({
          ...baseData,
          title: '',
          location: '',
          img: '', 
          distance: '',
          price: '',
          time: '',
          category: 'popular',
          travelTimeFromHanoi: '',
          mapScreenshot: '',
          mapCoordinates: { lat: 21.0285, lng: 105.8542 },
          weatherCurrent: { temp: 25, description: 'Trời quang đãng', icon: 'Sun' },
          travelTips: [{ icon: 'Lightbulb', title: 'Mẹo nhỏ', content: 'Hãy chuẩn bị kỹ trước khi đi.' }],
          quickInfo: [{ id: Date.now(), label: 'Thông tin', value: 'Giá trị' }],
          services: [],
          features: []
        });
      } else if (type === 'hotel') {
        setFormData({
          ...baseData,
          name: '',
          location: '',
          imageUrl: '',
          category: 'LUXURY',
          averagePrice: 0,
          estimatedDuration: 1200,
          provinceId: 1,
          status: 'ACTIVE',
          rating: 4.5,
          reviewCount: 100,
          gallery: []
        });
      } else {
        setFormData({
          ...baseData,
          name: '',
          location: '',
          image: '',
          cuisine: 'VIỆT NAM',
          priceRange: '',
          features: []
        });
      }
    }
  }, [initialData, type, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    const newArray = [...(formData[field] || [])];
    newArray[index] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const handleNestedArrayChange = (field: string, index: number, subfield: string, value: any) => {
    const newArray = [...(formData[field] || [])];
    newArray[index] = { ...newArray[index], [subfield]: value };
    setFormData((prev: any) => ({ ...prev, [field]: newArray }));
  };

  const addArrayItem = (field: string, defaultValue: any = '') => {
    setFormData((prev: any) => ({ ...prev, [field]: [...(formData[field] || []), defaultValue] }));
  };

  const removeArrayItem = (field: string, index: number) => {
    const newArray = [...(formData[field] || [])];
    newArray.splice(index, 1);
    setFormData((prev: any) => ({ ...prev, [field]: newArray }));
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, field: 'main' | 'gallery') => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    try {
      setIsUploading(true);
      
      const uploadPromises = Array.from(files).map(file => uploadAdminImage(file));
      const results = await Promise.all(uploadPromises);
      
      const newUrls = results
        .filter(res => res.data && res.data.status === 200 && res.data.data?.imageUrl)
        .map(res => res.data.data!.imageUrl);

      if (newUrls.length > 0) {
        if (field === 'main') {
          const mainField = type === 'destination' ? 'img' : (type === 'hotel' ? 'imageUrl' : 'image');
          setFormData((prev: any) => ({ ...prev, [mainField]: newUrls[0] }));
          toast.success('Đã tải ảnh chính lên!');
        } else {
          setFormData((prev: any) => ({ ...prev, gallery: [...(prev.gallery || []), ...newUrls] }));
          toast.success(`Đã tải ${newUrls.length} ảnh vào thư viện!`);
        }
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Tải ảnh lên thất bại!');
    } finally {
      setIsUploading(false);
      if (event.target) event.target.value = '';
    }
  };

  const handleSaveInternal = () => {
    const finalData = { ...formData };
    
    if (type === 'hotel') {
      // Ép kiểu số cho Hotel để khớp Backend API
      finalData.rating = parseFloat(finalData.rating) || 0;
      finalData.reviewCount = parseInt(finalData.reviewCount) || 0;
      finalData.averagePrice = parseInt(finalData.averagePrice) || 0;
      finalData.estimatedDuration = parseInt(finalData.estimatedDuration) || 0;
      finalData.provinceId = parseInt(finalData.provinceId) || 1;
      
      // Xóa trường redundant nếu có
      delete finalData.reviews;
    }

    if (type === 'destination') {
      if (!finalData.img && finalData.heroImage) finalData.img = finalData.heroImage;
      delete finalData.heroImage;
      
      if (!finalData.mapCoordinates && finalData.coordinates) finalData.mapCoordinates = finalData.coordinates;
      delete finalData.coordinates;
    }

    onSave(finalData);
  };

  if (!isOpen) return null;

  const mainImageUrl = type === 'destination' ? (formData.img || formData.heroImage) : formData.image;

  return (
    <AnimatePresence>
      <div className={styles.overlay} onClick={onClose}>
        <motion.div 
          className={styles.modal} 
          onClick={e => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className={styles.header}>
            <h3>{title}</h3>
            <button className={styles.closeBtn} onClick={onClose}><X size={20} weight="bold" /></button>
          </div>

          <div className={styles.body}>
            <div className={styles.formGrid}>
              <div className={styles.sectionTitle}><Info size={18} weight="fill" /> Thông tin cơ bản</div>
              
              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label>Tên / Tiêu đề chính</label>
                <input 
                  type="text" 
                  name={type === 'destination' ? 'title' : 'name'} 
                  value={(type === 'destination' ? formData.title : formData.name) || ''} 
                  onChange={handleChange}
                  placeholder="Nhập tên chính thức tại đây..."
                  style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0EA5E9' }}
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Địa điểm / Vị trí</label>
                <input 
                  type="text" 
                  name="location" 
                  value={formData.location || ''} 
                  onChange={handleChange}
                  placeholder="Ví dụ: Quận 1, TP. Hồ Chí Minh"
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Xếp hạng (1-5)</label>
                <input type="number" step="0.1" min="0" max="5" name="rating" value={formData.rating || ''} onChange={handleChange} />
              </div>

              <div className={styles.inputGroup}>
                <label>Lượt đánh giá</label>
                <input 
                  type="number" 
                  name={type === 'hotel' ? 'reviewCount' : 'reviews'} 
                  value={(type === 'hotel' ? formData.reviewCount : formData.reviews) || ''} 
                  onChange={handleChange} 
                  placeholder="Ví dụ: 850" 
                />
              </div>

              <div className={styles.inputGroup}>
                <label>Trạng thái</label>
                <select name="status" value={formData.status || ''} onChange={handleChange}>
                  {type === 'restaurant' ? (
                    <>
                      <option value="ĐANG MỞ">Đang mở</option>
                      <option value="TẠM ĐÓNG">Tạm đóng</option>
                    </>
                  ) : type === 'hotel' ? (
                    <>
                      <option value="ACTIVE">Hoạt động (Active)</option>
                      <option value="MAINTENANCE">Bảo trì (Maintenance)</option>
                      <option value="CLOSED">Đóng cửa (Closed)</option>
                    </>
                  ) : (
                    <>
                      <option value="HOẠT ĐỘNG">Hoạt động</option>
                      <option value="BẢO TRÌ">Bảo trì</option>
                      <option value="ĐÓNG CỬA">Đóng cửa</option>
                    </>
                  )}
                </select>
              </div>

              {type === 'destination' && (
                <>
                  <div className={styles.inputGroup}>
                    <label>Danh mục</label>
                    <select name="category" value={formData.category} onChange={handleChange}>
                      <option value="culture">Văn hóa (Culture)</option>
                      <option value="nature">Thiên nhiên (Nature)</option>
                      <option value="beach">Biển đảo (Beach)</option>
                      <option value="popular">Phổ biến (Popular)</option>
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Khoảng giá</label>
                    <input type="text" name="price" value={formData.price || ''} onChange={handleChange} placeholder="Ví dụ: 1.5tr - 5tr VNĐ" />
                  </div>
                </>
              )}

              {type === 'hotel' && (
                <>
                  <div className={styles.inputGroup}>
                    <label>Hạng mục (Category)</label>
                    <select name="category" value={formData.category || ''} onChange={handleChange}>
                      <option value="LUXURY">Luxury (Hạng sang)</option>
                      <option value="RESORT">Resort (Nghỉ dưỡng)</option>
                      <option value="BOUTIQUE">Boutique (Độc đáo)</option>
                      <option value="BUDGET">Budget (Bình dân)</option>
                      <option value="BUSINESS">Business (Công tác)</option>
                      <option value="HOMESTAY">Homestay</option>
                      <option value="VILLA">Villa (Biệt thự)</option>
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Giá trung bình (VNĐ)</label>
                    <input type="number" name="averagePrice" value={formData.averagePrice || 0} onChange={handleChange} placeholder="Ví dụ: 5500000" />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Thời gian ước tính (phút)</label>
                    <input type="number" name="estimatedDuration" value={formData.estimatedDuration || 1200} onChange={handleChange} />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Mã tỉnh thành (Province ID)</label>
                    <select name="provinceId" value={String(formData.provinceId || 1)} onChange={handleChange}>
                      <option value="1">1 - Huế</option>
                      <option value="2">2 - Đà Nẵng</option>
                      <option value="3">3 - Quảng Nam</option>
                      <option value="4">4 - Hà Nội</option>
                      <option value="5">5 - TP.HCM</option>
                    </select>
                  </div>
                </>
              )}

              {type === 'restaurant' && (
                <>
                  <div className={styles.inputGroup}>
                    <label>Ẩm thực</label>
                    <select name="cuisine" value={formData.cuisine} onChange={handleChange}>
                      <option value="VIỆT NAM">Việt Nam</option>
                      <option value="CHÂU Á">Châu Á</option>
                      <option value="CHÂU ÂU">Châu Âu</option>
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Khoảng giá</label>
                    <input type="text" name="priceRange" value={formData.priceRange || ''} onChange={handleChange} placeholder="Ví dụ: 500k - 2tr VNĐ" />
                  </div>
                </>
              )}

              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <label>Mô tả chi tiết</label>
                <textarea name="description" value={formData.description || ''} onChange={handleChange} placeholder="Nhập mô tả chi tiết cho đối tượng này..."></textarea>
              </div>

              {/* Media Section */}
              <div className={styles.sectionTitle}><ImageIcon size={18} weight="fill" /> Hình ảnh & Media</div>
              
              <div className={styles.inputGroup}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <label style={{ margin: 0 }}>Hình ảnh chính (URL hoặc Tải lên)</label>
                  <button 
                    type="button" 
                    className={styles.uploadBtnSmall} 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    {isUploading ? <CircleNotch size={14} className="ph-spin" /> : <UploadSimple size={14} />}
                    <span>Tải ảnh</span>
                  </button>
                </div>
                <input 
                  type="text" 
                  name={type === 'destination' ? 'img' : (type === 'hotel' ? 'imageUrl' : 'image')} 
                  value={(type === 'destination' ? formData.img : (type === 'hotel' ? formData.imageUrl : formData.image)) || ''} 
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                />
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  hidden 
                  accept="image/*" 
                  onChange={(e) => handleFileUpload(e, 'main')} 
                />
                <div className={styles.imagePreview}>
                  {mainImageUrl ? (
                    <img src={mainImageUrl} alt="Main preview" />
                  ) : (
                    <div className={styles.noImage}>
                      <ImageIcon size={32} weight="thin" />
                      <span>Chưa có ảnh</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label><Video size={16} weight="fill" /> Video giới thiệu (URL)</label>
                <input 
                  type="text" 
                  name="previewVideo" 
                  value={formData.previewVideo || ''} 
                  onChange={handleChange} 
                  placeholder="https://youtube.com/..." 
                />
                {type === 'destination' && (
                  <div style={{ marginTop: '24px' }}>
                    <label>Map Screenshot (URL)</label>
                    <input type="text" name="mapScreenshot" value={formData.mapScreenshot || ''} onChange={handleChange} placeholder="URL ảnh bản đồ" />
                  </div>
                )}
              </div>

              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ margin: 0 }}>Thư viện ảnh khách sạn (Gallery)</label>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>({formData.gallery?.length || 0} ảnh)</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      type="button" 
                      className={styles.addBtn} 
                      onClick={() => galleryInputRef.current?.click()}
                      style={{ padding: '8px 16px', background: '#f0f9ff', color: '#0ea5e9' }}
                      disabled={isUploading}
                    >
                      {isUploading ? <CircleNotch size={14} className="ph-spin" /> : <UploadSimple size={14} weight="bold" />} Tải từ máy tính
                    </button>
                    <button type="button" className={styles.addBtn} onClick={() => addArrayItem('gallery')} style={{ padding: '8px 16px', border: '1px solid #e2e8f0', color: '#64748b' }}>
                      <Plus size={14} weight="bold" /> Thêm đường dẫn
                    </button>
                  </div>
                </div>
                <input 
                  type="file" 
                  ref={galleryInputRef} 
                  hidden 
                  multiple 
                  accept="image/*" 
                  onChange={(e) => handleFileUpload(e, 'gallery')} 
                />
                
                <div className={styles.galleryManageList}>
                  {formData.gallery?.map((url: string, index: number) => (
                    <div key={index} className={styles.galleryInputRow} style={{ display: 'flex', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
                      <div className={styles.miniPreview} style={{ width: '48px', height: '48px', borderRadius: '8px', overflow: 'hidden', background: '#f1f5f9', flexShrink: 0 }}>
                        {url ? <img src={url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <ImageIcon size={20} weight="thin" style={{ margin: '14px' }} />}
                      </div>
                      <input 
                        type="text" 
                        value={url} 
                        onChange={(e) => handleArrayChange('gallery', index, e.target.value)}
                        placeholder="Dán URL hình ảnh từ Unsplash hoặc link web..."
                        style={{ flex: 1 }}
                      />
                      <button type="button" className={styles.removeBtn} onClick={() => removeArrayItem('gallery', index)} style={{ padding: '8px' }}>
                        <Trash size={18} />
                      </button>
                    </div>
                  ))}
                  
                  {(!formData.gallery || formData.gallery.length === 0) && (
                    <div style={{ textAlign: 'center', padding: '24px', border: '2px dashed #e2e8f0', borderRadius: '16px', color: '#94a3b8', fontSize: '0.875rem' }}>
                      Chưa có ảnh nào trong bộ sưu tập. Nhấn "Thêm đường dẫn ảnh" để bắt đầu.
                    </div>
                  )}
                </div>
              </div>

              {/* Details & Extras Section */}
              <div className={styles.sectionTitle}><ListChecks size={18} weight="fill" /> Tiện ích & Đặc điểm</div>
              <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label>Đặc điểm danh sách</label>
                  <button type="button" className={styles.addBtn} onClick={() => addArrayItem('features')}>
                    <Plus size={14} weight="bold" /> Thêm đặc điểm
                  </button>
                </div>
                <div className={styles.arrayGrid}>
                  {formData.features?.map((feat: string, index: number) => (
                    <div key={index} className={styles.arrayItem} style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text" 
                        value={feat} 
                        onChange={(e) => handleArrayChange('features', index, e.target.value)}
                        placeholder="Ví dụ: WiFi miễn phí"
                      />
                      <button type="button" className={styles.removeBtn} onClick={() => removeArrayItem('features', index)}>
                        <Trash size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {type === 'destination' && (
                <>
                  <div className={styles.sectionTitle}><MapTrifold size={18} weight="fill" /> Bản đồ & Thời tiết</div>
                  <div className={styles.inputGroup}>
                    <label>Vĩ độ (Lat)</label>
                    <input 
                      type="number" 
                      step="0.0001" 
                      value={formData.mapCoordinates?.lat || ''} 
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, mapCoordinates: { ...prev.mapCoordinates, lat: parseFloat(e.target.value) } }))}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Kinh độ (Lng)</label>
                    <input 
                      type="number" 
                      step="0.0001" 
                      value={formData.mapCoordinates?.lng || ''} 
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, mapCoordinates: { ...prev.mapCoordinates, lng: parseFloat(e.target.value) } }))}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Nhiệt độ hiện tại (°C)</label>
                    <input 
                      type="number" 
                      value={formData.weatherCurrent?.temp || ''} 
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, weatherCurrent: { ...prev.weatherCurrent, temp: parseInt(e.target.value) } }))}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Mô tả thời tiết</label>
                    <input 
                      type="text" 
                      value={formData.weatherCurrent?.description || ''} 
                      onChange={(e) => setFormData((prev: any) => ({ ...prev, weatherCurrent: { ...prev.weatherCurrent, description: e.target.value } }))}
                      placeholder="Nắng đẹp, Mây rải rác..."
                    />
                  </div>

                  <div className={styles.sectionTitle}><Lightbulb size={18} weight="fill" /> Mẹo du lịch</div>
                  <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                    <button type="button" className={styles.addBtn} onClick={() => addArrayItem('travelTips', { icon: 'Lightbulb', title: '', content: '' })}>
                      <Plus size={14} weight="bold" /> Thêm mẹo
                    </button>
                    <div className={styles.nestedList}>
                      {formData.travelTips?.map((tip: any, index: number) => (
                        <div key={index} className={styles.nestedItem}>
                          <div className={styles.nestedRow}>
                            <input title="Icon" style={{ width: '80px' }} value={tip.icon} onChange={e => handleNestedArrayChange('travelTips', index, 'icon', e.target.value)} />
                            <input placeholder="Tiêu đề mẹo" value={tip.title} onChange={e => handleNestedArrayChange('travelTips', index, 'title', e.target.value)} />
                            <button type="button" className={styles.removeBtn} onClick={() => removeArrayItem('travelTips', index)}><Trash size={18} /></button>
                          </div>
                          <textarea placeholder="Nội dung chi tiết..." value={tip.content} onChange={e => handleNestedArrayChange('travelTips', index, 'content', e.target.value)}></textarea>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={styles.footer}>
            <button className={styles.btnCancel} onClick={onClose}>Hủy bỏ</button>
            <button className={styles.btnSave} onClick={handleSaveInternal}>Lưu thay đổi</button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddEditModal;

