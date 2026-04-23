import React from "react";
import styles from "./Topbar.module.scss";
import { MagnifyingGlass, Bell, Question } from "@phosphor-icons/react";

interface TopbarProps {
  viewTitle: string;
  user?: {
    fullName?: string;
    name?: string;
    avatarUrl?: string;
    imageUrl?: string;
  };
}

const Topbar: React.FC<TopbarProps> = ({ viewTitle, user }) => {
  return (
    <header className={styles.topbar}>
      <h2 className={styles.viewTitle}>{viewTitle}</h2>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <div className={styles.searchRel}>
          <MagnifyingGlass size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder={`Tìm kiếm trong ${viewTitle.toLowerCase()}...`}
            title="Tìm kiếm"
            aria-label="Tìm kiếm"
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <button
            type="button"
            className={styles.iconBtn}
            title="Thông báo"
            aria-label="Thông báo"
          >
            <Bell size={30} />
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            title="Trợ giúp"
            aria-label="Trợ giúp"
          >
            <Question size={30} />
          </button>
        </div>

        <div
          style={{
            width: "1px",
            height: "28px",
            backgroundColor: "#f1f5f9",
            margin: "0 4px",
          }}
        ></div>

        <div className={styles.userProfile}>
          <div className={styles.userInfo}>
            <p>Quản trị viên</p>
            <p>{user?.fullName || user?.name || "Admin"}</p>
          </div>
          <img
            src={
              user?.avatarUrl ||
              user?.imageUrl ||
              "https://i.pravatar.cc/100?u=admin"
            }
            alt="Avatar"
            className={styles.avatar}
          />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
