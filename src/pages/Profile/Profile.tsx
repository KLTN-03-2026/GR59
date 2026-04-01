import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import styles from "./Profile.module.scss";
import ProfileHeader from "./components/ProfileHeader/ProfileHeader";
import ProfileTabs from "./components/ProfileTabs/ProfileTabs";
import ProfileForm from "./components/ProfileForm/ProfileForm";
import ProfileSidebar from "./components/ProfileSidebar/ProfileSidebar";
import { getProfile } from "../../services/profileService";
import type { ProfileData } from "../../services/profileService";

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await getProfile();
      if (res && res.data && res.data.DT) {
        setProfile(res.data.DT);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  if (!profile) return <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>Đang tải dữ liệu...</div>;

  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        <div data-aos="fade-down">
          <ProfileHeader
            name={profile.name}
            email={profile.email}
            badge={profile.badge}
            avatar={profile.avatar}
            cover={profile.cover}
            joinDate={profile.joinDate}
            location={profile.location}
          />
        </div>

        <div data-aos="fade-in" data-aos-delay="200">
          <ProfileTabs />
        </div>

        <div className={styles.profileGrid}>
          <div
            className={styles.mainContent}
            data-aos="fade-up"
            data-aos-delay="400"
          >
            <ProfileForm title="Cập nhật thông tin" mode="info" profile={profile} />
            <ProfileForm title="Đổi mật khẩu" mode="password" />
          </div>

          <aside
            className={styles.sidebarSection}
            data-aos="fade-left"
            data-aos-delay="600"
          >
            <ProfileSidebar savedTrips={profile.savedTrips} />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Profile;
