import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import {
  Heart,
  LogOut,
  MessageSquare,
  Package,
  ShoppingBag,
  Trash2,
  User,
  Wallet,
} from "lucide-react";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { LayoutCard } from "@/components/atoms/LayoutCard";
import { Button } from "@/components/atoms/Button";
import { useAuth } from "@/contexts/useAuth";
import { useCurrency } from "@/hooks/useCurrency";
import type { CurrencyCode } from "@/contexts/currency-context";
import { cn } from "@/utils/cn";
import s from "./profile.module.css";

type TabKey = "profile" | "orders" | "reviews" | "payments" | "favorites";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "profile", label: "Личные данные", icon: <User size={18} /> },
  { key: "orders", label: "Заказы", icon: <Package size={18} /> },
  { key: "reviews", label: "Отзывы", icon: <MessageSquare size={18} /> },
  { key: "payments", label: "Платежи", icon: <Wallet size={18} /> },
  { key: "favorites", label: "Избранное", icon: <Heart size={18} /> },
];

interface SavedCard {
  id: string;
  last4: string;
  exp: string; // MM/YY
  holder: string;
  brand: string;
}

function detectBrand(num: string): string {
  const n = num.replace(/\s+/g, "");
  if (/^4/.test(n)) return "Visa";
  if (/^5[1-5]/.test(n)) return "MasterCard";
  if (/^3[47]/.test(n)) return "Amex";
  if (/^6/.test(n)) return "Maestro";
  return "Card";
}

function formatNum(v: string) {
  return v
    .replace(/\D/g, "")
    .slice(0, 19)
    .replace(/(.{4})/g, "$1 ")
    .trim();
}
function formatExp(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  if (d.length < 3) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
}

function loadCards(userId: string | number): SavedCard[] {
  try {
    const raw = localStorage.getItem(`payment_cards_${userId}`);
    return raw ? (JSON.parse(raw) as SavedCard[]) : [];
  } catch {
    return [];
  }
}
function saveCards(userId: string | number, cards: SavedCard[]) {
  try {
    localStorage.setItem(`payment_cards_${userId}`, JSON.stringify(cards));
  } catch {
    /* ignore */
  }
}

const ProfilePage = () => {
  const { user, isAuthenticated, isHydrated, logout, updateUser } = useAuth();
  const { list, currency, setCurrency } = useCurrency();
  const [params, setParams] = useSearchParams();

  if (isHydrated && !isAuthenticated) return <Navigate to="/login" replace />;
  if (!user) return null;

  const tabParam = (params.get("tab") as TabKey) ?? "profile";
  const tab: TabKey = TABS.some((t) => t.key === tabParam)
    ? tabParam
    : "profile";
  const setTab = (k: TabKey) => {
    const next = new URLSearchParams(params);
    next.set("tab", k);
    setParams(next, { replace: true });
  };

  return (
    <div className="page-container">
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Личный кабинет</h1>
      <Breadcrumbs
        items={[{ label: "Главная", to: "/" }, { label: "Личный кабинет" }]}
      />

      <div className={s.wrap} style={{ marginTop: 16 }}>
        <LayoutCard className={s.sideCard}>
          <div className={s.userBlock}>
            {user.avatar || user.picture ? (
              <img
                src={user.avatar || user.picture}
                alt="avatar"
                className={s.avatar}
              />
            ) : (
              <span className={s.avatarPlaceholder}>
                {(user.name || user.email)[0]?.toUpperCase()}
              </span>
            )}
            <div>
              <div className={s.userName}>{user.name || "Пользователь"}</div>
              <div className={s.userEmail}>{user.email}</div>
            </div>
          </div>

          <div className={s.tabs}>
            {TABS.map((t) => (
              <button
                key={t.key}
                type="button"
                className={cn(s.tab, tab === t.key && s.tabActive)}
                onClick={() => setTab(t.key)}
              >
                {t.icon}
                <span>{t.label}</span>
              </button>
            ))}
            <button
              type="button"
              className={cn(s.tab, s.tabLogout)}
              onClick={logout}
            >
              <LogOut size={18} />
              <span>Выйти</span>
            </button>
          </div>
        </LayoutCard>

        <LayoutCard className={s.content}>
          {tab === "profile" && <ProfileForm />}
          {tab === "orders" && (
            <EmptyState
              icon={<Package size={32} />}
              title="У вас пока нет заказов"
              text="Перейдите в каталог, чтобы сделать первый заказ."
            />
          )}
          {tab === "reviews" && (
            <EmptyState
              icon={<MessageSquare size={32} />}
              title="У вас пока нет отзывов"
              text="Поделитесь впечатлениями о товарах после покупки."
            />
          )}
          {tab === "payments" && (
            <PaymentsSection
              userId={user.id}
              currency={currency}
              setCurrency={setCurrency}
              currencies={list}
              onCurrencyChange={(c) => updateUser({ currency: c })}
            />
          )}
          {tab === "favorites" && (
            <div className={s.emptyBox}>
              <p>
                Перейдите в раздел избранного, чтобы посмотреть сохранённые
                товары.
              </p>
              <Link to="/favorites">
                <Button>Открыть избранное</Button>
              </Link>
            </div>
          )}
        </LayoutCard>
      </div>
    </div>
  );
};

