import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";
import styles from "./ProgressBar.module.css";

export const ProgressBar = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Вычисляем прогресс скролла
      const winScroll = window.scrollY;
      const height = document.documentElement.scrollHeight - window.innerHeight;
      const scrolled = (winScroll / height) * 100;
      setScrollProgress(scrolled);

      // Показываем кнопку после 300px скролла
      setShowButton(winScroll > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Прогресс-бар вверху страницы */}
      <div className={styles.progressBarWrapper}>
        <div
          className={styles.progressBar}
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Кнопка "Наверх" */}
      {showButton && (
        <button
          type="button"
          className={styles.scrollTopBtn}
          onClick={scrollToTop}
          aria-label="Наверх"
          title="Наверх"
        >
          <ChevronUp size={24} />
        </button>
      )}
    </>
  );
};
