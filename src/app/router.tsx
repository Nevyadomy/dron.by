import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import MainLayout from "@/components/templates/MainLayout";
import { ProductPageSkeleton } from "@/components/molecules/SkeletonCard";

// Ленивая загрузка страниц
const IndexPage = lazy(() => import("@/pages/index"));
const CatalogPage = lazy(() => import("@/pages/catalog"));
const SearchPage = lazy(() => import("@/pages/search"));
const ProductPage = lazy(() => import("@/pages/product.$id"));
const CartPage = lazy(() => import("@/pages/cart"));
const CheckoutPage = lazy(() => import("@/pages/checkout"));
const FavoritesPage = lazy(() => import("@/pages/favorites"));
const LoginPage = lazy(() => import("@/pages/login"));
const RegisterPage = lazy(() => import("@/pages/register"));
const ProfilePage = lazy(() => import("@/pages/profile"));
const PromotionsPage = lazy(() => import("@/pages/promotions"));
const NewsPage = lazy(() => import("@/pages/news"));
const ContactsPage = lazy(() => import("@/pages/contacts"));
const AboutPage = lazy(() => import("@/pages/about"));
const DocsPage = lazy(() => import("@/pages/docs.$slug"));
const NotFound = lazy(() => import("@/pages/NotFound"));
const ComparePage = lazy(() => import("@/pages/compare"));

// Компонент-обёртка для ленивой загрузки с Suspense
const LazyWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense
    fallback={
      <div style={{ padding: 40, textAlign: "center" }}>
        <ProductPageSkeleton />
      </div>
    }
  >
    {children}
  </Suspense>
);

export const AppRouter = () => (
  <Routes>
    <Route element={<MainLayout />}>
      {/* Главная */}
      <Route
        path="/"
        element={
          <ErrorBoundary componentName="HomePage">
            <LazyWrapper>
              <IndexPage />
            </LazyWrapper>
          </ErrorBoundary>
        }
      />

      {/* Каталог */}
      <Route
        path="/catalog"
        element={
          <ErrorBoundary componentName="CatalogPage">
            <LazyWrapper>
              <CatalogPage />
            </LazyWrapper>
          </ErrorBoundary>
        }
      />

      {/* Поиск */}
      <Route
        path="/search"
        element={
          <ErrorBoundary componentName="SearchPage">
            <LazyWrapper>
              <SearchPage />
            </LazyWrapper>
          </ErrorBoundary>
        }
      />

      {/* Товар */}
      <Route
        path="/product/:id"
        element={
          <ErrorBoundary componentName="ProductPage">
            <LazyWrapper>
              <ProductPage />
            </LazyWrapper>
          </ErrorBoundary>
        }
      />

      {/* Корзина */}
      <Route
        path="/cart"
        element={
          <ErrorBoundary componentName="CartPage">
            <LazyWrapper>
              <CartPage />
            </LazyWrapper>
          </ErrorBoundary>
        }
      />

      {/* Оформление заказа */}
      <Route
        path="/checkout"
        element={
          <ErrorBoundary componentName="CheckoutPage">
            <LazyWrapper>
              <CheckoutPage />
            </LazyWrapper>
          </ErrorBoundary>
        }
      />

      {/* Избранное */}
      <Route
        path="/favorites"
        element={
          <ErrorBoundary componentName="FavoritesPage">
            <LazyWrapper>
              <FavoritesPage />
            </LazyWrapper>
          </ErrorBoundary>
        }
      />

      {/* Вход */}
      <Route
        path="/login"
        element={
          <ErrorBoundary componentName="LoginPage">
            <LazyWrapper>
              <LoginPage />
            </LazyWrapper>
          </ErrorBoundary>
        }
      />

      {/* Регистрация */}
      <Route
        path="/register"
        element={
          <ErrorBoundary componentName="RegisterPage">
            <LazyWrapper>
              <RegisterPage />
            </LazyWrapper>
          </ErrorBoundary>
        }
      />

      {/* Профиль */}
      <Route
        path="/profile"
        element={
          <ErrorBoundary componentName="ProfilePage">
            <LazyWrapper>
              <ProfilePage />
            </LazyWrapper>
          </ErrorBoundary>
        }
      />

      {/* Акции */}
      <Route
        path="/promotions"
        element={
          <ErrorBoundary componentName="PromotionsPage">
            <LazyWrapper>
              <PromotionsPage />
            </LazyWrapper>
          </ErrorBoundary>
        }
      />

      {/* Новости */}
      <Route
        path="/news"
        element={
          <ErrorBoundary componentName="NewsPage">
            <LazyWrapper>
              <NewsPage />
            </LazyWrapper>
          </ErrorBoundary>
        }
      />

      {/* Контакты */}
      <Route
        path="/contacts"
        element={
          <ErrorBoundary componentName="ContactsPage">
            <LazyWrapper>
              <ContactsPage />
            </LazyWrapper>
          </ErrorBoundary>
        }
      />

      {/* О нас */}
      <Route
        path="/about"
        element={
          <ErrorBoundary componentName="AboutPage">
            <LazyWrapper>
              <AboutPage />
            </LazyWrapper>
          </ErrorBoundary>
        }
      />

      {/* Документы */}
      <Route
        path="/docs/:slug"
        element={
          <ErrorBoundary componentName="DocsPage">
            <LazyWrapper>
              <DocsPage />
            </LazyWrapper>
          </ErrorBoundary>
        }
      />

      {/* Сравнение */}
      <Route
        path="/compare"
        element={
          <ErrorBoundary componentName="ComparePage">
            <LazyWrapper>
              <ComparePage />
            </LazyWrapper>
          </ErrorBoundary>
        }
      />

      {/* 404 - не найден */}
      <Route
        path="*"
        element={
          <ErrorBoundary componentName="NotFound">
            <LazyWrapper>
              <NotFound />
            </LazyWrapper>
          </ErrorBoundary>
        }
      />
    </Route>
  </Routes>
);
