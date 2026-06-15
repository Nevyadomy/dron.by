import { Providers } from "@/app/providers";
import { AppRouter } from "@/app/router";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ScrollToTop } from "@/components/ScrollToTop";
import { ProgressBar } from "@/components/atoms/ProgressBar/ProgressBar";

const App = () => (
  <ErrorBoundary componentName="App">
    <Providers>
      <ProgressBar />
      <ScrollToTop />
      <AppRouter />
    </Providers>
  </ErrorBoundary>
);

export default App;
