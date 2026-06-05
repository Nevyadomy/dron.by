import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import styles from "./Footer.module.css";

export const Footer = () => {
  const { t } = useTranslation();
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <h4 className={styles.heading}>{t("footer.subscribe")}</h4>
          <p className={styles.text}>{t("footer.subscribeText")}</p>
          <form
            className={styles.subscribe}
            onSubmit={(e) => e.preventDefault()}
          >
            <input type="email" placeholder="E-mail" />
            <button type="submit">{t("footer.subscribe")}</button>
          </form>
        </div>
        <div>
          <h4 className={styles.heading}>{t("footer.howBuy")}</h4>
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
          <h4 className={styles.heading}>{t("footer.info")}</h4>
          <ul className={styles.links}>
            <li>
              <Link to="/contacts">{t("footer.ourContacts")}</Link>
            </li>
            <li>
              <Link to="/news">{t("footer.news")}</Link>
            </li>
            <li>
              <Link to="/promotions">{t("footer.promotions")}</Link>
            </li>
            <li>
              <Link to="/catalog">{t("footer.catalog")}</Link>
            </li>
            <li>
              <Link to="/about">{t("footer.about")}</Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className={styles.heading}>{t("footer.personal")}</h4>
          <ul className={styles.links}>
            <li>
              <Link to="/login">{t("footer.loginAccount")}</Link>
            </li>
            <li>
              <Link to="/cart">{t("footer.myCart")}</Link>
            </li>
            <li>
              <Link to="/favorites">{t("footer.favItems")}</Link>
            </li>
            <li>
              <Link to="/register">{t("footer.register")}</Link>
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
};
