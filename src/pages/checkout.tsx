import { useEffect, useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { LayoutCard } from "@/components/atoms/LayoutCard";
import { Button } from "@/components/atoms/Button";
import { SmartImage } from "@/components/atoms/SmartImage";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/useAuth";
import { useCurrency } from "@/hooks/useCurrency";
import { submitOrder } from "@/services/orderService";
import { getProductPromo, applyDiscount } from "@/data/promotions";
import dronePlaceholder from "@/assets/images/common/drone-placeholder.png";
import { cn } from "@/utils/cn";
import s from "./checkout.module.css";

const CheckoutPage = () => {
  const { state, totalPrice, clear } = useCart();
  const { user } = useAuth();
  const { format } = useCurrency();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [address, setAddress] = useState("");
  const [comment, setComment] = useState("");
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Оформление заказа | DRON.BY";
  }, []);

  if (state.items.length === 0 && !done) return <Navigate to="/cart" replace />;

  const discount = state.items.reduce((sum, i) => {
    const promo = getProductPromo(i.id);
    if (!promo || promo.discount <= 0) return sum;
    const discounted = applyDiscount(i.price, promo.discount);
    return sum + (i.price - discounted) * i.quantity;
  }, 0);
  const total = totalPrice - discount;

  const validate = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Укажите имя";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Некорректный email";
    if (phone && phone.replace(/\D/g, "").length < 7)
      e.phone = "Некорректный телефон";
    if (!consent) e.consent = "Подтвердите согласие";
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
    try {
      await submitOrder({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        address: address.trim() || undefined,
        comment: comment.trim() || undefined,
        items: state.items.map((i) => {
          const promo = getProductPromo(i.id);
          const price =
            promo && promo.discount > 0
              ? applyDiscount(i.price, promo.discount)
              : i.price;
          return { id: i.id, title: i.title, quantity: i.quantity, price };
        }),
        total,
      });
      clear();
      setDone(true);
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      setServerError(
        err instanceof Error ? err.message : "Не удалось оформить заказ.",
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
            { label: "Главная", to: "/" },
            { label: "Корзина", to: "/cart" },
            { label: "Оформление" },
          ]}
        />
        <LayoutCard padded>
          <p className={s.success}>
            Заказ оформлен! Перенаправляем на главную…
          </p>
          <Link to="/catalog">
            <Button>Перейти в каталог</Button>
          </Link>
        </LayoutCard>
      </div>
    );
  }

  return (
    <div className="page-container">
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Оформление заказа</h1>
      <Breadcrumbs
        items={[
          { label: "Главная", to: "/" },
          { label: "Корзина", to: "/cart" },
          { label: "Оформление" },
        ]}
      />

      <form className={s.layout} onSubmit={onSubmit}>
        <LayoutCard className={s.section}>
          <h2 className={s.h2}>Данные покупателя</h2>
          <div className={s.fields}>
            <label className={s.field}>
              <span className={s.label}>Имя</span>
              <input
                className={cn(s.input, errors.name && s.inputError)}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              {errors.name && <span className={s.err}>{errors.name}</span>}
            </label>
            <label className={s.field}>
              <span className={s.label}>Email</span>
              <input
                className={cn(s.input, errors.email && s.inputError)}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <span className={s.err}>{errors.email}</span>}
            </label>
            <label className={s.field}>
              <span className={s.label}>Телефон</span>
              <input
                className={cn(s.input, errors.phone && s.inputError)}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+375 (29) 000-00-00"
              />
              {errors.phone && <span className={s.err}>{errors.phone}</span>}
            </label>
            <label className={s.field}>
              <span className={s.label}>Адрес доставки</span>
              <input
                className={s.input}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Город, улица, дом, кв."
              />
            </label>
            <label className={s.field}>
              <span className={s.label}>Комментарий к заказу</span>
              <textarea
                className={s.textarea}
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Опционально"
              />
            </label>
          </div>

          <h2 className={s.h2} style={{ marginTop: 24 }}>
            Состав заказа
          </h2>
          {state.items.map((i) => (
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
                <div className={s.meta}>{i.quantity} шт.</div>
              </div>
              <div className={s.price}>{format(i.price * i.quantity)}</div>
            </div>
          ))}
        </LayoutCard>

        <LayoutCard className={s.section}>
          <h2 className={s.h2}>Итого</h2>
          <div className={s.sumRow}>
            <span>Товары</span>
            <strong>{format(totalPrice)}</strong>
          </div>
          <div className={s.sumRow}>
            <span>Скидка</span>
            <strong>{format(discount)}</strong>
          </div>
          <div className={cn(s.sumRow, s.total)}>
            <span>К оплате</span>
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
              Соглашаюсь с правилами магазина и обработкой персональных данных.
            </span>
          </label>
          {errors.consent && <p className={s.err}>{errors.consent}</p>}

          {serverError && <p className={s.serverError}>{serverError}</p>}

          <Button
            type="submit"
            fullWidth
            disabled={submitting}
            style={{ marginTop: 12 }}
          >
            {submitting ? "Отправляем…" : "Подтвердить заказ"}
          </Button>
        </LayoutCard>
      </form>
    </div>
  );
};

export default CheckoutPage;
