import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { RoutePoint } from '../../ItineraryDetail';
import styles from './ItineraryMap.module.scss';

interface Props {
  points: RoutePoint[];
  activePointId: string | null;
  onPointClick: (id: string) => void;
  isPreviewing: boolean;
  previewPoint?: RoutePoint | null;
  metrics?: Record<string, { distance: string; duration: number }>;
}

// Custom hook to handle map side-effects
const MapEffectManager: React.FC<{
  points: RoutePoint[];
  activePointId: string | null;
  isPreviewing: boolean;
  previewPoint?: RoutePoint | null;
}> = ({ points, activePointId, isPreviewing, previewPoint }) => {
  const map = useMap();

  useEffect(() => {
    if (activePointId) {
      const point = points.find(p => p.id === activePointId);
      if (point) {
        map.flyTo([point.lat, point.lng], 15, { duration: 1.2 });
      }
    }
  }, [activePointId, map, points]);

  useEffect(() => {
    if (previewPoint) {
      map.flyTo([previewPoint.lat, previewPoint.lng], 16, { duration: 1.2 });
    }
  }, [previewPoint, map]);

  useEffect(() => {
    let timeoutId: number | ReturnType<typeof setTimeout>;
    let isCancelled = false;

    const playPreview = async () => {
      for (const point of points) {
        if (isCancelled) break;
        map.flyTo([point.lat, point.lng], 16, { duration: 1.5 });
        await new Promise(r => { timeoutId = setTimeout(r, 2500); });
      }
      
      if (!isCancelled && points.length > 0) {
        const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng] as [number, number]));
        map.fitBounds(bounds.pad(0.2));
      }
    };

    if (isPreviewing) playPreview();

    return () => {
      isCancelled = true;
      clearTimeout(timeoutId);
    };
  }, [isPreviewing, map, points]);

  useEffect(() => {
    if (points.length > 0 && !activePointId && !isPreviewing && !previewPoint) {
      const bounds = L.latLngBounds(points.map(p => [p.lat, p.lng] as [number, number]));
      map.fitBounds(bounds.pad(0.1));
    }
  }, [points, map, activePointId, isPreviewing, previewPoint]);

  return null;
};

const ItineraryMarker: React.FC<{
  point: RoutePoint;
  index: number;
  isActive: boolean;
  onClick: () => void;
}> = ({ point, index, isActive, onClick }) => {
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    if (isActive && markerRef.current) {
      markerRef.current.openPopup();
    }
  }, [isActive]);

  const icon = L.divIcon({
    className: 'iti-map-marker-wrap',
    html: `<div class="iti-map-marker"><span>${index}</span></div>`,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
  });

  return (
    <Marker ref={markerRef} position={[point.lat, point.lng]} icon={icon} eventHandlers={{ click: onClick }}>
      <Popup className="iti-custom-popup">
        <div className={styles.popupCard}>
          {point.imageUrl && <div className={styles.popupImg}><img src={point.imageUrl} alt={point.name} /></div>}
          <div className={styles.popupContent}>
             <div className={styles.popupMeta}>
                <span className={styles.popupTime}>{point.time}</span>
                <span className={styles.popupTag}>{point.type}</span>
             </div>
             <h4 className={styles.popupTitle}>{point.name}</h4>
             <p className={styles.popupDesc}>{point.description}</p>
          </div>
        </div>
      </Popup>
    </Marker>
  );
};

const PreviewMarker: React.FC<{ point: RoutePoint }> = ({ point }) => {
  const markerRef = useRef<L.Marker>(null);

  useEffect(() => {
    if (markerRef.current) markerRef.current.openPopup();
  }, [point]);

  const searchIcon = L.divIcon({
    className: 'search-marker-wrap',
    html: `<div class="search-marker-div"><i class="ph-fill ph-magnifying-glass"></i></div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
  });

  return (
    <Marker ref={markerRef} position={[point.lat, point.lng]} icon={searchIcon}>
      <Popup className="iti-custom-popup" offset={[0, -32]}>
        <div className={styles.searchPopupContent}>
           <h4 className={styles.searchPopupTitle}>{point.name}</h4>
           <p className={styles.searchPopupAddr}>Nhấn "Thêm vào lịch trình" để lưu địa điểm này.</p>
        </div>
      </Popup>
    </Marker>
  );
};

const MapControls: React.FC = () => {
  const map = useMap();
  return (
    <div className={styles.mapCtrlStack}>
      <div className={styles.ctrlGroup}>
        <button onClick={() => map.zoomIn()} aria-label="Phóng to"><i className="ph-bold ph-plus"></i></button>
        <button onClick={() => map.zoomOut()} aria-label="Thu nhỏ"><i className="ph-bold ph-minus"></i></button>
      </div>
      <button className={styles.ctrlBtn} onClick={() => {
        map.locate().on("locationfound", (e) => map.flyTo(e.latlng, 15));
      }}>
        <i className="ph-bold ph-crosshair"></i>
      </button>
    </div>
  );
};

const ItineraryMap: React.FC<Props> = ({ points, activePointId, onPointClick, isPreviewing, previewPoint, metrics = {} }) => {
  const renderPolylines = () => {
    if (points.length < 2) return null;
    const pathPositions = points.map(p => [p.lat, p.lng] as [number, number]);
    
    // Create markers for midpoints to show distance
    const distanceMarkers = [];
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i+1];
      const metric = metrics[`${p1.id}-${p2.id}`];
      
      if (metric) {
        const midLat = (p1.lat + p2.lat) / 2;
        const midLng = (p1.lng + p2.lng) / 2;
        
        const distIcon = L.divIcon({
          className: styles.distLabelWrap,
          html: `<div class="${styles.distBadge}">${metric.distance} km</div>`,
          iconSize: [60, 24],
          iconAnchor: [30, 12],
        });
        
        distanceMarkers.push(
          <Marker key={`dist-${p1.id}-${p2.id}`} position={[midLat, midLng]} icon={distIcon} />
        );
      }
    }

    return (
      <>
        <Polyline positions={pathPositions} pathOptions={{ color: '#0ea5e9', weight: 12, opacity: 0.1, lineCap: 'round' }} />
        <Polyline positions={pathPositions} pathOptions={{ color: '#0ea5e9', weight: 6, opacity: 0.8, dashArray: '1, 12', lineCap: 'round', lineJoin: 'round' }} />
        {distanceMarkers}
      </>
    );
  };

  return (
    <main className={styles.mapViewContainer}>
      <MapContainer center={[16.047079, 108.20623]} zoom={11} zoomControl={false} className={styles.mapViewContainer}>
        <TileLayer
          attribution="© Google Maps"
          url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
          subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
          maxZoom={20}
        />
        <MapEffectManager points={points} activePointId={activePointId} isPreviewing={isPreviewing} previewPoint={previewPoint} />
        <MapControls />
        {renderPolylines()}

        {points.map((point, idx) => (
          <ItineraryMarker 
            key={point.id} 
            point={point} 
            index={idx + 1} 
            isActive={activePointId === point.id} 
            onClick={() => onPointClick(point.id)} 
          />
        ))}

        {previewPoint && <PreviewMarker point={previewPoint} />}
      </MapContainer>
    </main>
  );
};

export default ItineraryMap;