import { Providers } from "@/app/providers";
import { AppRouter } from "@/app/router";
import { ErrorBoundary } from "@/components/ErrorBoundary";

const App = () => (
  <ErrorBoundary componentName="App">
    <Providers>
      <AppRouter />
    </Providers>
  </ErrorBoundary>
);

export default App;
