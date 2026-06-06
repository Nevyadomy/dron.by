import { type FormEvent, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Truck,
  ShieldCheck,
  Headphones,
  BadgeCheck,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/atoms/Button";
import { SmartImage } from "@/components/atoms/SmartImage";
import heroDrone from "@/assets/images/home/hero-drone.png";
import heroFpv from "@/assets/images/home/hero-fpv.png";
import heroCinema from "@/assets/images/home/hero-cinema.png";
import catQuad from "@/assets/images/home/cat-quadcopters.jpg";
import catFpv from "@/assets/images/home/cat-fpv.jpg";
import catAcc from "@/assets/images/home/cat-accessories.jpg";
import catParts from "@/assets/images/home/cat-parts.jpg";
import newsBeginner from "@/assets/images/news/news-beginner.jpg";
import newsLaunch from "@/assets/images/news/news-launch.jpg";
import s from "./index.module.css";

const HomePage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [openAdv, setOpenAdv] = useState<number | null>(null);
  const [openCat, setOpenCat] = useState<number | null>(null);
  const [slide, setSlide] = useState(0);

  const heroSlides = [
    {
      title: t("home.hero1Title"),
      text: t("home.hero1Text"),
      cta: t("home.hero1Cta"),
      to: "/catalog",
      img: heroDrone,
      alt: t("home.hero1Alt"),
    },
    {
      title: t("home.hero2Title"),
      text: t("home.hero2Text"),
      cta: t("home.hero2Cta"),
      to: "/catalog?category=FPV-дроны",
      img: heroFpv,
      alt: t("home.hero2Alt"),
    },
    {
      title: t("home.hero3Title"),
      text: t("home.hero3Text"),
      cta: t("home.hero3Cta"),
      to: "/promotions",
      img: heroCinema,
      alt: t("home.hero3Alt"),
    },
  ];

  const advantages = [
    {
      icon: <Truck size={22} />,
      title: t("home.adv1Title"),
      text: t("home.adv1Text"),
      details: t("home.adv1Details"),
    },
    {
      icon: <ShieldCheck size={22} />,
      title: t("home.adv2Title"),
      text: t("home.adv2Text"),
      details: t("home.adv2Details"),
    },
    {
      icon: <Headphones size={22} />,
      title: t("home.adv3Title"),
      text: t("home.adv3Text"),
      details: t("home.adv3Details"),
    },
    {
      icon: <BadgeCheck size={22} />,
      title: t("home.adv4Title"),
      text: t("home.adv4Text"),
      details: t("home.adv4Details"),
    },
  ];

  const categories = [
    {
      kicker: t("home.cat1Kicker"),
      title: t("home.cat1Title"),
      text: t("home.cat1Text"),
      img: catQuad,
      to: "/catalog?category=Квадрокоптеры",
      details: t("home.cat1Details"),
    },
    {
      kicker: t("home.cat2Kicker"),
      title: t("home.cat2Title"),
      text: t("home.cat2Text"),
      img: catFpv,
      to: "/catalog?category=FPV-дроны",
      details: t("home.cat2Details"),
    },
    {
      kicker: t("home.cat3Kicker"),
      title: t("home.cat3Title"),
      text: t("home.cat3Text"),
      img: catAcc,
      to: "/catalog?category=Аксессуары",
      details: t("home.cat3Details"),
    },
    {
      kicker: t("home.cat4Kicker"),
      title: t("home.cat4Title"),
      text: t("home.cat4Text"),
      img: catParts,
      to: "/catalog?category=Запчасти",
      details: t("home.cat4Details"),
    },
  ];

  const reviews = [
    {
      text: t("home.review1Text"),
      name: t("home.review1Name"),
      date: t("home.review1Date"),
    },
    {
      text: t("home.review2Text"),
      name: t("home.review2Name"),
      date: t("home.review2Date"),
    },
    {
      text: t("home.review3Text"),
      name: t("home.review3Name"),
      date: t("home.review3Date"),
    },
  ];

  const news = [
    {
      tag: t("home.news1Tag"),
      title: t("home.news1Title"),
      text: t("home.news1Text"),
      img: newsBeginner,
      to: "/news",
    },
    {
      tag: t("home.news2Tag"),
      title: t("home.news2Title"),
      text: t("home.news2Text"),
      img: newsLaunch,
      to: "/news",
    },
  ];

  const slidesCount = heroSlides.length;

  useEffect(() => {
    const id = window.setInterval(() => {
      setSlide((s) => (s + 1) % slidesCount);
    }, 6000);
    return () => window.clearInterval(id);
  }, [slidesCount]);

  const goPrev = () => setSlide((s) => (s - 1 + slidesCount) % slidesCount);
  const goNext = () => setSlide((s) => (s + 1) % slidesCount);

  const touchStartX = useRef<number | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) (dx < 0 ? goNext : goPrev)();
    touchStartX.current = null;
  };

  const handleSubscribe = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    alert(t("home.newsletterThanks", { email }));
    setEmail("");
  };

  return (
    <div className={s.page}>
      {/* HERO */}
      <section
        className={s.heroWrap}
        aria-roledescription="carousel"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <button
          type="button"
          className={`${s.heroArrow} ${s.heroArrowLeft}`}
          onClick={goPrev}
          aria-label={t("pagination.previousAria")}
          title={t("pagination.previous")}
        >
          <ChevronLeft size={22} />
        </button>
        <div className={s.heroViewport}>
          <div
            className={s.heroTrack}
            style={{ transform: `translateX(-${slide * 100}%)` }}
          >
            {heroSlides.map((sl, i) => (
              <div key={sl.title} className={s.hero} aria-hidden={i !== slide}>
                <div>
                  <h1 className={s.heroTitle}>{sl.title}</h1>
                  <p className={s.heroText}>{sl.text}</p>
                  <div className={s.heroActions}>
                    <Link to={sl.to}>
                      <Button size="lg">{sl.cta}</Button>
                    </Link>
                  </div>
                </div>
                <SmartImage
                  src={sl.img}
                  alt={sl.alt}
                  className={s.heroImg}
                  loading={i === 0 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>
        </div>
        <button
          type="button"
          className={`${s.heroArrow} ${s.heroArrowRight}`}
          onClick={goNext}
          aria-label={t("pagination.nextAria")}
          title={t("pagination.next")}
        >
          <ChevronRight size={22} />
        </button>
        <div className={s.heroDots} role="tablist">
          {heroSlides.map((sl, i) => (
            <button
              key={sl.title}
              type="button"
              className={`${s.heroDot} ${i === slide ? s.heroDotActive : ""}`}
              onClick={() => setSlide(i)}
              aria-label={t("home.goToSlide", { number: i + 1 })}
              aria-selected={i === slide}
              role="tab"
              title={t("home.slideTitle", { number: i + 1 })}
            />
          ))}
        </div>
      </section>

      {/* ADVANTAGES */}
      <section>
        <header className={s.sectionHead}>
          <span className={s.kicker}>{t("home.whyUs")}</span>
          <h2 className={s.sectionTitle}>{t("home.advantagesTitle")}</h2>
          <p className={s.sectionSub}>{t("home.advantagesSub")}</p>
        </header>
        <div className={s.advGrid}>
          {advantages.map((a, i) => (
            <div key={a.title} className={s.advCard}>
              <div className={s.advIcon}>{a.icon}</div>
              <h3 className={s.advTitle}>{a.title}</h3>
              <p className={s.advText}>{a.text}</p>
              <Button
                size="sm"
                onClick={() => setOpenAdv(openAdv === i ? null : i)}
              >
                {openAdv === i ? t("home.collapse") : t("home.more")}
              </Button>
              {openAdv === i && <p className={s.advDetails}>{a.details}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section>
        <header className={s.sectionHead}>
          <span className={s.kicker}>{t("home.categories")}</span>
          <h2 className={s.sectionTitle}>{t("home.catalogTitle")}</h2>
          <p className={s.sectionSub}>{t("home.catalogSub")}</p>
        </header>
        <div className={s.catList}>
          {categories.map((c, idx) => {
            const reverse = idx % 2 === 1;
            const isOpen = openCat === idx;
            const body = (
              <div className={s.catBody}>
                <span className={s.catKicker}>{c.kicker}</span>
                <h3 className={s.catTitle}>{c.title}</h3>
                <p className={s.catText}>{c.text}</p>
                <div className={s.catActions}>
                  <Link to={c.to}>
                    <Button>{t("home.toCatalog")}</Button>
                  </Link>
                  <Button
                    variant="secondary"
                    onClick={() => setOpenCat(isOpen ? null : idx)}
                  >
                    {isOpen ? t("home.collapse") : t("home.more")}
                  </Button>
                </div>
                {isOpen && <p className={s.catDetails}>{c.details}</p>}
              </div>
            );
            return (
              <article key={c.title} className={s.catRow}>
                {reverse ? (
                  <>
                    {body}
                    <SmartImage
                      src={c.img}
                      alt={c.title}
                      className={s.catImg}
                      loading="lazy"
                    />
                  </>
                ) : (
                  <>
                    <SmartImage
                      src={c.img}
                      alt={c.title}
                      className={s.catImg}
                      loading="lazy"
                    />
                    {body}
                  </>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* REVIEWS */}
      <section>
        <header className={s.sectionHead}>
          <span className={s.kicker}>{t("home.reviews")}</span>
          <h2 className={s.sectionTitle}>{t("home.reviews")}</h2>
          <p className={s.sectionSub}>{t("home.reviewsSub")}</p>
        </header>
        <div className={s.revGrid}>
          {reviews.map((r) => (
            <div key={r.name} className={s.revCard}>
              <div className={s.stars} aria-label="5 из 5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={22}
                    fill="currentColor"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <p className={s.revText}>{r.text}</p>
              <div className={s.revAuthor}>
                <div className={s.revAvatar}>{r.name.charAt(0)}</div>
                <div>
                  <div className={s.revName}>{r.name}</div>
                  <div className={s.revDate}>{r.date}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NEWS */}
      <section>
        <header className={s.sectionHead}>
          <span className={s.kicker}>{t("home.blog")}</span>
          <h2 className={s.sectionTitle}>{t("home.newsTitle")}</h2>
          <p className={s.sectionSub}>{t("home.newsSub")}</p>
        </header>
        <div className={s.newsList}>
          {news.map((n) => (
            <article key={n.title} className={s.newsCard}>
              <SmartImage
                src={n.img}
                alt={n.title}
                className={s.newsImg}
                loading="lazy"
              />
              <div className={s.newsBody}>
                <span className={s.newsTag}>{n.tag}</span>
                <h3 className={s.newsTitle}>{n.title}</h3>
                <p className={s.newsText}>{n.text}</p>
                <div className={s.newsActions}>
                  <Link to={n.to}>
                    <Button size="sm">{t("home.readMore")}</Button>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className={s.newsletter}>
        <h2 className={s.sectionTitle}>{t("home.newsletterTitle")}</h2>
        <p className={s.sectionSub}>{t("home.newsletterSub")}</p>
        <form className={s.newsletterForm} onSubmit={handleSubscribe}>
          <input
            type="email"
            placeholder={t("home.newsletterPlaceholder")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={s.newsletterInput}
            required
          />
          <Button type="submit">{t("home.newsletterSubscribe")}</Button>
        </form>
      </section>
    </div>
  );
};

export default HomePage;
