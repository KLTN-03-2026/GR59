import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import styles from "./Profile.module.scss";
import ProfileHeader from "./components/ProfileHeader/ProfileHeader";
import ProfileTabs from "./components/ProfileTabs/ProfileTabs";
import ProfileForm from "./components/ProfileForm/ProfileForm";
import ProfileSidebar from "./components/ProfileSidebar/ProfileSidebar";
import { getSavedTrips } from "../../services/profileService";
import type { ProfileData, SavedTrip } from "../../services/profileService";

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [savedTrips, setSavedTrips] = useState<SavedTrip[]>([]);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });

    const fetchData = async () => {
      try {
        // 1. Lấy thông tin User từ LocalStorage (Được lưu từ bước Đăng nhập phía trước!)
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

          const profileData = {
            name: userData.fullName || userData.email || "Thành viên",
            email: userData.email || "Không rõ email",
            phone: userData.phone || "Chưa cập nhật",
            address: userData.address || "Chưa cập nhật",
            bio: "Sẵn sàng lên lịch trình tự động đi du lịch muôn nơi với TravelAI",
            avatar: userData.avatarUrl || "https://res.cloudinary.com/dwyzqwupm/image/upload/v1741528643/user-avatar_hpxv4t.png", 
            cover: "https://res.cloudinary.com/dwyzqwupm/image/upload/v1738733306/halong_lbbmro.jpg", // Tạm mặc định
            badge: userData.role === "ADMIN" ? "Quản trị viên" : "Thành viên Mới",
            joinDate: formattedJoinDate,
            location: userData.address || "Việt Nam",
          };

          setProfile(profileData);
        } else {
          // Xử lý báo lỗi nếu vào profile mà LocalStorage chưa có gì (chưa đăng nhập)
          console.warn("Không tìm thấy dữ liệu user trong local storage");
        }

        // 2. Tạm thời vẫn lấy các danh sách chuyến đi từ API cũ. 
        // (Sau này BE mà có API chuyến đi riêng thì sẽ tính sau) 
        try {
          const savedTripsRes = await getSavedTrips();
          if (savedTripsRes && savedTripsRes.data && savedTripsRes.data.DT) {
             setSavedTrips(savedTripsRes.data.DT);
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
            <ProfileForm
              title="Cập nhật thông tin"
              mode="info"
              profile={profile}
            />
            <ProfileForm title="Đổi mật khẩu" mode="password" />
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
