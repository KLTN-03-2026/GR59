import React from "react";
import {
  MapPin,
  Cloud,
  Car,
  Compass,
  Sparkle,
  PlusCircle,
  Clock,
  Lightning,
} from "phosphor-react";
import styles from "./Sidebar.module.scss";
import type { Destination } from "../../../../services/destinationService";

const Sidebar: React.FC<{ data: Destination }> = ({ data }) => {
  return (
    <aside className={styles.destRight}>
      <div className={styles.stickySidebar} data-aos="fade-left">
        {/* Map Widget */}
        <div className={`${styles.sidebarCard} ${styles.mapCardWidget}`}>
          <div className={styles.widgetMapImg}>
            {/* Hiển thị Pin bản đồ */}
            <div className={styles.giantPin}>
              <MapPin size={40} weight="fill" color="#33d7d1" />
            </div>
          </div>
          <div className={styles.widgetContent}>
            <h4>Vị trí & Thời tiết</h4>
            <ul className={styles.widgetList}>
              <li>
                <Cloud weight="fill" color="#33d7d1" />
                <span>28°C, Trời nắng đẹp</span>
              </li>
              <li>
                <Car weight="fill" color="#33d7d1" />
                {/* Dùng data.distance nếu có, hoặc để mặc định */}
                <span>{data.distance} di chuyển</span>
              </li>
              <li>
                <Compass weight="fill" color="#33d7d1" />
                <span>Tọa độ: 20.91° N</span>
              </li>
            </ul>
          </div>
        </div>

        {/* AI Action Card */}
        <div className={`${styles.sidebarCard} ${styles.actionCardWidget}`}>
          <div className={styles.actionHeader}>
            <Sparkle weight="fill" color="#fff" />
            <h4>Tạo lịch trình với AI</h4>
          </div>
          <p>
            AI sẽ giúp bạn tạo lịch trình chi tiết cho chuyến đi tại
            <strong> {data.title} </strong> chỉ trong vài giây.
          </p>
          <button
            className={styles.btnAddTrip}
            onClick={() => alert(`Đã thêm ${data.title} vào lịch trình!`)}
          >
            <PlusCircle size={20} weight="bold" /> Thêm vào lịch trình
          </button>
          <div className={styles.actionFooter}>
            <span>
              <Clock size={14} /> Tiết kiệm 20%
            </span>
            <span>
              <Lightning size={14} weight="fill" /> Tạo nhanh
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
