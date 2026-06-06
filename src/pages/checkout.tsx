import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { LayoutCard } from "@/components/atoms/LayoutCard";
import { Button } from "@/components/atoms/Button";
import { SmartImage } from "@/components/atoms/SmartImage";
import { useCart } from "@/contexts/useCart";
import { useAuth } from "@/contexts/useAuth";
import { useCurrency } from "@/hooks/useCurrency";
import { submitOrder } from "@/services/orderService";
import { LOCAL_PRODUCTS } from "@/data/products";
import { getProductPromo, applyDiscount } from "@/data/promotions";
import dronePlaceholder from "@/assets/images/common/drone-placeholder.png";
import { cn } from "@/utils/cn";
import s from "./checkout.module.css";

const OFFICE_ADDRESS =
  "г. Минск, ул. Притыцкого, 156, офис 12 (пн–сб 10:00–20:00)";

interface SavedCard {
  id: string;
  last4: string;
  exp: string;
  holder: string;
  brand: string;
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

function formatCardNum(v: string) {
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

function detectBrand(num: string): string {
  const n = num.replace(/\s+/g, "");
  if (/^4/.test(n)) return "Visa";
  if (/^5[1-5]/.test(n)) return "MasterCard";
  if (/^3[47]/.test(n)) return "Amex";
  if (/^6/.test(n)) return "Maestro";
  return "Card";
}

const CheckoutPage = () => {
  const { t } = useTranslation();
  const { state, remove, clear } = useCart();
  const { user } = useAuth();
  const { format } = useCurrency();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const buyNowId = params.get("buyNow");
  const buyNowItem = useMemo(() => {
    if (!buyNowId) return null;
    const id = parseInt(buyNowId, 10);
    const p = LOCAL_PRODUCTS.find((x) => x.id === id);
    if (!p) return null;
    return {
      id: p.id,
      title: p.title,
      price: p.price,
      thumbnail: p.thumbnail,
      quantity: 1,
    };
  }, [buyNowId]);

  const items = buyNowItem ? [buyNowItem] : state.items;
  const [done, setDone] = useState(false);

  useEffect(() => {
    document.title = `${t("checkout.title")} | DRON.BY`;
  }, [t]);

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [comment, setComment] = useState("");

  const [payment, setPayment] = useState<"card" | "cash">("card");
  const [cards, setCards] = useState<SavedCard[]>(() =>
    user?.id ? loadCards(user.id) : [],
  );
  const [selectedCardId, setSelectedCardId] = useState<string | null>(() => {
    const c = user?.id ? loadCards(user.id) : [];
    return c[0]?.id ?? null;
  });
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardNum, setCardNum] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardHolder, setCardHolder] = useState("");

  const [delivery, setDelivery] = useState<"pickup" | "courier">("pickup");
  const [address, setAddress] = useState("");

  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  if (items.length === 0 && !done) return <Navigate to="/cart" replace />;

  const discount = items.reduce((sum, i) => {
    const promo = getProductPromo(i.id);
    if (!promo || promo.discount <= 0) return sum;
    const discounted = applyDiscount(i.price, promo.discount);
    return sum + (i.price - discounted) * i.quantity;
  }, 0);
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const total = totalPrice - discount;

  const validate = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = t("checkout.nameRequired");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = t("checkout.emailInvalid");
    if (!phone || phone.replace(/\D/g, "").length < 7)
      e.phone = t("checkout.phoneRequired");
    if (delivery === "courier" && address.trim().length < 5)
      e.address = t("checkout.addressRequired");
    if (payment === "card") {
      if (showCardForm || cards.length === 0) {
        const clean = cardNum.replace(/\s+/g, "");
        if (!/^\d{13,19}$/.test(clean))
          e.cardNum = t("checkout.cardNumInvalid");
        if (!/^\d{2}\/\d{2}$/.test(cardExp))
          e.cardExp = t("checkout.cardExpInvalid");
        else {
          const [mm, yy] = cardExp.split("/").map((x) => parseInt(x, 10));
          const now = new Date();
          const cy = now.getFullYear() % 100,
            cm = now.getMonth() + 1;
          if (mm < 1 || mm > 12) e.cardExp = t("checkout.cardExpMonth");
          else if (yy < cy || (yy === cy && mm < cm))
            e.cardExp = t("checkout.cardExpired");
        }
        if (!/^\d{3,4}$/.test(cardCvv))
          e.cardCvv = t("checkout.cardCvvInvalid");
        if (cardHolder.trim().length < 2)
          e.cardHolder = t("checkout.cardHolderRequired");
      } else if (!selectedCardId) {
        e.card = t("checkout.cardRequired");
      }
    }

