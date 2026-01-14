import React, { useContext, Suspense, useEffect, lazy } from "react";
import { Switch, Route, Redirect, useLocation } from "react-router-dom";

//internal import
import Main from "@/layout/Main";
import Header from "@/components/header/Header";
import Sidebar from "@/components/sidebar/Sidebar";
import { SidebarContext } from "@/context/SidebarContext";
import ThemeSuspense from "@/components/theme/ThemeSuspense";
import { routes } from "@/routes";
import { cn } from "@/lib/utils";
const Page404 = lazy(() => import("@/pages/404"));

const Layout = () => {
  const { isSidebarOpen, closeSidebar, navBar } = useContext(SidebarContext);
  let location = useLocation();

  const isOnline = navigator.onLine;

  // console.log('routes',routes)

  useEffect(() => {
    closeSidebar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <>
      {!isOnline && (
        <div className="flex justify-center bg-red-600 text-white">
          You are in offline mode!{" "}
        </div>
      )}
      <div
        className={cn(
          "flex min-h-screen w-full bg-[#f8f7f4] dark:bg-gray-900",
          isSidebarOpen ? "lg:overflow-hidden" : ""
        )}
      >
        {navBar && (
          <aside className="sticky top-0 bg-white dark:bg-gray-800 shadow-sm z-30">
            <Sidebar />
          </aside>
        )}

        {/* Main vertical layout */}
        <div className="flex flex-col flex-1">
          {/* Sticky Header */}
          <div className="sticky top-0 z-30 h-14 bg-white shadow-sm">
            <Header />
          </div>
          <Main>
            <Suspense fallback={<ThemeSuspense />}>
              <Switch>
                {routes.map(
                  (route, i) =>
                    route.component && (
                      <Route
                        key={i}
                        exact
                        path={route.path}
                        render={(props) => <route.component {...props} />}
                      />
                    )
                )}
                <Redirect exact from="/" to="/dashboard" />
                <Route component={Page404} />
              </Switch>
            </Suspense>
          </Main>
        </div>
      </div>
    </>
  );
};

export default Layout;
