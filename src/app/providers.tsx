import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { BrowserRouter } from "react-router-dom";
import { useState } from "react";
import type { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { AuthPromptProvider } from "@/contexts/AuthPromptContext";
import { CurrencyProvider } from "@/contexts/CurrencyContext";
import { ComparisonProvider } from "@/contexts/ComparisonContext";
import { ToastProvider } from "@/components/atoms/Toast";

export const Providers = ({ children }: { children: ReactNode }) => {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={client}>
      <BrowserRouter>
        <AuthProvider>
          <CurrencyProvider>
            <FavoritesProvider>
              <CartProvider>
                <ComparisonProvider>
                  <AuthPromptProvider>
                    <ToastProvider>{children}</ToastProvider>
                  </AuthPromptProvider>
                </ComparisonProvider>
              </CartProvider>
            </FavoritesProvider>
          </CurrencyProvider>
        </AuthProvider>
      </BrowserRouter>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};
