import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import styles from "./Dashboard.module.scss";

// Import các Components con
import Sidebar from "./components/Sidebar/Sidebar";
import ClockStation from "./components/ClockStation/ClockStation";
import JourneyMap from "./components/JourneyMap/JourneyMap";
import TripCard from "./components/TripCard/TripCard";
import AddTripCard from "./components/AddTripCard/AddTripCard";

// Import Types
import type { TripPlan } from "./types";
import TopBar from "./components/TopBar/Topbar";

const MOCK_TRIPS: TripPlan[] = [
  {
    id: "1",
    title: "Khám phá Hà Nội",
    dateRange: "25/03/2026 - 28/03/2026",
    days: 4,
    people: 2,
    image:
      "https://images.unsplash.com/photo-1509030464150-1b9a513d5044?q=80&w=800",
    status: "completed",
    checklist: [
      { id: "c1", label: "Vé máy bay", isCompleted: true },
      { id: "c2", label: "Khách sạn", isCompleted: true },
      { id: "c3", label: "Lịch trình", isCompleted: true },
    ],
  },
  {
    id: "2",
    title: "Khám phá Đà Nẵng",
    dateRange: "15/04/2026 - 20/04/2026",
    days: 6,
    people: 4,
    image:
      "https://images.unsplash.com/photo-1559592490-67245a494447?q=80&w=800",
    status: "upcoming",
    checklist: [
      { id: "d1", label: "Vé máy bay", isCompleted: false },
      { id: "d2", label: "Khách sạn", isCompleted: false },
      { id: "d3", label: "Lịch trình", isCompleted: false },
    ],
  },
  {
    id: "3",
    title: "Nghỉ dưỡng Hội An",
    dateRange: "10/05/2026 - 13/05/2026",
    days: 3,
    people: 2,
    image:
      "https://images.unsplash.com/photo-1590424753051-bdc978051771?q=80&w=800",
    status: "ongoing",
    checklist: [
      { id: "h1", label: "Vé máy bay", isCompleted: true },
      { id: "h2", label: "Khách sạn", isCompleted: true },
      { id: "h3", label: "Lịch trình", isCompleted: false },
    ],
  },
  {
    id: "4",
    title: "Mùa xuân Hà Nội",
    dateRange: "01/02/2027 - 05/02/2027",
    days: 5,
    people: 2,
    image:
      "https://images.unsplash.com/photo-1533633036440-272e50942e5b?q=80&w=800",
    status: "upcoming",
    checklist: [
      { id: "m1", label: "Vé máy bay", isCompleted: false },
      { id: "m2", label: "Khách sạn", isCompleted: false },
    ],
  },
];

const Dashboard: React.FC = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div className={styles.dashboardLayout}>
      <Sidebar />

      <main className={styles.mainContent}>
        {/* TopBar */}
        <TopBar />

        <div className={styles.pageContent}>
          {/* Row 1: Clock & Map */}
          <div className={styles.topRow}>
            <div className={styles.clockCol}>
              <ClockStation />
            </div>
            <div className={styles.mapCol}>
              <JourneyMap />
            </div>
          </div>

          {/* Row 2: Management Header */}
          <div className={styles.sectionHeader}>
            <div className={styles.headerTitle}>
              <h2>Quản lý lịch trình</h2>
              <p>
                Bạn có <span>{MOCK_TRIPS.length}</span> chuyến đi đang được quản
                lý
              </p>
            </div>

            <div className={styles.tripFilters}>
              <button className={`${styles.filterBtn} ${styles.active}`}>
                Tất cả
              </button>
              <button className={styles.filterBtn}>Sắp tới</button>
              <button className={styles.filterBtn}>Đã đi</button>
            </div>
          </div>

          {/* Row 3: Itinerary Grid */}
          <div className={styles.tripGrid}>
            {MOCK_TRIPS.map((trip) => (
              <TripCard key={trip.id} data={trip} />
            ))}
            <AddTripCard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
