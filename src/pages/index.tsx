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

const heroSlides = [
  {
    title: "Взгляните на мир с высоты",
    text: "Профессиональные квадрокоптеры, FPV-дроны, аксессуары и запчасти. Официальная гарантия, доставка по Беларуси и сервисная поддержка пилотов любого уровня.",
    cta: "В каталог",
    to: "/catalog",
    img: heroDrone,
    alt: "Квадрокоптер DRON.BY",
  },
  {
    title: "FPV-дроны для драйва и скорости",
    text: "Готовые киты и компоненты для самостоятельной сборки: рамы, моторы, ELRS-приёмники и очки. Подберём конфигурацию под ваш стиль полётов.",
    cta: "Смотреть FPV",
    to: "/catalog?category=FPV-дроны",
    img: heroFpv,
    alt: "FPV-дрон",
  },
  {
    title: "Кинематографичная съёмка с воздуха",
    text: "Флагманские DJI Mavic 4 Pro, Air 3S и Autel EVO II Pro V3 — для съёмки в 4K/6K, профессиональных проектов и путешествий.",
    cta: "Узнать больше об акциях",
    to: "/promotions",
    img: heroCinema,
    alt: "Кинематографический дрон",
  },
];

const advantages = [
  {
    icon: <Truck size={22} />,
    title: "Бесплатная доставка от 300 BYN",
    text: "По всей Беларуси курьером и почтой — быстро и безопасно.",
    details:
      "Доставляем заказы курьером по Минску в день оформления, по регионам — Европочтой и СДЭК за 1–3 дня. При заказе от 300 BYN доставка бесплатная. Возможен самовывоз из офиса на ул. Притыцкого, 79.",
  },
  {
    icon: <ShieldCheck size={22} />,
    title: "Официальная гарантия 12 месяцев",
    text: "Сервисный центр в Минске и поддержка производителя.",
    details:
      "Все дроны и аксессуары — оригинальная продукция с официальной гарантией производителя 12 месяцев. Гарантийное и постгарантийное обслуживание выполняем в собственном сервисном центре, имеющем сертификацию DJI и Autel.",
  },
  {
    icon: <Headphones size={22} />,
    title: "Поддержка 24/7",
    text: "Поможем выбрать дрон, настроить и подскажем по полётам.",
    details:
      "Консультанты на связи в чате, по телефону и e-mail в любое время суток. Подскажем, какую модель выбрать под ваши задачи, поможем настроить приложение, разобраться с режимами полёта и обновлениями прошивки.",
  },
  {
    icon: <BadgeCheck size={22} />,
    title: "Оригинальная продукция",
    text: "Только сертифицированные DJI, Autel, Insta360, BetaFPV.",
    details:
      "Работаем напрямую с дистрибьюторами DJI, Autel Robotics, Insta360, GoPro, BetaFPV и PGYTECH. На каждый товар предоставляем чек, гарантийный талон и сертификат — это гарантирует подлинность и обновление по официальным каналам.",
  },
];

const categories = [
  {
    kicker: "Популярное",
    title: "Квадрокоптеры",
    text: "Универсальные модели для аэросъёмки и путешествий: DJI Mini, Mavic, Air, Autel EVO.",
    img: catQuad,
    to: "/catalog?category=Квадрокоптеры",
    details:
      "В разделе представлены складные дроны DJI Mini 4 Pro и Mini 5, флагманы Mavic 3 Pro и Mavic 4 Pro, среднеразмерные Air 3S, а также Autel EVO Lite+ и EVO II Pro V3. Подберём комплект Fly More, расскажем о различиях сенсоров и режимов съёмки.",
  },
  {
    kicker: "Новинки",
    title: "FPV-дроны",
    text: "Гоночные и кинематографические FPV: DJI Avata 2, BetaFPV Pavo20, готовые киты для пилотов.",
    img: catFpv,
    to: "/catalog?category=FPV-дроны",
    details:
      "Готовые киты для тех, кто только начинает (BetaFPV Cetus Pro, DJI Avata 2 Fly More), и компоненты для самостоятельной сборки: рамы, моторы, ESC, FC, VTX, ELRS-приёмники. Поможем подобрать конфигурацию под ваш стиль полётов.",
  },
  {
    kicker: "В наличии",
    title: "Аксессуары",
    text: "Очки, пульты, аккумуляторы, ND-фильтры, кейсы — всё для комфортных полётов.",
    img: catAcc,
    to: "/catalog?category=Аксессуары",
    details:
      "DJI Goggles 3, RC 2 с экраном, контроллеры Motion 3, наборы ND-фильтров для Mavic и Air, посадочные площадки PGYTECH, водонепроницаемые кейсы и сумки-чехлы. Всё, что делает съёмку удобнее.",
  },
  {
    kicker: "Сервис и ремонт",
    title: "Запчасти",
    text: "Оригинальные детали и расходники: пропеллеры, моторы, ESC, рамы и подвесы.",
    img: catParts,
    to: "/catalog?category=Запчасти",
    details:
      "Оригинальные пропеллеры DJI, моторы и ESC от T-Motor и BetaFPV, рамы для FPV-сборок, шлейфы, подвесы и заменяемые батареи. Всё в наличии — заменим деталь за 1 день в нашем сервисном центре.",
  },
];

