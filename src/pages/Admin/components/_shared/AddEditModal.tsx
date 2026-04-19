import React, { useState, useEffect, useRef } from 'react';
import styles from './AddEditModal.module.scss';
import { 
  X, Plus, Trash, Image as ImageIcon, Info, MapTrifold, Cloud, Lightbulb, ListChecks, 
  Airplane, Video, UploadSimple, CircleNotch, Bed, House, Buildings, Tent, Storefront,
  ForkKnife, Fish, BowlFood, Coffee, Hamburger, Leaf, Globe, Mountains, 
  Star, GlobeHemisphereWest, CheckCircle, Wrench, Clock, MapPin
} from "@phosphor-icons/react";
import CustomSelect from './CustomSelect';
import { uploadAdminImage } from '../../../../services/adminService';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

interface AddEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  title: string;
  type: 'destination' | 'hotel' | 'restaurant' | 'user';
  initialData?: any;
}

const AddEditModal: React.FC<AddEditModalProps> = ({ isOpen, onClose, onSave, title, type, initialData }) => {
  const [formData, setFormData] = useState<any>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  
  const [isUploading, setIsUploading] = useState(false);
  
  // State mới để lưu file thực tế trước khi gửi FormData
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [tempGalleryFiles, setTempGalleryFiles] = useState<File[]>([]);
  // Lưu trữ các ObjectURL để cleanup
  const previewUrls = useRef<string[]>([]);

  useEffect(() => {
    if (initialData) {
      // Unify initialData keys for internal use
      const unifiedData = {
        ...initialData,
        // Name/Title mapping (Unified to 'name')
        name: initialData.name || initialData.title || '',
        // Unified Image mapping
        imageUrl: initialData.imageUrl || initialData.image || initialData.img || initialData.heroImage,
        // Reviews mapping (Unified to 'reviewCount')
        reviews: initialData.reviewCount || initialData.reviews || 0,
        // Price mapping (Unified to 'averagePrice')
        price: initialData.averagePrice || initialData.priceRange || initialData.price || 0,
        // Duration mapping (Unified to 'estimatedDuration')
        duration: initialData.estimatedDuration || initialData.time || 0,
        // Location mapping
        location: initialData.location || '',
        // Province mapping
        provinceId: initialData.provinceId || 1,
        // Status mapping
        status: initialData.status || (type === 'restaurant' ? 'OPENING' : 'ACTIVE'),
        // Category/Type mapping
        category: initialData.category || (type === 'hotel' ? 'LUXURY' : (type === 'restaurant' ? 'VIETNAMESE' : 'ATTRACTION')),
        // User specific fields
        email: initialData.email || '',
        fullName: initialData.fullName || '',
        address: initialData.address || '',
        phone: initialData.phone || '',
        bio: initialData.bio || '',
        roleId: initialData.roleId || 2,
        isEmailVerified: initialData.isEmailVerified ?? false,
        isActive: initialData.isActive ?? true,
        password: ''
      };
      setFormData(unifiedData);
    } else {
      const baseData = {
        name: '',
        location: '',
        provinceId: 1,
        status: type === 'restaurant' ? 'OPENING' : 'ACTIVE',
        rating: 5,
        reviews: '0',
        imageUrl: '',
        gallery: [],
        description: '',
        previewVideo: '',
        category: type === 'hotel' ? 'LUXURY' : (type === 'restaurant' ? 'VIETNAMESE' : 'ATTRACTION'),
        price: type === 'hotel' ? 0 : '',
        duration: type === 'hotel' ? 1200 : '',
      };

      setFormData(baseData);
    }
  }, [initialData, type, isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    const newArray = [...(formData[field] || [])];
    newArray[index] = value;
    setFormData((prev: any) => ({ ...prev, [field]: newArray }));
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, field: 'main' | 'gallery') => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    if (type === 'hotel' || type === 'restaurant' || type === 'destination') {
      const newFiles = Array.from(files);
      const newPreviews = newFiles.map(file => {
        const url = URL.createObjectURL(file);
        previewUrls.current.push(url);
        return url;
      });

      if (field === 'main') {
        setMainImageFile(newFiles[0]);
        setFormData((prev: any) => ({ ...prev, imageUrl: newPreviews[0] }));
      } else {
        setTempGalleryFiles(prev => [...prev, ...newFiles]);
        setFormData((prev: any) => ({ ...prev, gallery: [...(prev.gallery || []), ...newPreviews] }));
      }
      return;
    }
  };

  // Cleanup ObjectURLs khi đóng modal hoặc unmount
  useEffect(() => {
    return () => {
      previewUrls.current.forEach(url => URL.revokeObjectURL(url));
      previewUrls.current = [];
    };
  }, [isOpen]);

  const provinceOptions = [
    { value: 1, label: 'Huế', icon: <MapPin size={18} /> },
    { value: 2, label: 'Đà Nẵng', icon: <MapPin size={18} /> },
    { value: 3, label: 'Quảng Nam', icon: <MapPin size={18} /> },
    { value: 4, label: 'Hà Nội', icon: <MapPin size={18} /> },
    { value: 5, label: 'TP. Hồ Chí Minh', icon: <MapPin size={18} /> },
  ];

  const getStatusOptions = () => {
    if (type === 'restaurant') {
      return [
        { value: 'OPENING', label: 'Đang mở cửa (Opening)', icon: <CheckCircle size={18} color="#10b981" /> },
        { value: 'CLOSED', label: 'Tạm đóng cửa (Closed)', icon: <Clock size={18} color="#f59e0b" /> },
      ];
    }
    return [
      { value: 'ACTIVE', label: 'Đang hoạt động (Active)', icon: <CheckCircle size={18} color="#10b981" /> },
      { value: 'MAINTENANCE', label: 'Đang bảo trì (Maintenance)', icon: <Wrench size={18} color="#f59e0b" /> },
    ];
  };

  const getCategoryOptions = () => {
    if (type === 'hotel') {
      return [
        { value: 'LUXURY', label: 'Luxury (Hạng sang)', icon: <Buildings size={18} /> },
        { value: 'RESORT', label: 'Resort (Nghỉ dưỡng)', icon: <Mountains size={18} /> },
        { value: 'BOUTIQUE', label: 'Boutique (Độc đáo)', icon: <House size={18} /> },
        { value: 'BUDGET', label: 'Budget (Bình dân)', icon: <Storefront size={18} /> },
        { value: 'BUSINESS', label: 'Business (Công tác)', icon: <Buildings size={18} /> },
        { value: 'HOMESTAY', label: 'Homestay', icon: <Tent size={18} /> },
        { value: 'VILLA', label: 'Villa (Biệt thự)', icon: <House size={18} /> },
      ];
    } else if (type === 'restaurant') {
      return [
        { value: 'VIETNAMESE', label: 'Món Việt (Vietnamese)', icon: <BowlFood size={18} /> },
        { value: 'SEAFOOD', label: 'Hải sản (Seafood)', icon: <Fish size={18} /> },
        { value: 'DESSERT', label: 'Tráng miệng/Cafe (Dessert)', icon: <Coffee size={18} /> },
        { value: 'WESTERN', label: 'Món Âu (Western)', icon: <Hamburger size={18} /> },
        { value: 'ASIAN', label: 'Món Á (Asian)', icon: <ForkKnife size={18} /> },
        { value: 'VEGETARIAN', label: 'Món chay (Vegetarian)', icon: <Leaf size={18} /> },
      ];
    } else {
      return [
        { value: 'ATTRACTION', label: 'Điểm tham quan', icon: <MapPin size={18} /> },
        { value: 'CULTURE', label: 'Văn hóa & Lịch sử', icon: <Buildings size={18} /> },
        { value: 'NATURE', label: 'Thiên nhiên & Sinh thái', icon: <Leaf size={18} /> },
        { value: 'RELAX', label: 'Nghỉ dưỡng & Thư giãn', icon: <Cloud size={18} /> },
        { value: 'ENTERTAINMENT', label: 'Giải trí', icon: <Star size={18} /> },
      ];
    }
  };

  const handleSaveInternal = () => {
    const finalData = { ...formData };
    
    if (type === 'hotel' || type === 'restaurant' || type === 'destination') {
      // 1. Chuẩn bị Metadata Key và Object
      const metadataKey = type === 'hotel' ? 'hotel' : (type === 'restaurant' ? 'restaurant' : 'attraction');
      
      let metadata: any = {};
      
      // Unified metadata for all types (Hotel, Restaurant, Destination)
      metadata = {
        name: finalData.name,
        description: finalData.description,
        location: finalData.location,
        rating: parseFloat(finalData.rating) || 5.0,
        reviewCount: parseInt(finalData.reviews) || 0,
        imageUrl: finalData.imageUrl,
        gallery: Array.isArray(finalData.gallery) ? finalData.gallery.filter((url: string) => !url.startsWith('blob:')) : [],
        previewVideo: finalData.previewVideo || null,
        category: finalData.category || null,
        status: finalData.status || 'ACTIVE',
        averagePrice: parseInt(finalData.price) || 0,
        estimatedDuration: parseInt(finalData.duration) || 0,
        provinceId: parseInt(finalData.provinceId) || 1
      };

      // 2. Tạo FormData theo cấu trúc Backend yêu cầu
      const fd = new FormData();
      const jsonBlob = new Blob([JSON.stringify(metadata)], { type: 'application/json' });
      fd.append(metadataKey, jsonBlob);

      if (mainImageFile) {
        fd.append('imageFile', mainImageFile);
      }

      if (tempGalleryFiles.length > 0) {
        tempGalleryFiles.forEach(file => {
          fd.append('galleryFiles', file);
        });
      }

      onSave(fd);
      return;
    }

    if (type === 'user') {
      // Validation for new users
      if (!initialData && !finalData.password) {
        toast.warn("Vui lòng nhập mật khẩu cho người dùng mới!");
        return;
      }

      const userData = {
        email: finalData.email,
        fullName: finalData.fullName,
        address: finalData.address,
        phone: finalData.phone,
        bio: finalData.bio,
        roleId: parseInt(finalData.roleId) || 2,
        isEmailVerified: finalData.isEmailVerified === true || finalData.isEmailVerified === 'true',
        isActive: finalData.isActive === true || finalData.isActive === 'true',
        ...( !initialData ? { password: finalData.password } : {} )
      };
      onSave(userData);
      return;
    }

    onSave(finalData);
  };

  if (!isOpen) return null;

  const mainImageUrl = type === 'hotel' 
    ? formData.imageUrl 
    : (type === 'destination' ? (formData.img || formData.heroImage) : formData.image);

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
              {type !== 'user' ? (
                <>
                  <div className={styles.sectionTitle}><Info size={18} weight="fill" /> Thông tin cơ bản</div>
                  
                  <div className={`${styles.inputGroup} ${styles.fullWidth}`} style={{ marginBottom: '32px' }}>
                    <div className={styles.mainImageHeader}>
                      <div className={styles.mainPreviewWrapper}>
                        {formData.imageUrl ? (
                          <img src={formData.imageUrl} alt="Preview" />
                        ) : (
                          <div className={styles.placeholderIcon}>
                            <ImageIcon size={48} weight="thin" />
                          </div>
                        )}
                        <button 
                          type="button" 
                          className={styles.uploadBtnOverlay}
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <UploadSimple size={20} weight="bold" />
                          <span>{formData.imageUrl ? 'Đổi ảnh' : 'Tải ảnh lên'}</span>
                        </button>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          hidden 
                          accept="image/*" 
                          onChange={(e) => handleFileUpload(e, 'main')} 
                        />
                      </div>
                      <div className={styles.imageMetaInfo}>
                        <label>Hình ảnh đại diện (URL hoặc Tải lên)</label>
                        <input 
                          type="text" 
                          name="imageUrl" 
                          value={formData.imageUrl || ''} 
                          onChange={handleChange}
                          placeholder="Dán URL hình ảnh tại đây hoặc nhấn nút Tải lên bên cạnh..."
                        />
                        <div className={styles.statusBadges}>
                          <span className={styles.tipBadge}>Chất lượng tốt nhất: 800x600px</span>
                          {isUploading && <span className={styles.uploadingBadge}><CircleNotch size={14} className="ph-spin" /> Đang tải...</span>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                    <label>Tên / Tiêu đề chính ({type === 'hotel' ? 'Khách sạn' : type === 'restaurant' ? 'Nhà hàng' : 'Địa điểm'})</label>
                    <input 
                      type="text" 
                      name="name" 
                      value={formData.name || ''} 
                      onChange={handleChange}
                      placeholder={`Nhập tên ${type === 'hotel' ? 'khách sạn' : type === 'restaurant' ? 'nhà hàng' : 'địa điểm'}...`}
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
                    <CustomSelect 
                      label="Tỉnh thành"
                      options={provinceOptions}
                      value={formData.provinceId || 1}
                      onChange={(val) => setFormData((prev: any) => ({ ...prev, provinceId: val }))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <CustomSelect 
                      label="Trạng thái hoạt động"
                      options={getStatusOptions()}
                      value={formData.status || ''}
                      onChange={(val) => setFormData((prev: any) => ({ ...prev, status: val }))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Xếp hạng (Sao / Điểm)</label>
                    <input type="number" step="0.1" min="0" max="5" name="rating" value={formData.rating || ''} onChange={handleChange} placeholder="Ví dụ: 4.8" />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Lượt đánh giá</label>
                    <input 
                      type="number" 
                      name="reviews" 
                      value={formData.reviews || ''} 
                      onChange={handleChange} 
                      placeholder="Ví dụ: 1250" 
                    />
                  </div>

                  <div className={styles.sectionTitle}><Lightbulb size={18} weight="fill" /> Thông tin bổ sung</div>

                  <div className={styles.inputGroup}>
                    <CustomSelect 
                      label={type === 'restaurant' ? 'Loại hình ẩm thực' : 'Hạng mục / Danh mục'}
                      options={getCategoryOptions()}
                      value={formData.category || ''}
                      onChange={(val) => setFormData((prev: any) => ({ ...prev, category: val }))}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>{type === 'hotel' ? 'Giá trung bình (VNĐ/Đêm)' : (type === 'restaurant' ? 'Khoảng giá (VNĐ)' : 'Giá vé tham quan')}</label>
                    <input 
                      type={type === 'hotel' ? 'number' : 'text'} 
                      name="price" 
                      value={formData.price || ''} 
                      onChange={handleChange} 
                      placeholder="Ví dụ: 500k - 2tr" 
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label>{type === 'hotel' ? 'Thời gian trải nghiệm (phút)' : 'Thời gian tham quan ước tính'}</label>
                    <input 
                      type={type === 'hotel' ? 'number' : 'text'} 
                      name="duration" 
                      value={formData.duration || ''} 
                      onChange={handleChange} 
                      placeholder={type === 'hotel' ? '1200' : 'Ví dụ: 2-3 tiếng'} 
                    />
                  </div>

                  <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                    <label>Mô tả chi tiết</label>
                    <textarea name="description" value={formData.description || ''} onChange={handleChange} placeholder={`Nhập mô tả chi tiết về ${type === 'hotel' ? 'khách sạn' : type === 'restaurant' ? 'nhà hàng' : 'địa điểm'} này...`}></textarea>
                  </div>

                  <div className={styles.sectionTitle}><ImageIcon size={18} weight="fill" /> Video & Thư viện ảnh</div>
                  
                  <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                    <label><Video size={16} weight="fill" /> Video giới thiệu (YouTube URL)</label>
                    <input 
                      type="text" 
                      name="previewVideo" 
                      value={formData.previewVideo || ''} 
                      onChange={handleChange} 
                      placeholder="https://youtube.com/watch?v=..." 
                    />
                  </div>

                  <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <label style={{ margin: 0 }}>Thư viện hình ảnh ({type === 'hotel' ? 'khách sạn' : type === 'restaurant' ? 'nhà hàng' : 'địa điểm'})</label>
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
                            placeholder="Dán URL hình ảnh..."
                            style={{ flex: 1 }}
                          />
                          <button type="button" className={styles.removeBtn} onClick={() => removeArrayItem('gallery', index)} style={{ padding: '8px' }}>
                            <Trash size={18} />
                          </button>
                        </div>
                      ))}
                      
                      {(!formData.gallery || formData.gallery.length === 0) && (
                        <div style={{ textAlign: 'center', padding: '24px', border: '2px dashed #e2e8f0', borderRadius: '16px', color: '#94a3b8', fontSize: '0.875rem' }}>
                          Chưa có ảnh nào trong bộ sưu tập.
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className={styles.sectionTitle}><Buildings size={18} weight="fill" /> Thông tin tài khoản</div>
                  <div className={styles.inputGroup}>
                    <label>Họ và tên</label>
                    <input type="text" name="fullName" value={formData.fullName || ''} onChange={handleChange} placeholder="Nguyễn Văn A" />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Email</label>
                    <input type="email" name="email" value={formData.email || ''} onChange={handleChange} placeholder="example@gmail.com" />
                  </div>
                  {!initialData && (
                    <div className={styles.inputGroup}>
                      <label>Mật khẩu</label>
                      <input type="password" name="password" value={formData.password || ''} onChange={handleChange} placeholder="Mật khẩu ít nhất 8 ký tự..." />
                    </div>
                  )}
                  <div className={styles.inputGroup}>
                    <label>Số điện thoại</label>
                    <input type="text" name="phone" value={formData.phone || ''} onChange={handleChange} placeholder="09xxxxxxxx" />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Địa chỉ</label>
                    <input type="text" name="address" value={formData.address || ''} onChange={handleChange} placeholder="Hà Nội, Việt Nam" />
                  </div>
                  <div className={styles.inputGroup}>
                    <CustomSelect 
                      label="Vai trò"
                      options={[
                        { value: 1, label: 'Quản trị viên (Admin)', icon: <Buildings size={18} /> },
                        { value: 2, label: 'Người dùng (User)', icon: <Globe size={18} /> }
                      ]}
                      value={formData.roleId || 2}
                      onChange={(val) => setFormData((prev: any) => ({ ...prev, roleId: val }))}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <CustomSelect 
                      label="Xác minh Email"
                      options={[
                        { value: true, label: 'Đã xác minh', icon: <CheckCircle size={18} color="#10b981" /> },
                        { value: false, label: 'Chưa xác minh', icon: <X size={18} color="#ef4444" /> }
                      ]}
                      value={formData.isEmailVerified ?? false}
                      onChange={(val) => setFormData((prev: any) => ({ ...prev, isEmailVerified: val }))}
                    />
                  </div>
                  <div className={styles.inputGroup}>
                    <CustomSelect 
                      label="Trạng thái hoạt động"
                      options={[
                        { value: true, label: 'Đang hoạt động', icon: <CheckCircle size={18} color="#10b981" /> },
                        { value: false, label: 'Ngừng hoạt động', icon: <X size={18} color="#ef4444" /> }
                      ]}
                      value={formData.isActive ?? true}
                      onChange={(val) => setFormData((prev: any) => ({ ...prev, isActive: val }))}
                    />
                  </div>
                  <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
                    <label>Giới thiệu (Bio)</label>
                    <textarea name="bio" value={formData.bio || ''} onChange={handleChange} placeholder="Mô tả ngắn về người dùng..."></textarea>
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

