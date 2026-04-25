import React, { useState, useEffect } from 'react';
import { CaretUp } from '@phosphor-icons/react';
import styles from './ScrollToTop.module.scss';

const ScrollToTop: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className={styles.scrollToTop}>
      {isVisible && (
        <div onClick={scrollToTop} className={styles.button} title="Lên đầu trang">
          <CaretUp size={24} weight="bold" />
        </div>
      )}
    </div>
  );
};

export default ScrollToTop;