    if (!consent) e.consent = t("checkout.consentRequired");
    return e;
  };

  const onSubmit = async (ev: FormEvent) => {
    ev.preventDefault();
    setServerError(null);
    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      return;
    }
    setErrors({});
    setSubmitting(true);

    let cardLast4: string | undefined;
    if (payment === "card") {
      if (showCardForm || cards.length === 0) {
        const clean = cardNum.replace(/\s+/g, "");
        cardLast4 = clean.slice(-4);
        if (user?.id) {
          const card: SavedCard = {
            id: `${Date.now()}`,
            last4: cardLast4,
            exp: cardExp,
            holder: cardHolder.trim().toUpperCase(),
            brand: detectBrand(clean),
          };
          const next = [...cards, card];
          saveCards(user.id, next);
          setCards(next);
        }
      } else {
        cardLast4 = cards.find((c) => c.id === selectedCardId)?.last4;
      }
    }

    try {
      await submitOrder({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        delivery,
        address: delivery === "courier" ? address.trim() : undefined,
        pickupAddress: delivery === "pickup" ? OFFICE_ADDRESS : undefined,
        payment,
        cardLast4,
        comment: comment.trim() || undefined,
        items: items.map((i) => {
          const promo = getProductPromo(i.id);
          const price =
            promo && promo.discount > 0
              ? applyDiscount(i.price, promo.discount)
              : i.price;
          return { id: i.id, title: i.title, quantity: i.quantity, price };
        }),
        total,
      });
      if (buyNowItem) {
        remove(buyNowItem.id);
      } else {
        clear();
      }
      setDone(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : t("checkout.submitError"),
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="page-container">
        <Breadcrumbs
          items={[
            { label: t("breadcrumbs.home"), to: "/" },
            { label: t("cart.title"), to: "/cart" },
            { label: t("checkout.title") },
          ]}
        />
        <div className={s.centered}>
          <LayoutCard padded>
            <p className={s.success}>{t("checkout.success")}</p>
            <Link to="/catalog">
              <Button>{t("cart.goToCatalog")}</Button>
            </Link>
          </LayoutCard>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>{t("checkout.title")}</h1>
      <Breadcrumbs
        items={[
          { label: t("breadcrumbs.home"), to: "/" },
          { label: t("cart.title"), to: "/cart" },
          { label: t("checkout.title") },
        ]}
      />

      <div className={s.centered}>
        <form className={s.formCard} onSubmit={onSubmit}>
          <LayoutCard className={s.section}>
            <h2 className={s.h2}>{t("checkout.orderComposition")}</h2>
            {items.map((i) => (
              <div key={i.id} className={s.item}>
                <div className={s.thumb}>
                  <SmartImage
                    src={i.thumbnail || dronePlaceholder}
                    alt={i.title}
                    loading="lazy"
                  />
                </div>
                <div>
                  <div className={s.title}>{i.title}</div>
                  <div className={s.meta}>
                    {i.quantity} {t("checkout.pieces")}
                  </div>
                </div>
                <div className={s.price}>{format(i.price * i.quantity)}</div>
              </div>
            ))}

            <h2 className={s.h2}>{t("checkout.buyerData")}</h2>
            <div className={s.fields}>
              <label className={s.field}>
                <span className={s.label}>{t("checkout.name")}</span>
                <input
                  className={cn(s.input, errors.name && s.inputError)}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && <span className={s.err}>{errors.name}</span>}
              </label>
              <label className={s.field}>
                <span className={s.label}>{t("checkout.email")}</span>
                <input
                  className={cn(s.input, errors.email && s.inputError)}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <span className={s.err}>{errors.email}</span>}
              </label>
              <label className={s.field}>
                <span className={s.label}>{t("checkout.phone")}</span>
                <input
                  className={cn(s.input, errors.phone && s.inputError)}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+375 (29) 000-00-00"
                />
                {errors.phone && <span className={s.err}>{errors.phone}</span>}
              </label>
              <label className={s.field}>
                <span className={s.label}>{t("checkout.comment")}</span>
                <textarea
                  className={s.textarea}
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t("checkout.commentPlaceholder")}
                />
              </label>
            </div>

            <h2 className={s.h2}>{t("checkout.payment")}</h2>
            <div className={s.radioGroup}>
              <label className={s.radioLabel}>
                <input
                  type="radio"
                  className="checkbox-radio"
                  name="pay"
                  checked={payment === "card"}
                  onChange={() => setPayment("card")}
                />
                <span>{t("checkout.paymentCard")}</span>
              </label>
              <label className={s.radioLabel}>
                <input
                  type="radio"
                  className="checkbox-radio"
                  name="pay"
                  checked={payment === "cash"}
                  onChange={() => setPayment("cash")}
                />
                <span>{t("checkout.paymentCash")}</span>
              </label>
            </div>

            {payment === "card" && (
              <div className={s.paymentBlock}>
                {cards.length > 0 && !showCardForm && (
                  <>
                    <p className={s.hint}>{t("checkout.selectCard")}</p>
                    <div className={s.cardList}>
                      {cards.map((c) => (
                        <label
                          key={c.id}
                          className={cn(
                            s.cardOption,
                            selectedCardId === c.id && s.cardOptionActive,
                          )}
                        >
                          <input
                            type="radio"
                            className="checkbox-radio"
                            name="savedCard"
                            checked={selectedCardId === c.id}
                            onChange={() => setSelectedCardId(c.id)}
                          />
                          <span>
                            {c.brand} •••• {c.last4} <small>({c.exp})</small>
                          </span>
                        </label>
                      ))}
                    </div>
                    <button
                      type="button"
                      className={s.linkBtn}
                      onClick={() => setShowCardForm(true)}
                    >
                      + {t("checkout.addNewCard")}
                    </button>
                  </>
                )}
                {(showCardForm || cards.length === 0) && (
                  <div className={s.cardForm}>
                    <p className={s.hint}>
                      {cards.length === 0
                        ? t("checkout.addCardForPayment")
                        : t("checkout.newCard")}
                    </p>
                    <div className={s.cardGrid}>
                      <label className={cn(s.field, s.fullField)}>
                        <span className={s.label}>
                          {t("checkout.cardNumber")}
                        </span>
                        <input
                          className={cn(
                            s.input,
                            errors.cardNum && s.inputError,
                          )}
                          value={cardNum}
                          inputMode="numeric"
                          placeholder="0000 0000 0000 0000"
                          onChange={(e) =>
                            setCardNum(formatCardNum(e.target.value))
                          }
                        />
                        {errors.cardNum && (
                          <span className={s.err}>{errors.cardNum}</span>
                        )}
                      </label>
                      <label className={s.field}>
                        <span className={s.label}>
                          {t("checkout.cardExpiry")}
                        </span>
                        <input
                          className={cn(
                            s.input,
                            errors.cardExp && s.inputError,
                          )}
                          value={cardExp}
                          inputMode="numeric"
                          placeholder="MM/YY"
                          onChange={(e) =>
                            setCardExp(formatExp(e.target.value))
                          }
                        />
                        {errors.cardExp && (
                          <span className={s.err}>{errors.cardExp}</span>
                        )}
                      </label>
                      <label className={s.field}>
                        <span className={s.label}>{t("checkout.cardCvv")}</span>
                        <input
                          className={cn(
                            s.input,
                            errors.cardCvv && s.inputError,
                          )}
                          value={cardCvv}
                          inputMode="numeric"
                          maxLength={4}
                          placeholder="123"
                          onChange={(e) =>
                            setCardCvv(e.target.value.replace(/\D/g, ""))
                          }
                        />
                        {errors.cardCvv && (
                          <span className={s.err}>{errors.cardCvv}</span>
                        )}
                      </label>
                      <label className={cn(s.field, s.fullField)}>
                        <span className={s.label}>
                          {t("checkout.cardHolder")}
                        </span>
                        <input
                          className={cn(
                            s.input,
                            errors.cardHolder && s.inputError,
                          )}
                          value={cardHolder}
                          placeholder="IVAN IVANOV"
                          onChange={(e) =>
                            setCardHolder(e.target.value.toUpperCase())
                          }
                        />
                        {errors.cardHolder && (
                          <span className={s.err}>{errors.cardHolder}</span>
                        )}
                      </label>
                    </div>
                    {cards.length > 0 && (
                      <button
                        type="button"
                        className={s.linkBtn}
                        onClick={() => {
                          setShowCardForm(false);
                          setCardNum("");
                          setCardExp("");
                          setCardCvv("");
                          setCardHolder("");
                        }}
                      >
                        {t("checkout.useSavedCard")}
                      </button>
                    )}
                  </div>
                )}
                <p className={s.hint}>{t("checkout.cardSecureNotice")}</p>
              </div>
            )}
            {payment === "cash" && (
              <p className={s.hint}>{t("checkout.cashOnDelivery")}</p>
            )}

            <h2 className={s.h2}>{t("checkout.delivery")}</h2>
            <div className={s.radioGroup}>
              <label className={s.radioLabel}>
                <input
                  type="radio"
                  className="checkbox-radio"
                  name="dlv"
                  checked={delivery === "pickup"}
                  onChange={() => setDelivery("pickup")}
                />
                <span>{t("checkout.deliveryPickup")}</span>
              </label>
              <label className={s.radioLabel}>
                <input
                  type="radio"
                  className="checkbox-radio"
                  name="dlv"
                  checked={delivery === "courier"}
                  onChange={() => setDelivery("courier")}
                />
                <span>{t("checkout.deliveryCourier")}</span>
              </label>
            </div>
            {delivery === "pickup" ? (
              <div className={s.officeBox}>
                <strong>{t("checkout.pickupPoint")}:</strong> {OFFICE_ADDRESS}
              </div>
            ) : (
              <label className={s.field}>
                <span className={s.label}>{t("checkout.courierAddress")}</span>
                <input
                  className={cn(s.input, errors.address && s.inputError)}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t("checkout.courierAddressPlaceholder")}
                />
                {errors.address && (
                  <span className={s.err}>{errors.address}</span>
                )}
              </label>
            )}

            <h2 className={s.h2}>{t("checkout.total")}</h2>
            <div className={s.sumRow}>
              <span>{t("checkout.products")}</span>
              <strong>{format(totalPrice)}</strong>
            </div>
            {discount > 0 && (
              <div className={s.sumRow}>
                <span>{t("cart.discount")}</span>
                <strong>−{format(discount)}</strong>
              </div>
            )}
            <div className={cn(s.sumRow, s.total)}>
              <span>{t("checkout.totalAmount")}</span>
              <strong>{format(total)}</strong>
            </div>
            <label className={s.consent}>
              <input
                type="checkbox"
                className="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <span>
                {t("checkout.consentText")}{" "}
                <a href="/docs/terms-of-use.pdf">
                  {t("checkout.marketplaceRules")}
                </a>{" "}
                {t("checkout.and")}{" "}
                <a href="https://belpotreb.by/zakon-o-zashhite-prav-potrebitelej/statya-28/">
                  {t("checkout.returnsPolicy")}
                </a>
                .
              </span>
            </label>
            {errors.consent && <p className={s.err}>{errors.consent}</p>}
            {errors.card && <p className={s.err}>{errors.card}</p>}
            {serverError && <p className={s.serverError}>{serverError}</p>}
            <Button
              type="submit"
              fullWidth
              disabled={submitting}
              style={{ marginTop: 12 }}
            >
              {submitting ? t("checkout.submitting") : t("checkout.submit")}
            </Button>
          </LayoutCard>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
