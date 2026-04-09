import React, { useState } from "react";
import styles from "./OverviewTab.module.scss";
import type { Destination } from "../../DestinationDetail"; // Import interface từ file chính

const OverviewTab: React.FC<{ data: Destination }> = ({ data }) => {
  const [mainImage, setMainImage] = useState(data.gallery[0]);

  return (
    <div data-aos="fade-up">
      <section className={styles.destSection}>
        <h2 className={styles.destSectionTitle}>Giới thiệu</h2>
        <div className={styles.destDescription}>
          {data.description.split("\n").map((text, index) => (
            <p key={index} className={styles.paragraph}>
              {text}
            </p>
          ))}
        </div>
      </section>

      <section className={styles.destSection}>
        <h2 className={styles.destSectionTitle}>Hình ảnh</h2>
        <div className={styles.photoGallery}>
          <div className={styles.galleryMain}>
            <img src={mainImage} alt="Main" />
          </div>
          <div className={styles.galleryThumbs}>
            {data.gallery.map((img: string, idx: number) => (
              <img
                key={idx}
                src={img}
                alt={`Thumb ${idx}`}
                className={mainImage === img ? styles.activeThumb : ""}
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default OverviewTab;
