import React from "react";
import { Lightning, Target, CurrencyCircleDollar } from "phosphor-react";
import styles from "../../Home.module.scss"; // Tạm thời dùng chung file styles cũ của bạn

const WhyUs: React.FC = () => {
  const cards = [
    {
      icon: <Lightning weight="fill" />,
      title: "Tốc độ chớp nhoáng",
      desc: "Nhận được kế hoạch chi tiết cho chuyến đi nhiều ngày chỉ trong vài giây.",
      delay: "100"
    },
    {
      icon: <Target weight="fill" />,
      title: "Cá nhân hóa 100%",
      desc: "Lịch trình được thiết kế may đo dựa trên sở thích và ngân sách của riêng bạn.",
      delay: "300"
    },
    {
      icon: <CurrencyCircleDollar weight="fill" />,
      title: "Tối ưu chi phí",
      desc: "AI tự động tìm kiếm và đề xuất lộ trình với chi phí hợp lý nhất.",
      delay: "500"
    }
  ];

  return (
    <section className={styles.whyUs}>
      <div className={styles.container}>
        <div data-aos="fade-up">
          <h2 className={styles.sectionTitle}>
            Tại sao chọn <br />
            <span className={styles.gradientText}>chúng tôi?</span>
          </h2>
          <p className={styles.sectionDescription1}>
            Sự kết hợp hoàn hảo giữa công nghệ AI và dữ liệu du lịch khổng lồ.
          </p>
        </div>

        <div className={styles.whyUsGrid}>
          {cards.map((card, index) => (
            <div key={index} className={styles.glassCard} data-aos="fade-up" data-aos-delay={card.delay}>
              <div className={styles.glassIcon}>{card.icon}</div>
              <h3>{card.title}</h3>
              <p>{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;