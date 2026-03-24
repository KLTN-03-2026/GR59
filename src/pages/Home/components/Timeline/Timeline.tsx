import React from "react";
import {
  CalendarBlank,
  MapPin,
  ForkKnife,
  Bed,
  CheckCircle,
} from "phosphor-react";
import styles from "../../Home.module.scss"; // Tạm thời dùng chung file styles cũ của bạn

const Timeline = () => {
  const steps = [
    {
      icon: <CalendarBlank weight="bold" />,
      title: "Lên kế hoạch",
      desc: "Tự động hóa lịch trình",
      color: styles.iconBlue,
    },
    {
      icon: <MapPin weight="bold" />,
      title: "Địa điểm",
      desc: "Khám phá điểm đến",
      color: styles.iconGreen,
    },
    {
      icon: <ForkKnife weight="bold" />,
      title: "Quán ăn",
      desc: "Thưởng thức đặc sản",
      color: styles.iconYellow,
    },
    {
      icon: <Bed weight="bold" />,
      title: "Khách sạn",
      desc: "Nghỉ dưỡng tiện nghi",
      color: styles.iconRed,
    },
    {
      icon: <CheckCircle weight="bold" />,
      title: "Hoàn tất",
      desc: "Sẵn sàng cho chuyến đi!",
      color: styles.iconPurple,
    },
  ];

  return (
    <section className={styles.timeline}>
      <div className={styles.container}>
        <div className={styles.timelineGrid}>
          {steps.map((step, idx) => (
            <div
              key={idx}
              className={styles.timelineItem}
              data-aos="fade-up"
              data-aos-delay={idx * 100}
            >
              <div className={`${styles.iconBox} ${step.color}`}>
                {step.icon}
              </div>
              <h3>{step.title}</h3>
              <p>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
