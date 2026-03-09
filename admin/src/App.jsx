import React, { lazy } from "react";
import { ToastContainer } from "react-toastify";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import AccessibleNavigationAnnouncer from "@/components/AccessibleNavigationAnnouncer";
import PrivateRoute from "@/components/login/PrivateRoute";
const Layout = lazy(() => import("@/layout/Layout"));
const Login = lazy(() => import("@/pages/Login"));
const ForgetPassword = lazy(() => import("@/pages/ForgotPassword"));
const ResetPassword = lazy(() => import("@/pages/ResetPassword"));

const App = () => {
  const configuredBasePath = import.meta.env.VITE_APP_BASE_PATH || "";
  const routerBasePath =
    configuredBasePath === "/"
      ? ""
      : configuredBasePath.replace(/\/+$/, "");

  return (
    <>
      <ToastContainer />
      <Router basename={routerBasePath}>
        <AccessibleNavigationAnnouncer />
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/signup" render={() => <Redirect to="/login" />} />
          <Route path="/forgot-password" component={ForgetPassword} />
          <Route path="/reset-password/:token" component={ResetPassword} />

          <PrivateRoute>
            <Route path="/" component={Layout} />
          </PrivateRoute>
          <Redirect exact from="/" to="/login" />
        </Switch>
      </Router>
    </>
  );
};

export default App;
