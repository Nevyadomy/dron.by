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
  address?: string;
  comment?: string;
  items: OrderItemLine[];
  total: number;
}

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
  const message =
    `Новый заказ DRON.BY\n\n` +
    `Покупатель: ${p.name}\n` +
    `Email: ${p.email}\n` +
    (p.phone ? `Телефон: ${p.phone}\n` : "") +
    (p.address ? `Адрес: ${p.address}\n` : "") +
    (p.comment ? `\nКомментарий:\n${p.comment}\n` : "") +
    `\nЗаказ:\n${itemsList}\n\nИтого: ${p.total.toFixed(2)} BYN`;

  const res = await fetch(FORMSPREE_ORDER_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      email: p.email,
      _replyto: p.email,
      name: p.name,
      subject: "Новый заказ DRON.BY",
      message,
    }),
  });
  if (!res.ok) throw new Error("Не удалось отправить заказ. Попробуйте позже.");
}
