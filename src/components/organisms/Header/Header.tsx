import {
  ArrowRight,
  Heart,
  LogOut,
  Menu,
  Moon,
  Search,
  ShoppingCart,
  Sun,
  User,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Input } from "@/components/atoms/Input";
import { Badge } from "@/components/atoms/Badge";
import { useAuth } from "@/contexts/useAuth";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useTheme } from "@/hooks/useTheme";
import { LOCAL_PRODUCTS, searchLocal } from "@/data/products";
import { cn } from "@/utils/cn";
import logoImg from "@/assets/images/common/logo.png";
import styles from "./Header.module.css";

const navItems = [
  { label: "Главная", to: "/" },
  { label: "Каталог", to: "/catalog" },
  { label: "Акции", to: "/promotions" },
  { label: "Новости", to: "/news" },
  { label: "Контакты", to: "/contacts" },
];

export interface HeaderProps {
  searchQuery?: string;
}

export const Header = ({ searchQuery = "" }: HeaderProps) => {
  const { theme, toggle } = useTheme();
  const { count: favCount } = useFavorites();
  const { totalCount: cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
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

  const hasBurgerNotice = favCount > 0 || cartCount > 0;

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} aria-label="DRON.BY — на главную">
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
            placeholder="Поиск по сайту"
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
            aria-label="Найти"
            title="Найти"
          >
            <Search size={16} />
          </button>

          {suggestOpen && trimmed && (
            <div className={styles.suggest} role="listbox">
              {(suggestions.categories.length > 0 ||
                suggestions.brands.length > 0) && (
                <div className={styles.suggestSection}>
                  <div className={styles.suggestLabel}>Категории и бренды</div>
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
                  <div className={styles.suggestLabel}>Товары</div>
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
                  <div className={styles.suggestEmpty}>Ничего не найдено</div>
                )}
              <button
                type="button"
                className={styles.suggestAll}
                onClick={() => goSearch(localQuery)}
              >
                Все результаты по «{trimmed}»
                <ArrowRight size={14} />
              </button>
            </div>
          )}
        </form>

        <div className={styles.mobileTools}>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => setMobileSearchOpen((v) => !v)}
            aria-label="Поиск"
            title="Поиск"
          >
            <Search size={20} />
          </button>
          <Link
            to={isAuthenticated ? "/profile" : "/login"}
            className={styles.iconBtn}
            aria-label={isAuthenticated ? "Профиль" : "Войти"}
            title={isAuthenticated ? "Профиль" : "Войти"}
          >
            <User size={20} />
          </Link>
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            className={cn(styles.iconBtn, styles.themeBtn)}
            onClick={toggle}
            title="Переключить тему"
            aria-label="Переключить тему"
          >
            {theme === "light" ? (
              <Moon key="moon" size={20} />
            ) : (
              <Sun key="sun" size={20} />
            )}
          </button>

          <Link
            to="/favorites"
            className={styles.iconBtn}
            aria-label="Избранное"
            title="Избранное"
          >
            <Heart size={20} />
            {favCount > 0 && <Badge floating>{favCount}</Badge>}
          </Link>

          <Link
            to="/cart"
            className={styles.iconBtn}
            aria-label="Корзина"
            title="Корзина"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && <Badge floating>{cartCount}</Badge>}
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/profile"
                className={styles.userName}
                title="Личный кабинет"
              >
                {user?.name || user?.email}
              </Link>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                aria-label="Выйти"
                title="Выйти"
              >
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className={styles.iconBtn}
              aria-label="Войти"
              title="Войти"
            >
              <User size={20} />
            </Link>
          )}
        </div>
        <button
          type="button"
          className={styles.burger}
          aria-label="Открыть меню"
          title="Меню"
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
                aria-label="Закрыть меню"
                title="Закрыть"
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
                <button
                  type="button"
                  className={styles.mobileAction}
                  onClick={() => {
                    toggle();
                  }}
                >
                  {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                  <span>Тема: {theme === "light" ? "светлая" : "тёмная"}</span>
                </button>
                <button
                  type="button"
                  className={styles.mobileAction}
                  onClick={() => goAndClose("/favorites")}
                >
                  <Heart size={20} />
                  <span>Избранное</span>
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
                  <span>Корзина</span>
                  {cartCount > 0 && (
                    <span className={styles.badge}>{cartCount}</span>
                  )}
                </button>
                {isAuthenticated && (
                  <button
                    type="button"
                    className={styles.mobileAction}
                    onClick={() => {
                      logout();
                      goAndClose("/login");
                    }}
                  >
                    <LogOut size={20} />
                    <span>Выйти ({user?.name || user?.email})</span>
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
