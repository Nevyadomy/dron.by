import { Route, Routes } from "react-router-dom";
import MainLayout from "@/components/templates/MainLayout";
import IndexPage from "@/pages/index";
import CatalogPage from "@/pages/catalog";
import ProductPage from "@/pages/product.$id";
import CartPage from "@/pages/cart";
import FavoritesPage from "@/pages/favorites";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import PromotionsPage from "@/pages/promotions";
import NewsPage from "@/pages/news";
import ContactsPage from "@/pages/contacts";
import DocsPage from "@/pages/docs.$slug";
import NotFound from "@/pages/NotFound";

export const AppRouter = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route path="/" element={<IndexPage />} />
      <Route path="/catalog" element={<CatalogPage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="/promotions" element={<PromotionsPage />} />
      <Route path="/news" element={<NewsPage />} />
      <Route path="/contacts" element={<ContactsPage />} />
      <Route path="/docs/:slug" element={<DocsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  </Routes>
);
