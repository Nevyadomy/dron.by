import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import {
  Heart,
  LogOut,
  MessageSquare,
  Package,
  ShoppingBag,
  ShoppingCart,
  Trash2,
  User,
  Wallet,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { LayoutCard } from "@/components/atoms/LayoutCard";
import { Button } from "@/components/atoms/Button";
import { SmartImage } from "@/components/atoms/SmartImage";
import { ConfirmModal } from "@/components/organisms/ConfirmModal";
import { useAuth } from "@/contexts/useAuth";
import { useCurrency } from "@/hooks/useCurrency";
import { useFavorites } from "@/contexts/useFavorites";
import { useCart } from "@/contexts/useCart";
import { LOCAL_PRODUCTS } from "@/data/products";
import dronePlaceholder from "@/assets/images/common/drone-placeholder.png";
import type { CurrencyCode } from "@/contexts/currency-context";
import { cn } from "@/utils/cn";
import s from "./profile.module.css";

type TabKey = "profile" | "orders" | "reviews" | "payments" | "favorites";

const TABS = (
  t: (key: string) => string,
): { key: TabKey; label: string; icon: React.ReactNode }[] => [
  { key: "profile", label: t("profile.profile"), icon: <User size={18} /> },
  { key: "orders", label: t("profile.orders"), icon: <Package size={18} /> },
  {
    key: "reviews",
    label: t("profile.reviews"),
    icon: <MessageSquare size={18} />,
  },
  { key: "payments", label: t("profile.payments"), icon: <Wallet size={18} /> },
  {
    key: "favorites",
    label: t("profile.favorites"),
    icon: <Heart size={18} />,
  },
];
const ProfilePage = () => {
  const { t } = useTranslation();
  const { user, isAuthenticated, isHydrated, logout, updateUser } = useAuth();
  const { list, currency, setCurrency } = useCurrency();
  const [params, setParams] = useSearchParams();

  if (isHydrated && !isAuthenticated) return <Navigate to="/login" replace />;
  if (!user) return null;

  const tabParam = (params.get("tab") as TabKey) ?? "profile";
  const tab: TabKey = TABS(t).some((t) => t.key === tabParam)
    ? tabParam
    : "profile";
  const setTab = (k: TabKey) => {
    const next = new URLSearchParams(params);
    next.set("tab", k);
    setParams(next, { replace: true });
  };

  return (
    <div className="page-container">
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>{t("profile.title")}</h1>
      <Breadcrumbs
        items={[
          { label: t("breadcrumbs.home"), to: "/" },
          { label: t("profile.title") },
        ]}
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
              <div className={s.userName}>
                {user.name || t("profile.defaultName")}
              </div>
              <div className={s.userEmail}>{user.email}</div>
            </div>
          </div>

          <div className={s.tabs}>
            {TABS(t).map((t) => (
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
              <span>{t("profile.logout")}</span>
            </button>
          </div>
        </LayoutCard>

        <LayoutCard className={s.content}>
          {tab === "profile" && <ProfileForm />}
          {tab === "orders" && (
            <EmptyState
              icon={<Package size={32} />}
              title={t("profile.emptyOrders")}
              text={t("profile.emptyOrdersHint")}
            />
          )}
          {tab === "reviews" && (
            <EmptyState
              icon={<MessageSquare size={32} />}
              title={t("profile.emptyReviews")}
              text={t("profile.emptyReviewsHint")}
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
          {tab === "favorites" && <FavoritesTab />}
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
}) => {
  const { t } = useTranslation();
  return (
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
            <ShoppingBag size={16} /> {t("cart.goToCatalog")}
          </Button>
        </Link>
      </div>
    </div>
  );
};

const ProfileForm = () => {
  const { t } = useTranslation();
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
    if (f.size > 10 * 1024 * 1024) {
      alert(t("profile.fileTooBig"));
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
      <h2 className={s.h1}>{t("profile.profile")}</h2>
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
            {t("profile.uploadPhoto")}
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
                {t("profile.deletePhoto")}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className={s.fieldList}>
        <div>
          <div className={s.fieldLabel}>{t("profile.name")}</div>
          <input
            className={s.formInput}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <div className={s.fieldLabel}>{t("profile.email")}</div>
          <input
            className={s.formInput}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <div className={s.fieldLabel}>{t("profile.phone")}</div>
          <input
            className={s.formInput}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+375 (29) 000-00-00"
          />
        </div>
        <div>
          <div className={s.fieldLabel}>{t("profile.city")}</div>
          <input
            className={s.formInput}
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder={t("profile.cityPlaceholder")}
          />
        </div>
        <div className={s.toolbar}>
          <Button type="submit">{t("profile.save")}</Button>
          {saved && (
            <span
              style={{
                alignSelf: "center",
                color: "var(--color-success)",
                fontSize: 13,
              }}
            >
              {t("profile.saved")}
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
  const { t } = useTranslation();
  const [cards, setCards] = useState<SavedCard[]>(() => loadCards(userId));
  const [showForm, setShowForm] = useState(false);
  const [num, setNum] = useState("");
  const [exp, setExp] = useState("");
  const [cvv, setCvv] = useState("");
  const [holder, setHolder] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [confirmId, setConfirmId] = useState<string | null>(null);

  useEffect(() => {
    saveCards(userId, cards);
  }, [cards, userId]);

  const reset = () => {
    setNum("");
    setExp("");
    setCvv("");
    setHolder("");
    setErrors({});
  };

  const validate = (): Record<string, string> => {
    const e: Record<string, string> = {};
    const cleanNum = num.replace(/\s+/g, "");
    if (!/^\d{13,19}$/.test(cleanNum)) e.num = t("checkout.cardNumInvalid");
    if (!/^\d{2}\/\d{2}$/.test(exp)) {
      e.exp = t("checkout.cardExpInvalid");
    } else {
      const [mm, yy] = exp.split("/").map((x) => parseInt(x, 10));
      const now = new Date();
      const curYear = now.getFullYear() % 100;
      const curMonth = now.getMonth() + 1;
      if (mm < 1 || mm > 12) e.exp = t("checkout.cardExpMonth");
      else if (yy < curYear || (yy === curYear && mm < curMonth))
        e.exp = t("checkout.cardExpired");
    }
    if (!/^\d{3,4}$/.test(cvv)) e.cvv = t("checkout.cardCvvInvalid");
    if (holder.trim().length < 2) e.holder = t("checkout.cardHolderRequired");
    return e;
  };

  const addCard = (e: FormEvent) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }
    const cleanNum = num.replace(/\s+/g, "");
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

  const confirmRemove = () => {
    if (!confirmId) return;
    setCards((c) => c.filter((x) => x.id !== confirmId));
    setConfirmId(null);
  };

  return (
    <div>
      <h2 className={s.h1}>{t("profile.payments")}</h2>

      <div className={s.fieldLabel} style={{ marginBottom: 8 }}>
        {t("profile.currency")}
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
        {t("profile.myCards")}
      </div>
      <div className={s.cardsList}>
        {cards.length === 0 && (
          <p style={{ color: "var(--color-muted-fg)", fontSize: 14 }}>
            {t("profile.noCards")}
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
              onClick={() => setConfirmId(c.id)}
              aria-label={t("profile.deleteCard")}
              title={t("profile.deleteCard")}
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      {showForm ? (
        <form className={s.cardForm} onSubmit={addCard}>
          <div className={s.cardFormFull}>
            <div className={s.fieldLabel}>{t("checkout.cardNumber")}</div>
            <input
              className={s.formInput}
              value={num}
              inputMode="numeric"
              placeholder="0000 0000 0000 0000"
              onChange={(e) => setNum(formatNum(e.target.value))}
            />
            {errors.num && <p className={s.formError}>{errors.num}</p>}
          </div>
          <div>
            <div className={s.fieldLabel}>{t("checkout.cardExpiry")}</div>
            <input
              className={s.formInput}
              value={exp}
              inputMode="numeric"
              placeholder="MM/YY"
              onChange={(e) => setExp(formatExp(e.target.value))}
            />
            {errors.exp && <p className={s.formError}>{errors.exp}</p>}
          </div>
          <div>
            <div className={s.fieldLabel}>{t("checkout.cardCvv")}</div>
            <input
              className={s.formInput}
              value={cvv}
              inputMode="numeric"
              placeholder="123"
              maxLength={4}
              onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
            />
            {errors.cvv && <p className={s.formError}>{errors.cvv}</p>}
          </div>
          <div className={s.cardFormFull}>
            <div className={s.fieldLabel}>{t("checkout.cardHolder")}</div>
            <input
              className={s.formInput}
              value={holder}
              placeholder="IVAN IVANOV"
              onChange={(e) => setHolder(e.target.value.toUpperCase())}
            />
            {errors.holder && <p className={s.formError}>{errors.holder}</p>}
          </div>
          <div className={cn(s.toolbar, s.cardFormFull)}>
            <Button type="submit">{t("profile.saveCard")}</Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setShowForm(false);
                reset();
              }}
            >
              {t("common.cancel")}
            </Button>
          </div>
        </form>
      ) : (
        <Button variant="secondary" onClick={() => setShowForm(true)}>
          {t("profile.addCard")}
        </Button>
      )}

      <ConfirmModal
        open={confirmId !== null}
        title={t("profile.deleteCardConfirm")}
        text={t("profile.deleteCardText")}
        confirmLabel={t("profile.deleteCard")}
        destructive
        onConfirm={confirmRemove}
        onCancel={() => setConfirmId(null)}
      />
    </div>
  );
};
const FavoritesTab = () => {
  const { t } = useTranslation();
  const { ids, remove } = useFavorites();
  const { state, add, remove: cartRemove } = useCart();
  const { format } = useCurrency();

  const products = useMemo(
    () => LOCAL_PRODUCTS.filter((p) => ids.includes(p.id)),
    [ids],
  );

  if (products.length === 0) {
    return (
      <div className={s.emptyBox}>
        <div style={{ color: "var(--color-muted-fg)", marginBottom: 12 }}>
          <Heart size={32} />
        </div>
        <h2
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: "var(--color-fg)",
            marginBottom: 8,
          }}
        >
          {t("favorites.empty")}
        </h2>
        <p>{t("favorites.emptyHint")}</p>
        <div style={{ marginTop: 16 }}>
          <Link to="/catalog">
            <Button>
              <ShoppingBag size={16} /> {t("cart.goToCatalog")}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className={s.h1}>{t("profile.favorites")}</h2>
      <div className={s.favList}>
        {products.map((p) => {
          const inCart = state.items.some((i) => i.id === p.id);
          return (
            <div key={p.id} className={s.favRow}>
              <Link to={`/product/${p.id}`} className={s.favThumb}>
                <SmartImage
                  src={p.thumbnail || dronePlaceholder}
                  alt={p.title}
                  loading="lazy"
                />
              </Link>
              <div className={s.favInfo}>
                <Link to={`/product/${p.id}`} className={s.favName}>
                  {p.title}
                </Link>
                <div className={s.favMeta}>
                  {p.brand} · {p.category}
                </div>
              </div>
              <strong className={s.favPrice}>{format(p.price)}</strong>
              <div className={s.favActions}>
                <button
                  type="button"
                  className={cn(s.favCartBtn, inCart && s.favCartBtnActive)}
                  onClick={() => {
                    if (inCart) cartRemove(p.id);
                    else
                      add({
                        id: p.id,
                        title: p.title,
                        price: p.price,
                        thumbnail: p.thumbnail,
                      });
                  }}
                  disabled={(p.stock ?? 0) === 0}
                  aria-pressed={inCart}
                  title={
                    inCart
                      ? t("productCard.removeFromCart")
                      : t("common.addToCart")
                  }
                >
                  <ShoppingCart size={16} />
                </button>
                <button
                  type="button"
                  className={s.cardDel}
                  onClick={() => remove(p.id)}
                  title={t("favorites.remove")}
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Вспомогательные функции (остаются без изменений)
interface SavedCard {
  id: string;
  last4: string;
  exp: string;
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

export default ProfilePage;
