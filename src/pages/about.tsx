import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useEmblaCarousel from "embla-carousel-react";
import CountUp from "react-countup";
import { ArrowRight } from "lucide-react";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/utils/cn";
import heroImg from "@/assets/images/about/hero.jpg";
import s from "./about.module.css";

const BRANDS = ["DJI", "Autel", "BetaFPV", "GoPro", "Insta360", "PGYTECH"];

const TIMELINE = [
  {
    year: "2024",
    title: "Старт DRON.BY",
    text: "Запустили онлайн-витрину и собрали первую команду пилотов-консультантов.",
  },
  {
    year: "2025",
    title: "Сервис и обучение",
    text: "Открыли мастерскую полного цикла и школу пилотов для новичков и профи.",
  },
  {
    year: "2026",
    title: "Прямые поставки",
    text: "Подписали дистрибьюторские соглашения с ключевыми мировыми брендами.",
  },
];

const STATS = [
  { value: 12000, suffix: "+", label: "Довольных клиентов" },
  { value: 350, suffix: "+", label: "Моделей в каталоге" },
  { value: 24, suffix: "/7", label: "Поддержка пилотов" },
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
  return (
    <div
      ref={ref}
      className={cn(s.statCard, s.reveal, visible && s.revealVisible)}
    >
      <div className={s.statNum}>
        {visible ? <CountUp end={value} duration={2} separator=" " /> : 0}
        {suffix}
      </div>
      <div className={s.statLabel}>{label}</div>
    </div>
  );
};

const AboutPage = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
  });
  const [selected, setSelected] = useState(0);

  useEffect(() => {
    document.title = "О нас | DRON.BY — интернет-магазин дронов";
    const meta =
      document.querySelector('meta[name="description"]') ??
      Object.assign(document.createElement("meta"), { name: "description" });
    meta.setAttribute(
      "content",
      "DRON.BY — официальный магазин квадрокоптеров и аксессуаров в Беларуси. История, цифры, бренды и галерея.",
    );
    if (!meta.parentElement) document.head.appendChild(meta);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    const onSel = () => setSelected(emblaApi.selectedScrollSnap());
    onSel();
    emblaApi.on("select", onSel);
    return () => {
      emblaApi.off("select", onSel);
    };
  }, [emblaApi]);

  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi],
  );

  return (
    <div>
      <section
        className={s.hero}
        style={{ ["--hero-bg" as string]: `url(${heroImg})` }}
      >
        <div className={s.heroContent}>
          <h1 className={s.heroSlogan}>Дроны без компромиссов</h1>
          <p className={s.heroText}>
            DRON.BY — это магазин, сервис и сообщество пилотов в одном месте.
            Выбираем технику, которой доверяем сами, и помогаем поднять её в
            воздух.
          </p>
          <Link to="/catalog" className={s.heroCta}>
            Перейти в каталог <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <div className="page-container" style={{ paddingTop: 16 }}>
        <Breadcrumbs
          items={[{ label: "Главная", to: "/" }, { label: "О нас" }]}
        />
      </div>

      <section className={s.section}>
        <h2 className={s.sectionTitle}>Наша история</h2>
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
        <h2 className={s.sectionTitle}>Технологии и партнёры</h2>
        <div className={s.marquee}>
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
        <h2 className={s.sectionTitle}>Цифры, которыми мы гордимся</h2>
        <div className={s.stats}>
          {STATS.map((st) => (
            <Stat key={st.label} {...st} />
          ))}
        </div>
      </section>

      <section className={s.section}>
        <h2 className={s.sectionTitle}>Полёты наших пилотов</h2>
        <div className={s.galleryWrap} ref={emblaRef}>
          <div className={s.gallery}>
            {GALLERY.map((src, i) => (
              <div key={src + i} className={s.galleryItem}>
                <img src={src} alt={`Aerial photo ${i + 1}`} loading="lazy" />
                <span className={s.overlay}>Смотреть</span>
              </div>
            ))}
          </div>
        </div>
        <div className={s.dots}>
          {GALLERY.map((_, i) => (
            <button
              key={i}
              type="button"
              className={cn(s.dot, selected === i && s.dotActive)}
              aria-label={`К фото ${i + 1}`}
              onClick={() => scrollTo(i)}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default AboutPage;

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
