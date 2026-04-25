import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import AOS from "aos"; // Import AOS
import "aos/dist/aos.css"; // Import file CSS của AOS
import ScrollToTop from "../ScrollToTop/ScrollToTop";

const Layout: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000, // Bạn có thể chỉnh thời gian mặc định ở đây
    });
    AOS.refresh(); // Làm mới AOS để đảm bảo nó nhận các phần tử mới
  }, []);

  return (
    <div className="app-layout">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
};

export default Layout;
