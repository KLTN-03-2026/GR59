import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import styles from "./Profile.module.scss";
import ProfileHeader from "./components/ProfileHeader/ProfileHeader";
import ProfileTabs from "./components/ProfileTabs/ProfileTabs";
import ProfileForm from "./components/ProfileForm/ProfileForm";
import ProfileSidebar from "./components/ProfileSidebar/ProfileSidebar";
import UserReviews from "./components/UserReviews/UserReviews";
import { getProfile, getSavedTrips } from "../../services/profileService";
import type { ProfileData, SavedTrip } from "../../services/profileService";
import { anhmatdinh } from "../../assets/images/img";

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);
  const [activeTab, setActiveTab] = useState("info");

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    const fetchData = async () => {
      try {
        // 1. Gọi API lấy thông tin Profile mới nhất
        let profileData: ProfileData | null = null;
        try {
          const res = await getProfile();
          // Backend thật trả về dữ liệu trong trường 'data'
          const dt = res.data.data as ProfileData & {
            createdAt?: string;
            role?: string;
            avatarUrl?: string;
            cover?: string;
          };
          if (dt) {
            let formattedJoinDate = "Mới tham gia";
            if (dt.createdAt) {
              const date = new Date(dt.createdAt);
              const month = (date.getMonth() + 1).toString().padStart(2, "0");
              const year = date.getFullYear();
              formattedJoinDate = `${month}/${year}`;
            }

            profileData = {
              fullName: dt.fullName || "Thành viên",
              email: dt.email || "",
              phone: dt.phone || "",
              address: dt.address || "",
              bio:
                dt.bio ||
                "Sẵn sàng lên lịch trình tự động đi du lịch muôn nơi với TravelAI",
              avatar_url:
                dt.avatar_url ||
                dt.avatarUrl ||
                anhmatdinh,
              cover_url:
                dt.cover_url ||
                dt.cover ||
                "https://res.cloudinary.com/dwyzqwupm/image/upload/v1738733306/halong_lbbmro.jpg",
              badge: dt.role === "ADMIN" ? "Quản trị viên" : "Thành viên Mới",
              joinDate: formattedJoinDate,
              location: dt.address || "Việt Nam",
            };
          }
        } catch (apiErr) {
          console.warn(
            "Lỗi khi gọi API profile, dùng localStorage làm dự phòng:",
            apiErr,
          );
        }

        // 2. Nếu API không trả về dữ liệu, dùng LocalStorage (Đã lưu từ bước Đăng nhập)
        if (!profileData) {
          const userStr = localStorage.getItem("user");
          if (userStr) {
            const userData = JSON.parse(userStr);
            let formattedJoinDate = "Mới tham gia";
            if (userData.createdAt) {
              const date = new Date(userData.createdAt);
              const month = (date.getMonth() + 1).toString().padStart(2, "0");
              const year = date.getFullYear();
              formattedJoinDate = `${month}/${year}`;
            }

            profileData = {
              fullName: userData.fullName || userData.email || "Thành viên",
              email: userData.email || "Không rõ email",
              phone: userData.phone || "",
              address: userData.address || "",
              bio: "Sẵn sàng lên lịch trình tự động đi du lịch muôn nơi với TravelAI",
              avatar_url:
                userData.avatar_url ||
                userData.avatarUrl ||
                anhmatdinh,
              cover_url:
                userData.cover_url ||
                userData.cover ||
                "https://res.cloudinary.com/dwyzqwupm/image/upload/v1738733306/halong_lbbmro.jpg",
              badge:
                userData.role === "ADMIN" ? "Quản trị viên" : "Thành viên Mới",
              joinDate: formattedJoinDate,
              location: userData.address || "Việt Nam",
            };
          }
        }

        if (profileData) {
          setProfile(profileData);
        }

        // 3. Lấy danh sách chuyến đi
        try {
          const savedTripsRes = await getSavedTrips();
          if (savedTripsRes && savedTripsRes.data && savedTripsRes.data.data) {
            setSavedTrips(savedTripsRes.data.data);
          }
        } catch (tripErr) {
          console.warn("Chưa tải được mock saved_trips", tripErr);
        }
      } catch (error) {
        console.error("Lỗi khi tải thông tin profile:", error);
      }
    };

    fetchData();
  }, []);

  const handleAvatarUpdate = (newUrl: string) => {
    setProfile((prev) => (prev ? { ...prev, avatar_url: newUrl } : null));
  };

  const handleCoverUpdate = (newUrl: string) => {
    setProfile((prev) => (prev ? { ...prev, cover_url: newUrl } : null));
  };

  if (!profile)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Đang tải dữ liệu...
      </div>
    );

  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        <div data-aos="fade-down">
          <ProfileHeader
            name={profile.fullName}
            email={profile.email}
            badge={profile.badge}
            avatar_url={profile.avatar_url}
            cover_url={profile.cover_url}
            joinDate={profile.joinDate}
            location={profile.location}
            onAvatarUpdate={handleAvatarUpdate}
            onCoverUpdate={handleCoverUpdate}
          />
        </div>

        <div data-aos="fade-in" data-aos-delay="200">
          <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        </div>

        <div className={styles.profileGrid}>
          <div
            className={styles.mainContent}
            data-aos="fade-up"
            data-aos-delay="400"
          >
            {activeTab === "info" && (
              <>
                <ProfileForm
                  title="Cập nhật thông tin"
                  mode="info"
                  profile={profile}
                />
                <ProfileForm title="Đổi mật khẩu" mode="password" />
              </>
            )}
            {activeTab === "reviews" && <UserReviews />}
            {activeTab === "security" && <ProfileForm title="Đổi mật khẩu" mode="password" />}
            {activeTab === "trips" && (
              <div className={styles.emptyTab}>
                <h3>Lịch trình đã lưu</h3>
                <p>Bạn có {savedTrips.length} lịch trình đã lưu. Xem chi tiết ở cột bên phải.</p>
              </div>
            )}
          </div>

          <aside
            className={styles.sidebarSection}
            data-aos="fade-left"
            data-aos-delay="600"
          >
            <ProfileSidebar savedTrips={savedTrips} />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Profile;
