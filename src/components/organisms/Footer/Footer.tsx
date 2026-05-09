import { Link } from "react-router-dom";
import styles from "./Footer.module.css";

export const Footer = () => (
  <footer className={styles.footer}>
    <div className={styles.inner}>
      <div>
        <h4 className={styles.heading}>Подписаться</h4>
        <p className={styles.text}>
          Подпишитесь на новости DRON.BY и узнавайте первыми о новинках, акциях
          и поступлениях квадрокоптеров.
        </p>
        <form className={styles.subscribe} onSubmit={(e) => e.preventDefault()}>
          <input type="email" placeholder="E-mail" />
          <button type="submit">Подписаться</button>
        </form>
      </div>
      <div>
        <h4 className={styles.heading}>Как приобрести</h4>
        <ul className={styles.links}>
          <li>
            <Link to="/docs/delivery">Доставка</Link>
          </li>
          <li>
            <Link to="/docs/payment">Оплата</Link>
          </li>
          <li>
            <a
              href="/docs/oferta.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Публичная оферта
            </a>
          </li>
          <li>
            <a
              href="https://belpotreb.by/zakon-o-zashhite-prav-potrebitelej/statya-28/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Политика возврата товара
            </a>
          </li>
          <li>
            <a
              href="/docs/terms-of-use.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              Правила пользования торговой площадкой
            </a>
          </li>
        </ul>
      </div>
      <div>
        <h4 className={styles.heading}>Полезная информация</h4>
        <ul className={styles.links}>
          <li>
            <Link to="/contacts">Наши контакты</Link>
          </li>
          <li>
            <Link to="/news">Новости</Link>
          </li>
          <li>
            <Link to="/promotions">Акции и скидки</Link>
          </li>
          <li>
            <Link to="/catalog">Каталог дронов</Link>
          </li>
        </ul>
      </div>
      <div>
        <h4 className={styles.heading}>Личное пространство</h4>
        <ul className={styles.links}>
          <li>
            <Link to="/login">Войти в кабинет</Link>
          </li>
          <li>
            <Link to="/cart">Моя корзина</Link>
          </li>
          <li>
            <Link to="/favorites">Избранные товары</Link>
          </li>
          <li>
            <Link to="/register">Регистрация</Link>
          </li>
        </ul>
      </div>
    </div>
    <div className={styles.bottom}>
      <span>
        Copyright © 2026 | "DRON.BY" — магазин квадрокоптеров и аксессуаров
      </span>
      <a
        href="https://center.gov.by/upload/pdf/politika_personal_data_2024.pdf"
        className={styles.docLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        Политика конфиденциальности
      </a>
      <a
        href="/docs/user-agreement.pdf"
        className={styles.docLink}
        target="_blank"
        rel="noopener noreferrer"
      >
        Пользовательское соглашение
      </a>
    </div>
  </footer>
);
