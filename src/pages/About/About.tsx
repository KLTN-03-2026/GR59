import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Users, Target, Heart, GlobeHemisphereWest } from "phosphor-react";
import styles from "./About.module.scss";
// Sử dụng các ảnh có sẵn làm placeholder
import heroImg from "../../assets/images/img/hoian.jpg"; 

const About: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-out-quad",
    });
  }, []);

  const team = [
    { name: "Nguyễn Văn A", role: "Nhà Sáng Lập & CEO", image: "https://ui-avatars.com/api/?name=Nguyen+Van+A&background=random&size=150" },
    { name: "Trần Thị B", role: "Giám Đốc Trải Nghiệm", image: "https://ui-avatars.com/api/?name=Tran+Thi+B&background=random&size=150" },
    { name: "Lê Văn C", role: "Kỹ Sư AI", image: "https://ui-avatars.com/api/?name=Le+Van+C&background=random&size=150" },
  ];

  const values = [
    { icon: <GlobeHemisphereWest weight="fill" />, title: "Khám phá chân thực", desc: "Đưa bạn đến với những ngóc ngách chưa được khám phá." },
    { icon: <Target weight="fill" />, title: "Cá nhân hóa tối đa", desc: "Mọi lịch trình đều được may đo riêng cho bạn bằng AI." },
    { icon: <Heart weight="fill" />, title: "Lan tỏa giá trị", desc: "Hỗ trợ cộng đồng địa phương thông qua du lịch bền vững." },
    { icon: <Users weight="fill" />, title: "Cộng đồng ý nghĩa", desc: "Nơi chia sẻ đam mê xê dịch của hàng ngàn bạn trẻ." },
  ];

  return (
    <div className={styles.aboutPage}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroOverlay}></div>
        <img src={heroImg || "https://images.unsplash.com/photo-1528127269322-539801943592?q=80&w=2070&auto=format&fit=crop"} alt="Vietnam landscape" className={styles.heroImg} />
        <div className={styles.heroContent} data-aos="fade-up">
          <div className={styles.tagline}>Câu Chuyện Của Chúng Tôi</div>
          <h1 className={styles.title}>Mang Linh Hồn Địa Phương Vào Từng Chuyến Đi</h1>
          <p className={styles.description}>LocalGoAI ra đời với sứ mệnh kết nối người du lịch và những trải nghiệm bản địa chân thực nhất thông qua sức mạnh của Trí Tuệ Nhân Tạo.</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className={styles.missionSection}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.textContent} data-aos="fade-right">
              <h2>Cách chúng tôi định hình lại du lịch</h2>
              <p>
                Trượt qua những điểm đến đông đúc, LocalGoAI dẫn lối bạn đến những <strong>trải nghiệm độc bản</strong>. Chúng tôi tin rằng, du lịch không chỉ là đi để thấy, mà là đi để cảm nhận, để sống như một người bản địa thực thụ.
              </p>
              <p>
                Với công nghệ AI tiên tiến, chúng tôi loại bỏ thời gian lên kế hoạch chán ngắt, giúp bạn tập trung hoàn toàn vào việc thưởng thức chuyến hành trình của mình.
              </p>
            </div>
            <div className={styles.imageContent} data-aos="fade-left">
              <div className={styles.imgWrapper}>
                <img src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=2070&auto=format&fit=crop" alt="Local food" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={styles.valuesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader} data-aos="fade-up">
            <h2>Giá Trị Cốt Lõi</h2>
            <p>Những nguyên tắc định hướng mọi hoạt động của LocalGoAI.</p>
          </div>
          <div className={styles.valuesGrid}>
            {values.map((val, idx) => (
              <div key={idx} className={styles.valueCard} data-aos="zoom-in" data-aos-delay={idx * 100}>
                <div className={styles.iconBox}>{val.icon}</div>
                <h3>{val.title}</h3>
                <p>{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={styles.teamSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader} data-aos="fade-up">
            <h2>Đội Ngũ Sáng Lập</h2>
            <p>Những con người đam mê xê dịch và công nghệ đứng sau LocalGoAI.</p>
          </div>
          <div className={styles.teamGrid}>
            {team.map((member, idx) => (
              <div key={idx} className={styles.teamCard} data-aos="fade-up" data-aos-delay={idx * 150}>
                <div className={styles.avatarWrapper}>
                  <img src={member.image} alt={member.name} />
                </div>
                <h3>{member.name}</h3>
                <p>{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
