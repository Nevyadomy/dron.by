import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { LayoutCard } from "@/components/atoms/LayoutCard";
import { Button } from "@/components/atoms/Button";

interface Article {
  id: number;
  date: string;
  title: string;
  excerpt: string;
  full: string;
}

const articles: Article[] = [
  {
    id: 5,
    date: "20 апреля 2026",
    title: "Как выбрать дрон для начинающих",
    excerpt:
      "Разбираемся в основных характеристиках: время полёта, камера, дальность связи. Что важно купить вместе с первым дроном.",
    full: "Для первого дрона важно учитывать не только цену, но и стабильность связи, качество стабилизации камеры, наличие датчиков препятствий и доступность расходников. Начинающим чаще всего подходят компактные модели DJI Mini: они легче, проще в управлении и дают качественную картинку без сложной настройки. В комплект сразу стоит добавить запасные аккумуляторы, защиту пропеллеров, карту памяти и сумку для переноски.",
  },
  {
    id: 1,
    date: "12 апреля 2026",
    title: "В DRON.BY поступила новинка — DJI Mavic 4 Pro",
    excerpt:
      "Преемник флагмана с камерой Hasselblad второго поколения, увеличенным временем полёта до 51 минуты и системой передачи O5. Доступен предзаказ.",
    full: "DJI Mavic 4 Pro получил тройной модуль камер с основным сенсором 4/3 Hasselblad, телеобъективами 70 мм и 168 мм. Поддерживается съёмка 6K/60fps в формате CinemaDNG, расширенный динамический диапазон 16 стопов. Время полёта увеличено до 51 минуты, дальность передачи O5 — до 30 км. Заряд аккумулятора через GaN-зарядку 240 Вт занимает 20 минут. Предзаказ открыт, отгрузка с 1 мая 2026.",
  },
  {
    id: 2,
    date: "28 марта 2026",
    title: "Открытие сервисного центра DJI в Минске",
    excerpt:
      "Мы запустили обновлённую авторизованную мастерскую: ремонт квадрокоптеров DJI, Autel и BetaFPV, диагностика подвесов и калибровка ESC.",
    full: "Сервисный центр расположен на пр-те Независимости, 50. Доступны: гарантийный и платный ремонт DJI, Autel и BetaFPV, замена подвесов и моторов, прошивка контроллеров полёта, калибровка ESC и компасов, восстановление после краша. Срок диагностики — 1 рабочий день, ремонта — от 2 дней. Мастера сертифицированы DJI и Autel. Запись по телефону +375 (29) 000-00-00.",
  },
  {
    id: 3,
    date: "10 марта 2026",
    title: "Бесплатные мастер-классы по FPV-сборке",
    excerpt:
      "Каждую субботу — практические занятия для всех желающих: пайка ESC, настройка Betaflight, первые полёты в симуляторе. Запись на сайте.",
    full: "Программа мастер-классов рассчитана на 4 субботы. Занятие 1 — выбор компонентов и сборка рамы. Занятие 2 — пайка ESC и FC, подключение VTX и приёмника. Занятие 3 — настройка Betaflight, PID, ELRS. Занятие 4 — полёт в симуляторе Liftoff и первые подлёты на улице. Все материалы и инструменты предоставляются магазином. Запись по адресу hello@dron.by, количество мест ограничено — 8 человек на поток.",
  },
  {
    id: 4,
    date: "24 февраля 2026",
    title: "Регистрация дронов в Беларуси: что нужно знать",
    excerpt:
      "С 2026 года все БПЛА массой свыше 250 г подлежат обязательной регистрации в Министерстве транспорта. Разбираем процедуру по шагам.",
    full: "Регистрация проводится на портале Министерства транспорта. Понадобится паспорт, серийный номер дрона и квитанция об оплате пошлины (1 БВ). После регистрации выдаётся уникальный идентификатор, который наносится на корпус. Полёты в населённых пунктах требуют согласования за 5 рабочих дней. Запретные зоны (аэродромы, госучреждения) указаны в приложении BAP. За нарушения предусмотрены штрафы до 50 БВ и конфискация устройства.",
  },
];

const NewsCard = ({ a }: { a: Article }) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  return (
    <LayoutCard padded>
      <p
        style={{
          fontSize: 12,
          color: "var(--color-muted-fg)",
          marginBottom: 4,
        }}
      >
        {a.date}
      </p>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
        {a.title}
      </h2>
      <p
        style={{
          fontSize: 14,
          color: "var(--color-muted-fg)",
          lineHeight: 1.5,
        }}
      >
        {a.excerpt}
      </p>
      {open && (
        <p
          style={{
            fontSize: 14,
            color: "var(--color-fg)",
            lineHeight: 1.6,
            marginTop: 12,
            paddingTop: 12,
            borderTop: "1px solid var(--color-border)",
          }}
        >
          {a.full}
        </p>
      )}
      <div style={{ marginTop: 12 }}>
        <Button size="sm" onClick={() => setOpen((v) => !v)}>
          {open ? t("news.collapse") : t("news.readMore")}
        </Button>
      </div>
    </LayoutCard>
  );
};

const NewsPage = () => {
  const { t } = useTranslation();
  return (
    <div className="page-container">
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>{t("news.title")}</h1>
      <Breadcrumbs
        items={[
          { label: t("breadcrumbs.home"), to: "/" },
          { label: t("news.title") },
        ]}
      />
      <div style={{ display: "grid", gap: 12 }}>
        {articles.map((a) => (
          <NewsCard key={a.id} a={a} />
        ))}
      </div>
    </div>
  );
};

export default NewsPage;
