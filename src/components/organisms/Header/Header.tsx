import {
  ArrowRight,
  Heart,
  Menu,
  Moon,
  Scale,
  Search,
  ShoppingCart,
  Sun,
  User,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/atoms/Input";
import { Badge } from "@/components/atoms/Badge";
import { LanguageSwitcher } from "@/components/atoms/LanguageSwitcher";
import { useAuth } from "@/contexts/useAuth";
import { useCart } from "@/contexts/useCart";
import { useFavorites } from "@/contexts/useFavorites";
import { useComparison } from "@/contexts/useComparison";
import { useTheme } from "@/hooks/useTheme";
import { LOCAL_PRODUCTS, searchLocal } from "@/data/products";
import { cn } from "@/utils/cn";
import logoImg from "@/assets/images/common/logo.png";
import styles from "./Header.module.css";

const NAV_KEYS: { key: string; to: string }[] = [
  { key: "home", to: "/" },
  { key: "about", to: "/about" },
  { key: "catalog", to: "/catalog" },
  { key: "promotions", to: "/promotions" },
  { key: "news", to: "/news" },
  { key: "contacts", to: "/contacts" },
];

export interface HeaderProps {
  searchQuery?: string;
}

export const Header = ({ searchQuery = "" }: HeaderProps) => {
  const { theme, toggle } = useTheme();
  const { t } = useTranslation();
  const navItems = NAV_KEYS.map((n) => ({
    to: n.to,
    label: t(`nav.${n.key}`),
  }));
  const { count: favCount } = useFavorites();
  const { count: compareCount } = useComparison();
  const { totalCount: cartCount } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const searchRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => document.body.classList.remove("no-scroll");
  }, [menuOpen]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setSuggestOpen(false);
        setMobileSearchOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close suggestions on outside click.
  useEffect(() => {
    if (!suggestOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!searchRef.current?.contains(e.target as Node)) setSuggestOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [suggestOpen]);

  // Закрытие поля поиска при клике вне формы (для планшетов)
  useEffect(() => {
    if (!mobileSearchOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setMobileSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [mobileSearchOpen]);

  const trimmed = localQuery.trim();
  const suggestions = useMemo(() => {
    if (!trimmed)
      return {
        categories: [],
        brands: [],
        products: [] as typeof LOCAL_PRODUCTS,
      };
    const q = trimmed.toLowerCase();
    const cats = Array.from(new Set(LOCAL_PRODUCTS.map((p) => p.category)))
      .filter((c) => c.toLowerCase().includes(q))
      .slice(0, 6);
    const brnds = Array.from(new Set(LOCAL_PRODUCTS.map((p) => p.brand)))
      .filter((b) => b.toLowerCase().includes(q))
      .slice(0, 6);
    const prods = searchLocal(LOCAL_PRODUCTS, trimmed).slice(0, 5);
    return { categories: cats, brands: brnds, products: prods };
  }, [trimmed]);
  const goSearch = (q: string) => {
    const v = q.trim();
    setSuggestOpen(false);
    setMobileSearchOpen(false);
    if (v) navigate(`/search?q=${encodeURIComponent(v)}`);
    else navigate("/search");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    goSearch(localQuery);
  };

  const closeMenu = () => setMenuOpen(false);
  const goAndClose = (to: string) => {
    closeMenu();
    navigate(to);
  };

  const hasBurgerNotice = favCount > 0 || cartCount > 0 || compareCount > 0;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} aria-label={t("header.logoAria")}>
          <img src={logoImg} alt="DRON.BY" width={140} height={48} />
        </Link>

        <form
          ref={searchRef}
          className={cn(styles.search, mobileSearchOpen && styles.searchOpen)}
          onSubmit={handleSubmit}
          role="search"
        >
          <Input
            type="search"
            placeholder={t("header.search")}
            value={localQuery}
            onChange={(e) => {
              setLocalQuery(e.target.value);
              setSuggestOpen(true);
            }}
            onFocus={() => setSuggestOpen(true)}
            className={styles.searchInput}
          />
          <button
            type="submit"
            className={styles.searchBtn}
            aria-label={t("header.find")}
            title={t("header.find")}
          >
            <Search size={16} />
          </button>

          {suggestOpen && trimmed && (
            <div className={styles.suggest} role="listbox">
              {(suggestions.categories.length > 0 ||
                suggestions.brands.length > 0) && (
                <div className={styles.suggestSection}>
                  <div className={styles.suggestLabel}>
                    {t("header.suggestCatsBrands")}
                  </div>
                  <div className={styles.chips}>
                    {suggestions.categories.map((c) => (
                      <button
                        type="button"
                        key={`c-${c}`}
                        className={styles.chip}
                        onClick={() => goSearch(c)}
                      >
                        {c}
                      </button>
                    ))}
                    {suggestions.brands.map((b) => (
                      <button
                        type="button"
                        key={`b-${b}`}
                        className={styles.chip}
                        onClick={() => goSearch(b)}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {suggestions.products.length > 0 && (
                <div className={styles.suggestSection}>
                  <div className={styles.suggestLabel}>
                    {t("header.suggestProducts")}
                  </div>
                  <ul className={styles.suggestList}>
                    {suggestions.products.map((p) => (
                      <li key={p.id}>
                        <button
                          type="button"
                          className={styles.suggestItem}
                          onClick={() => {
                            setSuggestOpen(false);
                            setMobileSearchOpen(false);
                            navigate(`/product/${p.id}`);
                          }}
                        >
                          <span className={styles.suggestThumb}>
                            {p.thumbnail && (
                              <img src={p.thumbnail} alt="" loading="lazy" />
                            )}
                          </span>
                          <span className={styles.suggestText}>
                            <span className={styles.suggestTitle}>
                              {p.title}
                            </span>
                            <span className={styles.suggestMeta}>
                              {p.category} · {p.brand}
                            </span>
                          </span>
                          <ArrowRight
                            size={16}
                            className={styles.suggestArrow}
                          />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {suggestions.products.length === 0 &&
                suggestions.categories.length === 0 &&
                suggestions.brands.length === 0 && (
                  <div className={styles.suggestEmpty}>
                    {t("header.suggestEmpty")}
                  </div>
                )}
              <button
                type="button"
                className={styles.suggestAll}
                onClick={() => goSearch(localQuery)}
              >
                {t("header.suggestAll", { q: trimmed })}
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </form>

        <div className={styles.mobileTools}>
          {isAuthenticated && (user?.avatar || user?.picture) ? (
            <Link
              to="/profile"
              className={styles.iconBtn}
              aria-label={t("header.profile")}
              title={t("header.profile")}
            >
              <img
                src={user.avatar || user.picture}
                alt=""
                className={styles.userAvatar}
              />
            </Link>
          ) : null}
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => setMobileSearchOpen((v) => !v)}
            aria-label={t("header.find")}
            title={t("header.find")}
          >
            <Search size={20} />
          </button>
          {!(isAuthenticated && (user?.avatar || user?.picture)) && (
            <Link
              to={isAuthenticated ? "/profile" : "/login"}
              className={styles.iconBtn}
              aria-label={
                isAuthenticated ? t("header.profile") : t("header.login")
              }
              title={isAuthenticated ? t("header.profile") : t("header.login")}
            >
              <User size={20} />
            </Link>
          )}
        </div>

        <div className={styles.actions}>
          <LanguageSwitcher />
          <button
            type="button"
            className={cn(styles.iconBtn, styles.searchIcon)}
            onClick={() => setMobileSearchOpen((v) => !v)}
            aria-label={t("header.find")}
            title={t("header.find")}
          >
            <Search size={20} />
          </button>
          <button
            type="button"
            className={cn(styles.iconBtn, styles.themeBtn)}
            onClick={toggle}
            title={t("header.theme")}
            aria-label={t("header.theme")}
          >
            {theme === "light" ? (
              <Moon key="moon" size={20} />
            ) : (
              <Sun key="sun" size={20} />
            )}
          </button>

          <Link
            to="/compare"
            className={styles.iconBtn}
            aria-label={t("header.compare", { defaultValue: "Сравнение" })}
            title={t("header.compare", { defaultValue: "Сравнение" })}
          >
            <Scale size={20} />
            {compareCount > 0 && <Badge floating>{compareCount}</Badge>}
          </Link>

          <Link
            to="/favorites"
            className={styles.iconBtn}
            aria-label={t("header.favorites")}
            title={t("header.favorites")}
          >
            <Heart size={20} />
            {favCount > 0 && <Badge floating>{favCount}</Badge>}
          </Link>

          <Link
            to="/cart"
            className={styles.iconBtn}
            aria-label={t("header.cart")}
            title={t("header.cart")}
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && <Badge floating>{cartCount}</Badge>}
          </Link>

          {isAuthenticated ? (
            <Link
              to="/profile"
              className={styles.userBlock}
              title={t("header.profile")}
            >
              {user?.avatar || user?.picture ? (
                <img
                  src={user.avatar || user.picture}
                  alt=""
                  className={styles.userAvatar}
                />
              ) : (
                <span className={styles.iconBtn} aria-hidden>
                  <User size={20} />
                </span>
              )}
              <span className={styles.userName}>
                {user?.name || user?.email}
              </span>
            </Link>
          ) : (
            <Link
              to="/login"
              className={styles.iconBtn}
              aria-label={t("header.login")}
              title={t("header.login")}
            >
              <User size={20} />
            </Link>
          )}
        </div>
        <button
          type="button"
          className={styles.burger}
          aria-label={t("header.menu")}
          title={t("header.menu")}
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={24} />
          {hasBurgerNotice && <span className={styles.burgerDot} aria-hidden />}
        </button>
      </div>

      <nav className={styles.nav}>
        <ul className={styles.navList}>
          {navItems.map((item, idx) => (
            <li key={item.to} className={styles.navItem}>
              <NavLink
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(styles.navLink, isActive && styles.navLinkActive)
                }
              >
                {item.label}
              </NavLink>
              {idx < navItems.length - 1 && (
                <span className={styles.navDivider} aria-hidden />
              )}
            </li>
          ))}
        </ul>
      </nav>

      {menuOpen && (
        <>
          <div
            className={styles.mobileBackdrop}
            onClick={closeMenu}
            aria-hidden
          />
          <div className={styles.mobileOverlay} role="dialog" aria-modal="true">
            <div className={styles.mobileHeader}>
              <img src={logoImg} alt="DRON.BY" />
              <button
                type="button"
                className={styles.mobileClose}
                onClick={closeMenu}
                aria-label={t("header.closeMenu")}
                title={t("header.close")}
              >
                <X size={24} />
              </button>
            </div>
            <div className={styles.mobileBody}>
              <ul className={styles.mobileNav}>
                {navItems.map((item) => (
                  <li key={item.to}>
                    <NavLink
                      to={item.to}
                      end={item.to === "/"}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        cn(
                          styles.mobileNavLink,
                          isActive && styles.mobileNavLinkActive,
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
              <div className={styles.mobileSection}>
                <div
                  style={{
                    padding: "8px 0",
                    display: "flex",
                    justifyContent: "flex-start",
                  }}
                >
                  <LanguageSwitcher />
                </div>
                <button
                  type="button"
                  className={styles.mobileAction}
                  onClick={() => {
                    toggle();
                  }}
                >
                  {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                  <span>
                    {t("header.themeLabel")}:{" "}
                    {theme === "light"
                      ? t("header.themeLight")
                      : t("header.themeDark")}
                  </span>
                </button>
                <button
                  type="button"
                  className={styles.mobileAction}
                  onClick={() => goAndClose("/compare")}
                >
                  <Scale size={20} />
                  <span>{t("header.compare")}</span>
                  {compareCount > 0 && (
                    <span className={styles.badge}>{compareCount}</span>
                  )}
                </button>
                <button
                  type="button"
                  className={styles.mobileAction}
                  onClick={() => goAndClose("/favorites")}
                >
                  <Heart size={20} />
                  <span>{t("header.favorites")}</span>
                  {favCount > 0 && (
                    <span className={styles.badge}>{favCount}</span>
                  )}
                </button>
                <button
                  type="button"
                  className={styles.mobileAction}
                  onClick={() => goAndClose("/cart")}
                >
                  <ShoppingCart size={20} />
                  <span>{t("header.cart")}</span>
                  {cartCount > 0 && (
                    <span className={styles.badge}>{cartCount}</span>
                  )}
                </button>
                {isAuthenticated && (
                  <button
                    type="button"
                    className={styles.mobileAction}
                    onClick={() => {
                      goAndClose("/profile");
                    }}
                  >
                    {user?.avatar || user?.picture ? (
                      <img
                        src={user.avatar || user.picture}
                        alt=""
                        className={styles.userAvatar}
                      />
                    ) : (
                      <User size={20} />
                    )}
                    <span>{user?.name || user?.email}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
};
