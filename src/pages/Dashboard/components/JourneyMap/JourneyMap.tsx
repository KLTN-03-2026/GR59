import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import styles from './JourneyMap.module.scss';
import { CornersOut, MapTrifoldIcon } from "@phosphor-icons/react";


// Fix icon lỗi của Leaflet trong React
const customIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const JourneyMap: React.FC = () => {
  const position: [number, number] = [16.0544, 108.2022]; // Tọa độ Đà Nẵng

  return (
    <div className={styles.journeyMap}>
      <div className={styles.sectionHeader}>
        <div className={styles.headerTitle}>
          <div className={styles.iconBox}>
            <MapTrifoldIcon size={20} weight="bold" />
          </div>
          <div className={styles.headerInfo}>
            <h3>Bản đồ hành trình</h3>
            <p>Xem vị trí hiện tại của các kế hoạch</p>
          </div>
        </div>
        <button className={styles.btnMaximize}>
          <CornersOut size={20} weight="bold" />
          <span>Toàn màn hình</span>
        </button>
      </div>

      <div className={styles.mapWrapper}>
        <MapContainer center={position} zoom={13} className={styles.leafletContainer} zoomControl={false}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          <Marker position={position} icon={customIcon}>
            <Popup>
              <div className={styles.mapPopup}>
                <h5>Đà Nẵng</h5>
                <p>Chuyến đi sắp tới của bạn</p>
              </div>
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default JourneyMap;