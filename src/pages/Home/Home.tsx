import React, { useEffect } from "react";
import VideoHome from "../../assets/video/Da_Nang.mp4";

import AOS from "aos";
import "aos/dist/aos.css";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
// import { Vietnamese } from "flatpickr/dist/l10n/vn.js";
import styles from "./Home.module.scss";
import FeaturesMap from "./components/FeaturesMap/FeaturesMap";
import Timeline from "./components/Timeline/Timeline";
import WhyUs from "./components/WhyUs/WhyUs";
import ExpertItinerary from "./components/ExpertItinerary/ExpertItinerary";
import Testimonials from "./components/Testimonials/Testimonials";
import HighlightLocations from "./components/HighlightLocations/HighlightLocations";
import CTASection from "./components/CTASection/CTASection";
import Hero from "./components/Hero/Hero";

const Home: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true, // Chỉ chạy hiệu ứng một lần khi cuộn qua
    });

    flatpickr("#dates-input", {
      mode: "range",
      minDate: "today",
      dateFormat: "d/m/Y",
      // locale: Vietnamese
    });
  }, []);

  return (
    <div className={styles.home}>
      <div className={styles.main}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <video autoPlay loop muted className={styles.video}>
            <source src={VideoHome} type="video/mp4" />
            Trình duyệt của bạn không hỗ trợ thẻ video.
          </video>
          <Hero />
        </section>

        {/* Timeline Section */}
        <section className={styles.timeline}>
          <div className={styles.container}>
            <Timeline />
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className={styles.whyUs}>
          <div className={styles.container}>
            <WhyUs />
          </div>
        </section>

        {/* expertItinerary */}
        <section className={styles.expertItinerary}>
          <div className={`${styles.container} ${styles.expertContainer}`}>
            <ExpertItinerary />
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.features}>
          <div className={styles.container}>
            <FeaturesMap />
          </div>
        </section>
        {/* Highlight Locations */}
        <section className={styles.highlightLocations}>
          <div className={styles.container}>
            <HighlightLocations
              titlePrimary="Gợi ý"
              titleHighlight="nổi bật"
              description="Khám phá những điểm đến được yêu thích nhất bởi cộng đồng."
            />
          </div>
        </section>

        {/* Testimonials Section */}
        <section className={styles.testimonials}>
          <div className={styles.container}>
            <Testimonials />
          </div>
        </section>

        {/* Bottom CTA */}
        <section className={styles.ctaSection}>
          <div className={styles.container}>
            <CTASection />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
