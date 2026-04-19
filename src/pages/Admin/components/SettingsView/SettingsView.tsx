import React, { useState } from 'react';
import styles from '../_shared.module.scss';
import { 
  User, 
  ShieldCheck, 
  Globe, 
  Key, 
  CloudArrowUp,
  FloppyDisk,
  DeviceMobile,
  Lock,
  Envelope
} from "@phosphor-icons/react";
import { motion, AnimatePresence } from 'framer-motion';

const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  } as const;

  const rowVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  } as const;

  const tabContentVariants = {
    initial: { opacity: 0, x: 10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -10 },
    transition: { duration: 0.2 }
  } as const;

  return (
    <motion.div 
      className={styles.contentArea} 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
    >
      <motion.div variants={rowVariants} className={styles.pageHeader}>
        <div className={styles.pageTitle}>
          <h2>Cài đặt hệ thống</h2>
          <p>Quản lý hồ sơ cá nhân, cấu hình bảo mật và tùy chỉnh trải nghiệm quản trị</p>
        </div>
        <div className={styles.pageActions}>
          <button className={styles.btnPrimary}>
            <FloppyDisk size={18} weight="bold" />
            <span>Lưu tất cả thay đổi</span>
          </button>
        </div>
      </motion.div>

      <motion.div variants={rowVariants} className={styles.filterSection}>
        <div className={styles.filterHeader}>
          <div className={styles.tabGroup}>
            <button 
              className={`${styles.tab} ${activeTab === 'profile' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <User size={16} weight={activeTab === 'profile' ? "fill" : "regular"} />
                Hồ sơ cá nhân
              </div>
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'security' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={16} weight={activeTab === 'security' ? "fill" : "regular"} />
                Bảo mật & Tài khoản
              </div>
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'system' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('system')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Globe size={16} weight={activeTab === 'system' ? "fill" : "regular"} />
                Cấu hình hệ thống
              </div>
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          variants={tabContentVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={tabContentVariants.transition}
          className={styles.tableContainer} // Re-using table container for the card-like look
          style={{ padding: '40px' }}
        >
          {activeTab === 'profile' && (
            <div style={{ maxWidth: '800px' }}>
              <div style={{ display: 'flex', gap: '48px', alignItems: 'flex-start' }}>
                <div style={{ position: 'relative' }}>
                  <img 
                    src="https://i.pravatar.cc/200?u=admin" 
                    alt="Current Avatar" 
                    style={{ width: '120px', height: '120px', borderRadius: '32px', objectFit: 'cover', border: '4px solid #f1f5f9', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }} 
                  />
                  <button style={{ position: 'absolute', bottom: '-10px', right: '-10px', width: '36px', height: '36px', borderRadius: '12px', background: '#2563eb', color: 'white', border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', outline: 'none' }}>
                    <CloudArrowUp size={20} weight="bold" />
                  </button>
                </div>
                
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Họ và tên</label>
                    <input 
                      type="text" 
                      defaultValue="Quản trị viên" 
                      style={{ padding: '12px 16px', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '14px', fontSize: '0.9375rem', fontWeight: 600, color: '#334155' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Vai trò</label>
                    <input 
                      type="text" 
                      defaultValue="Super Admin" 
                      disabled
                      style={{ padding: '12px 16px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '14px', fontSize: '0.9375rem', fontWeight: 600, color: '#64748b', cursor: 'not-allowed' }}
                    />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Địa chỉ Email</label>
                    <div style={{ position: 'relative' }}>
                      <Envelope size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input 
                        type="email" 
                        defaultValue="admin@travelai.com" 
                        style={{ width: '100%', padding: '12px 16px 12px 48px', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '14px', fontSize: '0.9375rem', fontWeight: 600, color: '#334155' }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', gridColumn: 'span 2' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Giới thiệu tiểu sử</label>
                    <textarea 
                      rows={4}
                      placeholder="Viết vài dòng giới thiệu về bạn..."
                      defaultValue="Quản trị viên cấp cao của hệ thống Travel AI, phụ trách điều hành và giám sát toàn bộ hoạt động của ứng dụng."
                      style={{ width: '100%', padding: '16px', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '14px', fontSize: '0.9375rem', fontWeight: 600, color: '#334155', resize: 'none' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div style={{ maxWidth: '800px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '24px' }}>Thay đổi mật khẩu</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mật khẩu hiện tại</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input 
                        type="password" 
                        placeholder="••••••••••••"
                        style={{ width: '100%', padding: '12px 16px 12px 48px', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '14px', fontSize: '0.9375rem', fontWeight: 600, color: '#334155' }}
                      />
                    </div>
                  </div>
                  <div />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Mật khẩu mới</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input 
                        type="password" 
                        placeholder="Nhập mật khẩu mới"
                        style={{ width: '100%', padding: '12px 16px 12px 48px', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '14px', fontSize: '0.9375rem', fontWeight: 600, color: '#334155' }}
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Xác nhận mật khẩu</label>
                    <div style={{ position: 'relative' }}>
                      <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input 
                        type="password" 
                        placeholder="Nhập lại mật khẩu mới"
                        style={{ width: '100%', padding: '12px 16px 12px 48px', background: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '14px', fontSize: '0.9375rem', fontWeight: 600, color: '#334155' }}
                      />
                    </div>
                  </div>
                </div>
                
                <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '12px 0' }} />
                
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Bảo mật 2 lớp (2FA)</h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '20px' }}>Tăng cường bảo mật cho tài khoản của bạn bằng cách yêu cầu mã xác minh mỗi khi đăng nhập.</p>
                  <div style={{ padding: '20px', background: '#f8fafc', borderRadius: '20px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(37,99,235,0.1)', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <DeviceMobile size={24} weight="bold" />
                      </div>
                      <div>
                        <p style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a', margin: '0' }}>Xác thực qua thiết bị di động</p>
                        <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: '2px 0 0 0' }}>Sử dụng các ứng dụng như Google Authenticator.</p>
                      </div>
                    </div>
                    <button className={styles.btnPrimary} style={{ background: '#f1f5f9', color: '#0f172a', boxShadow: 'none' }}>
                      Kích hoạt ngay
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'system' && (
            <div style={{ maxWidth: '800px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '24px' }}>Cấu hình hệ thống</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a', margin: '0' }}>Chế độ bảo trì (Maintenance Mode)</p>
                    <p style={{ fontSize: '0.8125rem', color: '#94a3b8', margin: '4px 0 0 0' }}>Tạm dừng tất cả các hoạt động trên ứng dụng phía người dùng.</p>
                  </div>
                  <div style={{ width: '48px', height: '24px', background: '#e2e8f0', borderRadius: '100px', position: 'relative', cursor: 'pointer' }}>
                    <div style={{ position: 'absolute', left: '2px', top: '2px', width: '20px', height: '20px', background: 'white', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#0f172a', margin: '0' }}>Thông báo hệ thống</p>
                    <p style={{ fontSize: '0.8125rem', color: '#94a3b8', margin: '4px 0 0 0' }}>Gửi thông báo đẩy về các sự kiện quan trọng trong hệ thống.</p>
                  </div>
                  <div style={{ width: '48px', height: '24px', background: '#2563eb', borderRadius: '100px', position: 'relative', cursor: 'pointer' }}>
                    <div style={{ position: 'absolute', right: '2px', top: '2px', width: '20px', height: '20px', background: 'white', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}></div>
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '12px 0' }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>API Gateway Key</label>
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                      <Key size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                      <input 
                        type="password" 
                        defaultValue="AI_TRAVEL_API_SECRET_PLATFORM_KEY_2024" 
                        disabled
                        style={{ width: '100%', padding: '12px 16px 12px 48px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '14px', fontSize: '0.9375rem', fontWeight: 600, color: '#64748b' }}
                      />
                    </div>
                    <button className={styles.btnPrimary} style={{ padding: '0 20px' }}>
                      Hiển thị
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

export default SettingsView;
