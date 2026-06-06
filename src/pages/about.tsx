import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { Lightbox } from "@/components/organisms/Lightbox";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/utils/cn";
import heroImg from "@/assets/images/about/hero.jpg";
import s from "./about.module.css";

const BRANDS = ["DJI", "Autel", "BetaFPV", "GoPro", "Insta360", "PGYTECH"];

const AboutPage = () => {
  const { t } = useTranslation();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [selected, setSelected] = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const pausedRef = useRef(false);
  const intervalRef = useRef<number | null>(null);

  const TIMELINE = [
    {
      year: "2024",
      title: t("about.timeline2024Title"),
      text: t("about.timeline2024Text"),
    },
    {
      year: "2025",
      title: t("about.timeline2025Title"),
      text: t("about.timeline2025Text"),
    },
    {
      year: "2026",
      title: t("about.timeline2026Title"),
      text: t("about.timeline2026Text"),
    },
  ];

  const STATS = [
    { value: 12000, suffix: "+", label: t("about.clients") },
    { value: 350, suffix: "+", label: t("about.models") },
    { value: 24, suffix: "/7", label: t("about.support") },
  ];

  const GALLERY = [
    "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=900&q=80",
    "https://images.unsplash.com/photo-1508444845599-5c89863b1c44?w=900&q=80",
    "https://images.unsplash.com/photo-1521405924368-64c5b84bec60?w=900&q=80",
    "https://images.unsplash.com/photo-1524143986875-3b098d78b363?w=900&q=80",
    "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?w=900&q=80",
    "https://images.unsplash.com/photo-1579829366248-204fe8413f31?w=900&q=80",
    "https://images.unsplash.com/photo-1506947411487-a56738267384?w=900&q=80",
    "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=900&q=80",
    "https://images.unsplash.com/photo-1517059224940-d4af9eec41b7?w=900&q=80",
    "https://images.unsplash.com/photo-1500627964684-141351970a7f?w=900&q=80",
  ];

  useEffect(() => {
    document.title = `${t("about.title")} | DRON.BY`;
  }, [t]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSel = () => setSelected(emblaApi.selectedScrollSnap());
    onSel();
    emblaApi.on("select", onSel);
    return () => {
      emblaApi.off("select", onSel);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const tick = () => {
      if (!pausedRef.current && !lightbox) emblaApi.scrollNext();
    };
    intervalRef.current = window.setInterval(tick, 3500);
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
    };
  }, [emblaApi, lightbox]);

  const pause = useCallback(() => {
    pausedRef.current = true;
  }, []);
  const resume = useCallback(() => {
    pausedRef.current = false;
  }, []);

  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi],
  );
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div
      className={s.pageWrap}
      style={{ ["--page-bg" as string]: `url(${heroImg})` }}
    >
      <div className={s.fixedBg} aria-hidden />
      <div
        className="page-container"
        style={{
          paddingTop: 16,
          paddingBottom: 0,
          position: "relative",
          zIndex: 1,
        }}
      >
        <Breadcrumbs
          items={[
            { label: t("breadcrumbs.home"), to: "/" },
            { label: t("about.title") },
          ]}
        />
      </div>
      <section className={s.hero}>
        <div className={s.heroContent}>
          <h1 className={s.heroSlogan}>{t("about.heroTitle")}</h1>
          <p className={s.heroText}>{t("about.heroText")}</p>
          <Link to="/catalog" className={s.heroCta}>
            {t("about.heroCta")} <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <section className={s.section}>
        <h2 className={s.sectionTitle}>{t("about.history")}</h2>
        <div className={s.timeline}>
          {TIMELINE.map((it, i) => (
            <FragmentWithDot key={it.year} isLast={i === TIMELINE.length - 1}>
              <Reveal delay={i * 120}>
                <div className={s.tlCard}>
                  <div className={s.tlYear}>{it.year}</div>
                  <div className={s.tlTitle}>{it.title}</div>
                  <p className={s.tlText}>{it.text}</p>
                </div>
              </Reveal>
            </FragmentWithDot>
          ))}
        </div>
      </section>

      <section className={s.section}>
        <h2 className={s.sectionTitle}>{t("about.techPartners")}</h2>
        <div className={cn(s.marquee, s.marqueeStatic)}>
          <div className={s.marqueeTrack}>
            {[...BRANDS, ...BRANDS, ...BRANDS, ...BRANDS].map((b, i) => (
              <span key={`${b}-${i}`} className={s.brand}>
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className={s.section}>
        <h2 className={s.sectionTitle}>{t("about.statsTitle")}</h2>
        <div className={s.stats}>
          {STATS.map((st) => (
            <Stat key={st.label} {...st} />
          ))}
        </div>
      </section>

      <section className={s.section}>
        <h2 className={s.sectionTitle}>{t("about.galleryTitle")}</h2>
        <div
          className={s.galleryShell}
          onMouseEnter={pause}
          onMouseLeave={resume}
          onTouchStart={pause}
          onTouchEnd={resume}
        >
          <button
            type="button"
            className={cn(s.galleryNav, s.galleryNavPrev)}
            onClick={scrollPrev}
            aria-label={t("pagination.previousAria")}
            title={t("pagination.previous")}
          >
            <ChevronLeft size={22} />
          </button>
          <div className={s.galleryWrap} ref={emblaRef}>
            <div className={s.gallery}>
              {GALLERY.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  className={s.galleryItem}
                  onClick={() => setLightbox(src)}
                  aria-label={t("about.openPhoto", { number: i + 1 })}
                  title={t("about.openPhotoTitle")}
                >
                  <img src={src} alt={`Aerial photo ${i + 1}`} loading="lazy" />
                  <span className={s.overlay}>{t("about.view")}</span>
                </button>
              ))}
            </div>
          </div>
          <button
            type="button"
            className={cn(s.galleryNav, s.galleryNavNext)}
            onClick={scrollNext}
            aria-label={t("pagination.nextAria")}
            title={t("pagination.next")}
          >
            <ChevronRight size={22} />
          </button>
        </div>
        <div className={s.dots}>
          {GALLERY.map((_, i) => (
            <button
              key={i}
              type="button"
              className={cn(s.dot, selected === i && s.dotActive)}
              aria-label={t("about.goToPhoto", { number: i + 1 })}
              onClick={() => scrollTo(i)}
            />
          ))}
        </div>
      </section>

      {lightbox && (
        <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
};

// Вспомогательные компоненты остаются без изменений
const Reveal = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => {
  const { ref, visible } = useReveal<HTMLDivElement>();
  return (
    <div
      ref={ref}
      className={cn(s.reveal, visible && s.revealVisible)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

const FragmentWithDot = ({
  children,
  isLast,
}: {
  children: React.ReactNode;
  isLast: boolean;
}) => (
  <>
    {children}
    {!isLast && <span className={s.tlDot} aria-hidden />}
  </>
);

const Stat = ({
  value,
  suffix,
  label,
}: {
  value: number;
  suffix: string;
  label: string;
}) => {
  const { ref, visible } = useReveal<HTMLDivElement>(0.4);
  const n = useCountUp(value, visible);
  return (
    <div
      ref={ref}
      className={cn(s.statCard, s.reveal, visible && s.revealVisible)}
    >
      <div className={s.statNum}>
        {n.toLocaleString("ru-RU")}
        {suffix}
      </div>
      <div className={s.statLabel}>{label}</div>
    </div>
  );
};

function useCountUp(target: number, active: boolean, duration = 2000) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return val;
}

export default AboutPage;