const reviews = [
  {
    text: "Заказывал DJI Mavic 3 — всё пришло за 2 дня, помогли с настройкой по телефону. Магазин рекомендую!",
    name: "Алексей П.",
    date: "Минск, 12.04.2026",
  },
  {
    text: "Брала FPV-кит для сына, ребята помогли подобрать комплект под бюджет. Спасибо за индивидуальный подход.",
    name: "Ольга К.",
    date: "Гомель, 28.03.2026",
  },
  {
    text: "Сервис на высоте: ремонт подвеса сделали за 3 дня, цена адекватная, дрон работает как новый.",
    name: "Дмитрий М.",
    date: "Минск, 05.03.2026",
  },
];

const news = [
  {
    tag: "Гид",
    title: "Как выбрать дрон для начинающих",
    text: "Разбираемся в основных характеристиках: время полёта, камера, дальность связи. Что важно купить вместе с первым дроном.",
    img: newsBeginner,
    to: "/news",
  },
  {
    tag: "Новинки",
    title: "Новинки DJI 2025",
    text: "Обзор представленных в этом году моделей DJI: ключевые отличия Mavic 4 Pro, Mini 5 и обновлённой линейки Osmo.",
    img: newsLaunch,
    to: "/news",
  },
];

const HomePage = () => {
  const [email, setEmail] = useState("");
  const [openAdv, setOpenAdv] = useState<number | null>(null);
  const [openCat, setOpenCat] = useState<number | null>(null);
  const [slide, setSlide] = useState(0);
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
    alert(`Спасибо! ${email} добавлен в рассылку.`);
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
          aria-label="Предыдущий слайд"
          title="Предыдущий слайд"
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
          aria-label="Следующий слайд"
          title="Следующий слайд"
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
              aria-label={`Перейти к слайду ${i + 1}`}
              aria-selected={i === slide}
              role="tab"
              title={`Слайд ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ADVANTAGES */}
      <section>
        <header className={s.sectionHead}>
          <span className={s.kicker}>Почему мы</span>
          <h2 className={s.sectionTitle}>Преимущества DRON.BY</h2>
          <p className={s.sectionSub}>Всё, что важно для покупателя</p>
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
                {openAdv === i ? "Свернуть" : "Подробнее"}
              </Button>
              {openAdv === i && <p className={s.advDetails}>{a.details}</p>}
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section>
        <header className={s.sectionHead}>
          <span className={s.kicker}>Категории</span>
          <h2 className={s.sectionTitle}>Каталог товаров</h2>
          <p className={s.sectionSub}>Полный ассортимент для аэросъёмки</p>
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
                    <Button>Каталог</Button>
                  </Link>
                  <Button
                    variant="secondary"
                    onClick={() => setOpenCat(isOpen ? null : idx)}
                  >
                    {isOpen ? "Свернуть" : "Подробнее"}
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
          <span className={s.kicker}>Отзывы</span>
          <h2 className={s.sectionTitle}>Отзывы</h2>
          <p className={s.sectionSub}>Что говорят наши клиенты</p>
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
          <span className={s.kicker}>Блог</span>
          <h2 className={s.sectionTitle}>Новости и полезные советы</h2>
          <p className={s.sectionSub}>Гиды, обзоры и анонсы</p>
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
                    <Button size="sm">Читать далее</Button>
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className={s.newsletter}>
        <h2 className={s.sectionTitle}>Будьте в курсе новинок и акций</h2>
        <p className={s.sectionSub}>
          Подпишитесь на рассылку — без спама, только важное о дронах
        </p>
        <form className={s.newsletterForm} onSubmit={handleSubscribe}>
          <input
            type="email"
            placeholder="Ваш e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={s.newsletterInput}
            required
          />
          <Button type="submit">Подписаться</Button>
        </form>
      </section>
    </div>
  );
};

export default HomePage;
