import promoMini from "@/assets/images/promotions/promo-mini.jpg";
import promoMavic from "@/assets/images/promotions/promo-mavic.jpg";
import promoAction from "@/assets/images/promotions/promo-action.jpg";
import promoFpv from "@/assets/images/promotions/promo-fpv.jpg";
import promoOsmo from "@/assets/images/promotions/promo-osmo.jpg";
import promoCetus from "@/assets/images/promotions/promo-cetus.jpg";

export interface Promotion {
  id: number;
  title: string;
  period: string;
  image: string;
  description: string;
  productIds: number[];
  discount: number;
  badge?: string;
}

export const PROMOTIONS: Promotion[] = [
  {
    id: 1,
    title: "−10% на DJI Mini 4 Pro Fly More Combo",
    period: "до 31 мая 2026",
    image: promoMini,
    description:
      "Скидка на самый компактный складной дрон DJI с камерой 4K/100fps. Действует на все цвета комплектации.",
    productIds: [2],
    discount: 10,
    badge: "−10%",
  },
  {
    id: 2,
    title: "Подарок: набор ND-фильтров при покупке Mavic 3 Pro",
    period: "при покупке любой комплектации",
    image: promoMavic,
    description:
      "Получите оригинальный набор фильтров ND8/16/32/64 в подарок при заказе Mavic 3 Pro Cine.",
    productIds: [1],
    discount: 0,
    badge: "Подарок",
  },
  {
    id: 3,
    title: "Карта памяти Lexar 256GB в подарок к экшн-камерам",
    period: "до окончания запасов",
    image: promoAction,
    description:
      "При покупке Insta360 X4 или GoPro HERO12 — карта памяти microSDXC 256GB бесплатно.",
    productIds: [24, 25],
    discount: 0,
    badge: "Подарок",
  },
  {
    id: 4,
    title: "−15% на FPV-аксессуары при заказе DJI Avata 2",
    period: "постоянная акция",
    image: promoFpv,
    description:
      "Дополнительные батареи, защита пропеллеров и кейсы со скидкой 15% к комплекту Avata 2.",
    productIds: [4, 15],
    discount: 15,
    badge: "−15%",
  },
  {
    id: 5,
    title: "−20% на DJI Osmo Pocket 3 Creator Combo",
    period: "до 15 июня 2026",
    image: promoOsmo,
    description:
      'Снижение цены на топовую карманную камеру с 1" сенсором и 4K/120fps — ограниченное предложение.',
    productIds: [23],
    discount: 20,
    badge: "−20%",
  },
  {
    id: 6,
    title: "−12% на FPV-стартовый набор BetaFPV Cetus Pro",
    period: "для начинающих пилотов",
    image: promoCetus,
    description:
      "Готовый комплект для первых полётов: квадрокоптер, очки и пульт со скидкой 12% — идеально для входа в FPV.",
    productIds: [8],
    discount: 12,
    badge: "−12%",
  },
];

export function getProductPromo(productId: number) {
  let best: { discount: number; badge?: string } | null = null;
  for (const p of PROMOTIONS) {
    if (!p.productIds.includes(productId)) continue;
    if (!best || p.discount > best.discount) {
      best = { discount: p.discount, badge: p.badge };
    }
  }
  return best;
}

export function applyDiscount(price: number, discount: number) {
  return Math.round(price * (1 - discount / 100));
}
