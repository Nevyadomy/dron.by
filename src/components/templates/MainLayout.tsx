import { useState, useEffect } from "react";
import {
  Outlet,
  useNavigate,
  useLocation,
  useSearchParams,
} from "react-router-dom";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";

const MainLayout = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  useEffect(() => {
    if (location.pathname === "/catalog") {
      setSearch(params.get("q") ?? "");
    }
  }, [location.pathname, params]);

  const handleSearchSubmit = (q: string) => {
    navigate(q ? `/catalog?q=${encodeURIComponent(q)}` : "/catalog");
  };

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      <Header
        searchQuery={search}
        onSearchChange={setSearch}
        onSearchSubmit={handleSearchSubmit}
      />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