const EmptyState = ({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) => (
  <div className={s.emptyBox}>
    <div style={{ color: "var(--color-muted-fg)", marginBottom: 12 }}>
      {icon}
    </div>
    <h2
      style={{
        fontSize: 18,
        fontWeight: 600,
        color: "var(--color-fg)",
        marginBottom: 8,
      }}
    >
      {title}
    </h2>
    <p>{text}</p>
    <div style={{ marginTop: 16 }}>
      <Link to="/catalog">
        <Button>
          <ShoppingBag size={16} /> Перейти в каталог
        </Button>
      </Link>
    </div>
  </div>
);

const ProfileForm = () => {
  const { user, updateUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [city, setCity] = useState(user?.city ?? "");
  const [avatar, setAvatar] = useState(user?.avatar ?? user?.picture ?? "");
  const [saved, setSaved] = useState(false);

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) {
      alert("Файл слишком большой. Максимум 2 МБ.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setAvatar(dataUrl);
    };
    reader.readAsDataURL(f);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    updateUser({ name, email, phone, city, avatar });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form onSubmit={onSubmit}>
      <h2 className={s.h1}>Личные данные</h2>
      <div className={s.avatarRow}>
        {avatar ? (
          <img src={avatar} alt="avatar" className={s.avatarLg} />
        ) : (
          <span className={s.avatarLgPlaceholder}>
            {(name || email)[0]?.toUpperCase() || "?"}
          </span>
        )}
        <div>
          <button
            type="button"
            className={s.uploadBtn}
            onClick={() => fileRef.current?.click()}
          >
            Загрузить фото
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={onFile}
          />
          {avatar && (
            <div>
              <button
                type="button"
                className={s.uploadBtn}
                style={{ color: "var(--color-destructive)", marginTop: 4 }}
                onClick={() => setAvatar("")}
              >
                Удалить фото
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={s.fieldList}>
        <div>
          <div className={s.fieldLabel}>Имя</div>
          <input
            className={s.formInput}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <div className={s.fieldLabel}>Email</div>
          <input
            className={s.formInput}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <div className={s.fieldLabel}>Телефон</div>
          <input
            className={s.formInput}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+375 (29) 000-00-00"
          />
        </div>
        <div>
          <div className={s.fieldLabel}>Город</div>
          <input
            className={s.formInput}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Минск"
          />
        </div>
        <div className={s.toolbar}>
          <Button type="submit">Сохранить</Button>
          {saved && (
            <span
              style={{
                alignSelf: "center",
                color: "var(--color-success)",
                fontSize: 13,
              }}
            >
              Сохранено
            </span>
          )}
        </div>
      </div>
    </form>
  );
};

interface PaymentsProps {
  userId: string | number;
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  currencies: { code: CurrencyCode; symbol: string; name: string }[];
  onCurrencyChange: (c: string) => void;
}

const PaymentsSection = ({
  userId,
  currency,
  setCurrency,
  currencies,
  onCurrencyChange,
}: PaymentsProps) => {
  const [cards, setCards] = useState<SavedCard[]>(() => loadCards(userId));
  const [showForm, setShowForm] = useState(false);
  const [num, setNum] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");
  const [holder, setHolder] = useState("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    saveCards(userId, cards);
  }, [cards, userId]);

  const reset = () => {
    setNum("");
    setExp("");
    setCvv("");
    setHolder("");
    setErr(null);
  };

  const addCard = (e: FormEvent) => {
    e.preventDefault();
    const cleanNum = num.replace(/\s+/g, "");
    if (cleanNum.length < 13 || cleanNum.length > 19) {
      setErr("Некорректный номер карты");
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(exp)) {
      setErr("Срок в формате MM/YY");
      return;
    }
    if (!/^\d{3,4}$/.test(cvv)) {
      setErr("Некорректный CVV");
      return;
    }
    if (holder.trim().length < 2) {
      setErr("Укажите имя держателя");
      return;
    }
    const card: SavedCard = {
      id: `${Date.now()}`,
      last4: cleanNum.slice(-4),
      exp,
      holder: holder.trim(),
      brand: detectBrand(cleanNum),
    };
    setCards((c) => [...c, card]);
    setShowForm(false);
    reset();
  };

  const removeCard = (id: string) => {
    if (!confirm("Удалить карту?")) return;
    setCards((c) => c.filter((x) => x.id !== id));
  };

  return (
    <div>
      <h2 className={s.h1}>Платежи</h2>

      <div className={s.fieldLabel} style={{ marginBottom: 8 }}>
        Валюта отображения
      </div>
      <div className={s.currencyRow}>
        {currencies.map((c) => (
          <button
            key={c.code}
            type="button"
            className={cn(
              s.currencyBtn,
              currency === c.code && s.currencyActive,
            )}
            onClick={() => {
              setCurrency(c.code);
              onCurrencyChange(c.code);
            }}
            title={c.name}
          >
            {c.symbol} · {c.code}
          </button>
        ))}
      </div>

      <div className={s.fieldLabel} style={{ marginBottom: 8 }}>
        Мои карты
      </div>
      <div className={s.cardsList}>
        {cards.length === 0 && (
          <p style={{ color: "var(--color-muted-fg)", fontSize: 14 }}>
            Карты ещё не добавлены.
          </p>
        )}
        {cards.map((c) => (
          <div key={c.id} className={s.cardRow}>
            <div>
              <div className={s.cardNumber}>•••• •••• •••• {c.last4}</div>
              <div className={s.cardMeta}>
                {c.brand} · {c.exp} · {c.holder}
              </div>
            </div>
            <button
              type="button"
              className={s.cardDel}
              onClick={() => removeCard(c.id)}
              aria-label="Удалить"
              title="Удалить"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {showForm ? (
        <form className={s.cardForm} onSubmit={addCard}>
          <div className={s.cardFormFull}>
            <div className={s.fieldLabel}>Номер карты</div>
            <input
              className={s.formInput}
              value={num}
              inputMode="numeric"
              placeholder="0000 0000 0000 0000"
              onChange={(e) => setNum(formatNum(e.target.value))}
            />
          </div>
          <div>
            <div className={s.fieldLabel}>Срок (MM/YY)</div>
            <input
              className={s.formInput}
              value={exp}
              inputMode="numeric"
              placeholder="MM/YY"
              onChange={(e) => setExp(formatExp(e.target.value))}
            />
          </div>
          <div>
            <div className={s.fieldLabel}>CVV</div>
            <input
              className={s.formInput}
              value={cvv}
              inputMode="numeric"
              placeholder="123"
              maxLength={4}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
            />
          </div>
          <div className={s.cardFormFull}>
            <div className={s.fieldLabel}>Имя держателя</div>
            <input
              className={s.formInput}
              value={holder}
              placeholder="IVAN IVANOV"
              onChange={(e) => setHolder(e.target.value.toUpperCase())}
            />
          </div>
          {err && <p className={cn(s.formError, s.cardFormFull)}>{err}</p>}
          <div className={cn(s.toolbar, s.cardFormFull)}>
            <Button type="submit">Сохранить карту</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowForm(false);
                reset();
              }}
            >
              Отмена
            </Button>
          </div>
        </form>
      ) : (
        <Button variant="secondary" onClick={() => setShowForm(true)}>
          Добавить карту
        </Button>
      )}
    </div>
  );
};

export default ProfilePage;
