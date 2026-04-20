import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CaretLeft, CalendarBlank, Clock, User, Eye } from "@phosphor-icons/react";
import styles from './NewsDetail.module.scss';
import { getNewsDetail } from '../../services/newsService';
import type { NewsItem } from '../News/types';

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchDetail = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const res = await getNewsDetail(id);
        if (res.data && res.data.status === 200 && res.data.data) {
          setNewsItem(res.data.data as NewsItem);
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết tin tức:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  if (isLoading) {
    return (
      <div className={styles.newsDetailPage}>
        <div className={styles.container}>
          <div className={styles.loadingState}>Đang tải bài viết...</div>
        </div>
      </div>
    );
  }

  if (!newsItem) {
    return (
      <div className={styles.newsDetailPage}>
        <div className={styles.container}>
          <div className={styles.loadingState}>
            Không tìm thấy bài viết.
            <button onClick={() => navigate('/news')} style={{ marginLeft: 10, cursor: 'pointer', color: '#00a8a2', border: 'none', background: 'none', fontSize: '1.2rem', textDecoration: 'underline' }}>
              Quay lại trang Tin tức
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Format content text if it doesn't contain HTML tags but has newlines
  const formatContent = (content: string) => {
    if (!content) return "";
    // Check if it already has html tags like <p> or <br>
    if (/<[a-z][\s\S]*>/i.test(content)) {
      return content;
    }
    // Otherwise replace newlines with <br />
    return content.replace(/\n/g, '<br />');
  };

  return (
    <div className={styles.newsDetailPage}>
      <div className={styles.container}>
        {newsItem.image && (
          <img src={newsItem.image} alt={newsItem.title} className={styles.coverImage} />
        )}
        
        <div className={styles.contentWrapper}>
          <button 
            onClick={() => navigate('/news')} 
            style={{ display: 'flex', alignItems: 'center', gap: 5, border: 'none', background: 'none', color: '#718096', cursor: 'pointer', marginBottom: 20, fontSize: 15, fontWeight: 600 }}
          >
            <CaretLeft size={20} weight="bold" /> Quay lại
          </button>

          <div className={styles.categoryTag}>{newsItem.category}</div>
          
          <h1 className={styles.title}>{newsItem.title}</h1>
          
          <div className={styles.meta}>
            {newsItem.authorName && (
              <div className={styles.metaItem}>
                <User size={18} weight="bold" /> {newsItem.authorName}
              </div>
            )}
            <div className={styles.metaItem}>
              <CalendarBlank size={18} weight="bold" /> 
              {newsItem.createdAt 
                ? new Date(newsItem.createdAt).toLocaleDateString('vi-VN')
                : newsItem.date || "---"}
            </div>
            <div className={styles.metaItem}>
              <Clock size={18} weight="bold" /> {newsItem.readTime}
            </div>
            {newsItem.viewCount !== undefined && (
              <div className={styles.metaItem}>
                <Eye size={18} weight="bold" /> {newsItem.viewCount} lượt xem
              </div>
            )}
          </div>

          {newsItem.excerpt && (
            <div className={styles.excerpt}>{newsItem.excerpt}</div>
          )}

          <div 
            className={styles.htmlContent} 
            dangerouslySetInnerHTML={{ __html: formatContent(newsItem.content || "") }} 
          />
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;
