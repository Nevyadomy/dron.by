import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ChevronDown, ChevronUp } from "lucide-react";
import styles from "./Footer.module.css";

export const Footer = () => {
  const { t } = useTranslation();
  const [isMobile, setIsMobile] = useState(false);
  const [openSections, setOpenSections] = useState({
    howBuy: false,
    info: false,
    personal: false,
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        {/* Блок подписки - всегда виден */}
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

        {/* Блок "Как приобрести" */}
        <div className={styles.section}>
          <div
            className={styles.sectionHeader}
            onClick={() => isMobile && toggleSection("howBuy")}
          >
            <h4 className={styles.heading}>{t("footer.howBuy")}</h4>
            {isMobile &&
              (openSections.howBuy ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              ))}
          </div>
          <div
            className={`${styles.sectionContent} ${isMobile && !openSections.howBuy ? styles.collapsed : ""}`}
          >
            <ul className={styles.links}>
              <li>
                <Link to="/docs/delivery">{t("footer.delivery")}</Link>
              </li>
              <li>
                <Link to="/docs/payment">{t("footer.payment")}</Link>
              </li>
              <li>
                <a
                  href="/docs/oferta.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("footer.offer")}
                </a>
              </li>
              <li>
                <a
                  href="https://belpotreb.by/zakon-o-zashhite-prav-potrebitelej/statya-28/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("footer.returnsPolicy")}
                </a>
              </li>
              <li>
                <a
                  href="/docs/terms-of-use.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("footer.marketplaceRules")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Блок "Полезная информация" */}
        <div className={styles.section}>
          <div
            className={styles.sectionHeader}
            onClick={() => isMobile && toggleSection("info")}
          >
            <h4 className={styles.heading}>{t("footer.info")}</h4>
            {isMobile &&
              (openSections.info ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              ))}
          </div>
          <div
            className={`${styles.sectionContent} ${isMobile && !openSections.info ? styles.collapsed : ""}`}
          >
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
              <li>
                <Link to="/compare">{t("footer.compare")}</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Блок "Личное пространство" */}
        <div className={styles.section}>
          <div
            className={styles.sectionHeader}
            onClick={() => isMobile && toggleSection("personal")}
          >
            <h4 className={styles.heading}>{t("footer.personal")}</h4>
            {isMobile &&
              (openSections.personal ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              ))}
          </div>
          <div
            className={`${styles.sectionContent} ${isMobile && !openSections.personal ? styles.collapsed : ""}`}
          >
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
      </div>

      <div className={styles.bottom}>
        <span>{t("footer.copyright")}</span>
        <a
          href="https://center.gov.by/upload/pdf/politika_personal_data_2024.pdf"
          className={styles.docLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("footer.privacyPolicy")}
        </a>
        <a
          href="/docs/user-agreement.pdf"
          className={styles.docLink}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t("footer.termsOfUse")}
        </a>
      </div>
    </footer>
  );
};
