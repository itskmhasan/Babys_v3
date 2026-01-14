import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// internal import
import "rc-tree/assets/index.css";
import "react-loading-skeleton/dist/skeleton.css";
import "@/assets/css/custom.css";
import "@/assets/css/tailwind.css";
import App from "@/App";
import store from "@/reduxStore/store";
import "@/i18n";
import ActionProvider from "./context/ActionContext";
import { AdminProvider } from "./context/AdminContext";
import { SidebarProvider } from "./context/SidebarContext";
import ThemeSuspense from "./components/theme/ThemeSuspense";
import { ThemeProvider } from "./context/ThemeContext";

// this is version 3

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("New content available. Reload?")) {
      updateSW(true);
    }
  },
});
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

let persistor = persistStore(store);

ReactDOM.createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <AdminProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <SidebarProvider>
            <ActionProvider>
              <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
                <Suspense fallback={<ThemeSuspense />}>
                  <App />
                </Suspense>
              </ThemeProvider>
            </ActionProvider>
          </SidebarProvider>
        </PersistGate>
      </Provider>
    </AdminProvider>
  </QueryClientProvider>
);
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.register();
