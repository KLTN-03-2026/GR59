import React from 'react';
import { ArrowRight, Clock } from "@phosphor-icons/react";
import styles from './FeaturedPost.module.scss';
import type { NewsItem } from '../../types';

interface Props {
  data: NewsItem;
}

const FeaturedPost: React.FC<Props> = ({ data }) => {
  return (
    <section className={styles.container} data-aos="fade-up">
      <div className={styles.imageBox}>
        <img src={data.image} alt={data.title} />
        <div className={styles.tagOverlay}>{data.category}</div>
      </div>
      <div className={styles.content}>
        <div className={styles.meta}>
          <span className={styles.date}>{data.date}</span>
          <span className={styles.divider}>•</span>
          <span className={styles.readTime}>
            <Clock size={16} weight="bold" />
            {data.readTime}
          </span>
        </div>
        <h1 className={styles.title}>{data.title}</h1>
        <p className={styles.description}>{data.excerpt}</p>
        <button className={styles.btnAction}>
          Đọc chi tiết <ArrowRight size={20} weight="bold" />
        </button>
      </div>
    </section>
  );
};

export default FeaturedPost;