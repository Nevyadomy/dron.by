import { useState } from "react";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/atoms/Button";
import { LayoutCard } from "@/components/atoms/LayoutCard";
import { Breadcrumbs } from "@/components/molecules/Breadcrumbs";
import { SmartImage } from "@/components/atoms/SmartImage";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/useAuth";
import { useAuthPrompt } from "@/contexts/AuthPromptContext";
import dronePlaceholder from "@/assets/images/common/drone-placeholder.png";
import { getProductPromo, applyDiscount } from "@/data/promotions";
import { productsWord } from "@/utils/pluralize";
import styles from "./cart.module.css";

const FORMSPREE_ORDER_ID = "xdabkvoy";
const FORMSPREE_ORDER_URL = `https://formspree.io/f/${FORMSPREE_ORDER_ID}`;

const CartPage = () => {
  const { state, totalCount, totalPrice, increment, decrement, remove, clear } =
    useCart();
  const { user, isAuthenticated } = useAuth();
  const { prompt } = useAuthPrompt();

  const [consent, setConsent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [buyingId, setBuyingId] = useState<number | null>(null);

  const discount = state.items.reduce((sum, i) => {
    const promo = getProductPromo(i.id);
    if (!promo || promo.discount <= 0) return sum;
    const discounted = applyDiscount(i.price, promo.discount);
    return sum + (i.price - discounted) * i.quantity;
  }, 0);
  const total = totalPrice - discount;

  if (state.items.length === 0) {
    return (
      <div className={styles.wrap}>
        <h1 style={{ fontSize: 24, fontWeight: 700 }}>Корзина</h1>
        <Breadcrumbs
          items={[{ label: "Главная", to: "/" }, { label: "Корзина" }]}
        />
        {success ? (
          <LayoutCard padded>
            <div className={styles.success}>
              Заказ оформлен! Подтверждение отправлено на ваш e-mail.
            </div>
            <Link to="/catalog">
              <Button>Вернуться в каталог</Button>
            </Link>
          </LayoutCard>
        ) : (
          <LayoutCard padded>
            <div className={styles.empty}>
              <p style={{ color: "var(--color-muted-fg)", marginBottom: 16 }}>
                Корзина пуста. Добавьте товары из каталога, чтобы оформить
                заказ.
              </p>
              <Link to="/catalog">
                <Button>Перейти в каталог</Button>
              </Link>
            </div>
          </LayoutCard>
        )}
      </div>
    );
  }

  const submitOrder = async (itemIds?: number[]) => {
    if (!isAuthenticated || !user) {
      prompt();
      return;
    }
    if (!consent) {
      setError("Подтвердите согласие с правилами.");
      return;
    }
    setError(null);
    setSubmitting(true);

    const items = itemIds
      ? state.items.filter((i) => itemIds.includes(i.id))
      : state.items;
    const orderTotal = items.reduce((sum, i) => {
      const promo = getProductPromo(i.id);
      const price =
        promo && promo.discount > 0
          ? applyDiscount(i.price, promo.discount)
          : i.price;
      return sum + price * i.quantity;
    }, 0);
    const orderItems = items
      .map(
        (i) =>
          `• ${i.title} × ${i.quantity} = ${(i.price * i.quantity).toFixed(2)} BYN`,
      )
      .join("\n");
    const message =
      `Заказ в DRON.BY\n\n` +
      `Здравствуйте, ${user.name || user.email}!\n\n` +
      `Ваш заказ оформлен:\n${orderItems}\n\n` +
      `Итого: ${orderTotal.toFixed(2)} BYN\n\n` +
      `Спасибо за покупку!`;

    try {
      if (FORMSPREE_ORDER_ID) {
        const res = await fetch(FORMSPREE_ORDER_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            email: user.email,
            _replyto: user.email,
            name: user.name || user.email,
            subject: "Заказ в DRON.BY",
            message,
            order_items: orderItems,
            total: `${orderTotal.toFixed(2)} BYN`,
          }),
        });
        if (!res.ok)
          throw new Error("Не удалось отправить заказ. Попробуйте позже.");
      }
      if (itemIds) {
        itemIds.forEach((id) => remove(id));
      } else {
        clear();
      }
      setSuccess(true);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Ошибка при оформлении заказа.",
      );
    } finally {
      setSubmitting(false);
      setBuyingId(null);
    }
  };

  const handleCheckout = () => submitOrder();
  const handleBuyOne = (id: number) => {
    setBuyingId(id);
    submitOrder([id]);
  };

  return (
    <div className={styles.wrap}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Корзина</h1>
      <Breadcrumbs
        items={[{ label: "Главная", to: "/" }, { label: "Корзина" }]}
      />

      <div className={styles.layout}>
        <LayoutCard padded>
          <div className={styles.shopHeader}>
            <div className={styles.shopTitleGroup}>
              <span className={styles.shopName}>Магазин</span>
              <span className={styles.shopMeta}>
                {totalCount} {productsWord(totalCount)}
              </span>
            </div>
            <button type="button" onClick={clear} className={styles.clearBtn}>
              Очистить корзину
            </button>
          </div>

          {state.items.map((item) => (
            <div key={item.id} className={styles.row}>
              <div className={styles.thumb}>
                <SmartImage
                  src={item.thumbnail || dronePlaceholder}
                  alt={item.title}
                  loading="lazy"
                />
              </div>
              <div>
                <Link to={`/product/${item.id}`} className={styles.title}>
                  {item.title}
                </Link>
                <div className={styles.stockBadge}>
                  <span className={styles.stockDot} />В наличии
                </div>
              </div>
              <div className={styles.qty}>
                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={() => decrement(item.id)}
                  aria-label="Уменьшить"
                  title="Уменьшить"
                >
                  <Minus size={14} />
                </button>
                <span className={styles.qtyValue}>{item.quantity}</span>
                <button
                  type="button"
                  className={styles.qtyBtn}
                  onClick={() => increment(item.id)}
                  aria-label="Увеличить"
                  title="Увеличить"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                type="button"
                className={styles.buyBtn}
                onClick={() => handleBuyOne(item.id)}
                disabled={submitting}
                title="Купить этот товар"
              >
                <ShoppingBag size={14} />
                <span>
                  {buyingId === item.id && submitting ? "…" : "Купить"}
                </span>
              </button>
              <strong className={styles.price}>
                {(item.price * item.quantity).toFixed(2)}
                <i className="nbrb-icon">BYN</i>
              </strong>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => remove(item.id)}
                aria-label="Удалить"
                title="Удалить"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </LayoutCard>

        <div className={styles.summary}>
          <LayoutCard padded>
            {error && <div className={styles.error}>{error}</div>}

            <div className={styles.sumRow}>
              <span>
                {productsWord(totalCount).charAt(0).toUpperCase() +
                  productsWord(totalCount).slice(1)}
                , {totalCount} шт.
              </span>
              <strong>
                {totalPrice.toFixed(2)} <i className="nbrb-icon">BYN</i>
              </strong>
            </div>
            <div className={styles.sumRow}>
              <span>Сумма скидки</span>
              <strong>
                {discount.toFixed(2)} <i className="nbrb-icon">BYN</i>
              </strong>
            </div>
            <div className={`${styles.sumRow} ${styles.total}`}>
              <span>Итого</span>
              <strong>
                {total.toFixed(2)} <i className="nbrb-icon">BYN</i>
              </strong>
            </div>

            <Button
              fullWidth
              onClick={handleCheckout}
              disabled={submitting}
              style={{ marginTop: 16 }}
            >
              {submitting ? "Оформляем…" : "Оформить заказ"}
            </Button>

            <label className={styles.consent}>
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <span>
                Соглашаюсь с{" "}
                <a href="/docs/terms-of-use.pdf">
                  правилами пользования торговой площадкой
                </a>{" "}
                и{" "}
                <a href="https://belpotreb.by/zakon-o-zashhite-prav-potrebitelej/statya-28/">
                  возврата
                </a>
                .
              </span>
            </label>
          </LayoutCard>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
