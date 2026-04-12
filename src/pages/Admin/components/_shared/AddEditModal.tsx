import React, { useState, useEffect } from 'react';
import styles from './AddEditModal.module.scss';
import { X, Plus, Trash, Image as ImageIcon, Info, MapTrifold, Cloud, Lightbulb, ListChecks, Airplane, Video } from "@phosphor-icons/react";
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
          image: '',
          type: 'RESORT',
          price: '',
          unit: 'đêm',
          amenities: []
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

  const handleSaveInternal = () => {
    const finalData = { ...formData };
    
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
                <input type="text" name="reviews" value={formData.reviews || ''} onChange={handleChange} placeholder="Ví dụ: 850" />
              </div>

              <div className={styles.inputGroup}>
                <label>Trạng thái</label>
                <select name="status" value={formData.status} onChange={handleChange}>
                  {type === 'restaurant' ? (
                    <>
                      <option value="ĐANG MỞ">Đang mở</option>
                      <option value="TẠM ĐÓNG">Tạm đóng</option>
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
                    <label>Loại hình</label>
                    <select name="type" value={formData.type} onChange={handleChange}>
                      <option value="RESORT">Resort</option>
                      <option value="CỔ ĐIỂN">Cổ điển</option>
                      <option value="HIỆN ĐẠI">Hiện đại</option>
                      <option value="HOMESTAY">Homestay</option>
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Giá phòng</label>
                    <input type="text" name="price" value={formData.price || ''} onChange={handleChange} placeholder="Ví dụ: 1.200.000đ" />
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
                <label>Hình ảnh chính (URL)</label>
                <input 
                  type="text" 
                  name={type === 'destination' ? 'img' : 'image'} 
                  value={(type === 'destination' ? formData.img : formData.image) || ''} 
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <label>Thư viện ảnh (Gallery)</label>
                  <button type="button" className={styles.addBtn} onClick={() => addArrayItem('gallery')}>
                    <Plus size={14} weight="bold" /> Thêm ảnh
                  </button>
                </div>
                <div className={styles.arrayGrid}>
                  {formData.gallery?.map((url: string, index: number) => (
                    <div key={index} className={styles.arrayItem} style={{ display: 'flex', gap: '8px' }}>
                      <input 
                        type="text" 
                        value={url} 
                        onChange={(e) => handleArrayChange('gallery', index, e.target.value)}
                        placeholder="URL..."
                      />
                      <button type="button" className={styles.removeBtn} onClick={() => removeArrayItem('gallery', index)}>
                        <Trash size={18} />
                      </button>
                    </div>
                  ))}
                </div>
                {formData.gallery?.length > 0 && (
                  <div className={styles.galleryPreviewGrid}>
                    {formData.gallery.map((url: string, index: number) => url && (
                      <div key={index} className={styles.galleryThumb}>
                        <img src={url} alt={`Thumb ${index}`} />
                      </div>
                    ))}
                  </div>
                )}
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

