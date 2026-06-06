import i18n from "@/i18n";

const FORMSPREE_ORDER_ID = "xdabkvoy";
const FORMSPREE_ORDER_URL = `https://formspree.io/f/${FORMSPREE_ORDER_ID}`;

export interface OrderItemLine {
  id: number;
  title: string;
  quantity: number;
  price: number;
}

export interface OrderPayload {
  name: string;
  email: string;
  phone?: string;
  delivery: "pickup" | "courier";
  address?: string;
  pickupAddress?: string;
  payment: "card" | "cash";
  cardLast4?: string;
  comment?: string;
  items: OrderItemLine[];
  total: number;
}

const t = (key: string) => {
  const translations: Record<string, Record<string, string>> = {
    ru: {
      "order.newOrder": "Новый заказ DRON.BY",
      "order.customer": "Покупатель",
      "order.email": "Email",
      "order.phone": "Телефон",
      "order.deliveryPickup": "Самовывоз",
      "order.deliveryCourier": "Курьер",
      "order.paymentCard": "Карта",
      "order.paymentCash": "При получении",
      "order.comment": "Комментарий",
      "order.items": "Заказ",
      "order.total": "Итого",
      "order.submitError": "Не удалось отправить заказ. Попробуйте позже.",
    },
    be: {
      "order.newOrder": "Новы заказ DRON.BY",
      "order.customer": "Пакупнік",
      "order.email": "Email",
      "order.phone": "Тэлефон",
      "order.deliveryPickup": "Самавываз",
      "order.deliveryCourier": "Кур'ер",
      "order.paymentCard": "Карта",
      "order.paymentCash": "Пры атрыманні",
      "order.comment": "Каментар",
      "order.items": "Заказ",
      "order.total": "Разам",
      "order.submitError": "Не атрымалася адправіць заказ. Паспрабуйце пазней.",
    },
    en: {
      "order.newOrder": "New order at DRON.BY",
      "order.customer": "Customer",
      "order.email": "Email",
      "order.phone": "Phone",
      "order.deliveryPickup": "Pickup",
      "order.deliveryCourier": "Courier",
      "order.paymentCard": "Card",
      "order.paymentCash": "Cash on delivery",
      "order.comment": "Comment",
      "order.items": "Order",
      "order.total": "Total",
      "order.submitError": "Failed to submit order. Please try again later.",
    },
    pl: {
      "order.newOrder": "Nowe zamówienie w DRON.BY",
      "order.customer": "Klient",
      "order.email": "Email",
      "order.phone": "Telefon",
      "order.deliveryPickup": "Odbiór osobisty",
      "order.deliveryCourier": "Kurier",
      "order.paymentCard": "Karta",
      "order.paymentCash": "Za pobraniem",
      "order.comment": "Komentarz",
      "order.items": "Zamówienie",
      "order.total": "Razem",
      "order.submitError":
        "Nie udało się wysłać zamówienia. Spróbuj ponownie później.",
    },
  };
  const lang = i18n.language as keyof typeof translations;
  return translations[lang]?.[key] ?? translations.ru[key];
};

/**
 * Send the order to Formspree. Returns true on success.
 * Errors bubble up so the UI can show feedback.
 */
export async function submitOrder(p: OrderPayload): Promise<void> {
  const itemsList = p.items
    .map(
      (i) =>
        `• ${i.title} × ${i.quantity} = ${(i.price * i.quantity).toFixed(2)} BYN`,
    )
    .join("\n");

  const deliveryText =
    p.delivery === "pickup"
      ? `${t("order.deliveryPickup")} (${p.pickupAddress ?? ""})`
      : `${t("order.deliveryCourier")} — ${p.address ?? ""}`;

  const paymentText =
    p.payment === "card"
      ? `${t("order.paymentCard")}${p.cardLast4 ? " ****" + p.cardLast4 : ""}`
      : t("order.paymentCash");

  const message =
    `${t("order.newOrder")}\n\n` +
    `${t("order.customer")}: ${p.name}\n` +
    `${t("order.email")}: ${p.email}\n` +
    (p.phone ? `${t("order.phone")}: ${p.phone}\n` : "") +
    `${t("order.deliveryPickup")}: ${deliveryText}\n` +
    `${t("order.paymentCard")}: ${paymentText}\n` +
    (p.comment ? `\n${t("order.comment")}:\n${p.comment}\n` : "") +
    `\n${t("order.items")}:\n${itemsList}\n\n${t("order.total")}: ${p.total.toFixed(2)} BYN`;

  const res = await fetch(FORMSPREE_ORDER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      email: p.email,
      _replyto: p.email,
      name: p.name,
      subject: t("order.newOrder"),
      message,
    }),
  });
  if (!res.ok) throw new Error(t("order.submitError"));
}
