import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

// internal imports
import Error from "@/components/form/others/Error";
import LabelArea from "@/components/form/selectOption/LabelArea";
import InputArea from "@/components/form/input/InputArea";
import ImageLight from "@/assets/img/login-office.jpeg";
import ImageDark from "@/assets/img/login-office-dark.jpeg";
import useLoginSubmit from "@/hooks/useLoginSubmit";

const Login = () => {
  const { t } = useTranslation();
  const { onSubmit, register, handleSubmit, errors, loading } =
    useLoginSubmit();

  return (
    <div className="flex items-center min-h-screen p-6 bg-[#f8f7f4] dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800">
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={ImageLight}
              alt="Office"
            />
            <img
              aria-hidden="true"
              className="hidden object-cover w-full h-full dark:block"
              src={ImageDark}
              alt="Office"
            />
          </div>
          <main className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full">
              <h1 className="mb-6 text-2xl font-semibold text-gray-700 dark:text-gray-200">
                Admin Login
              </h1>
              <form onSubmit={handleSubmit(onSubmit)}>
                <LabelArea label="Email" />
                <InputArea
                  required
                  register={register}
                  defaultValue="admin@gmail.com"
                  label="Email"
                  name="email"
                  type="email"
                  autoComplete="username"
                  placeholder="admin@example.com"
                />
                <Error errorName={errors.email} />

                <div className="mt-6" />

                <LabelArea label="Password" />
                <InputArea
                  required
                  register={register}
                  defaultValue="12345678"
                  label="Password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder="********"
                />
                <Error errorName={errors.password} />

                <Button
                  disabled={loading}
                  isLoading={loading}
                  type="submit"
                  size="lg"
                  className="mt-4 w-full"
                  to="/dashboard"
                >
                  {loading ? "Loading..." : t("LoginTitle")}
                </Button>
              </form>

              <div className="mt-6 flex flex-col space-y-2">
                <Link
                  className="text-sm font-medium text-emerald-500 dark:text-emerald-400 hover:underline"
                  to="/forgot-password"
                >
                  {t("ForgotPassword")}
                </Link>
                <Link
                  className="text-sm font-medium text-emerald-500 dark:text-emerald-400 hover:underline"
                  to="/signup"
                >
                  {t("CreateAccountTitle")}
                </Link>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Login;
