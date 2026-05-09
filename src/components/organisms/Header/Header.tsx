import {
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
import { useEffect, useState, type FormEvent } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Input } from "@/components/atoms/Input";
import { Badge } from "@/components/atoms/Badge";
import { useAuth } from "@/contexts/useAuth";
import { useCart } from "@/contexts/CartContext";
import { useFavorites } from "@/contexts/FavoritesContext";
import { useTheme } from "@/hooks/useTheme";
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
  onSearchChange?: (q: string) => void;
  onSearchSubmit?: (q: string) => void;
}

export const Header = ({
  searchQuery = "",
  onSearchChange,
  onSearchSubmit,
}: HeaderProps) => {
  const { theme, toggle } = useTheme();
  const { count: favCount } = useFavorites();
  const { totalCount: cartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => document.body.classList.remove("no-scroll");
  }, [menuOpen]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const q = localQuery.trim();
    onSearchChange?.(q);
    onSearchSubmit?.(q);
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
          className={cn(styles.search, mobileSearchOpen && styles.searchOpen)}
          onSubmit={(e) => {
            handleSubmit(e);
            setMobileSearchOpen(false);
          }}
          role="search"
        >
          <Input
            type="search"
            placeholder="Поиск по сайту"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
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
            to={isAuthenticated ? "/" : "/login"}
            className={styles.iconBtn}
            aria-label={isAuthenticated ? "Профиль" : "Войти"}
            title={isAuthenticated ? "Профиль" : "Войти"}
            onClick={(e) => {
              if (isAuthenticated) e.preventDefault();
            }}
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
              <span className={styles.userName}>
                {user?.name || user?.email}
              </span>
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
