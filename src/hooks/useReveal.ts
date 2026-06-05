import { useEffect, useRef, useState } from "react";

/**
 * IntersectionObserver-based "reveal on scroll" hook.
 * Returns a ref to attach to the element and a boolean that flips to true
 * the first time the element enters the viewport.
 */
export function useReveal<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);

  const [visible, setVisible] = useState(() => {
    // Если IntersectionObserver не поддерживается — показываем сразу
    if (typeof IntersectionObserver === "undefined") return true;
    return false;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Если уже видно или нет поддержки — не создаём observer
    if (visible) return;
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, visible]); // visible добавлен в зависимости

  return { ref, visible };
}
