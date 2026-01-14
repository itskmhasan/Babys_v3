import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";

//internal import
import Error from "@/components/form/others/Error";
import InputArea from "@/components/form/input/InputArea";
import LabelArea from "@/components/form/selectOption/LabelArea";
import SelectRole from "@/components/form/selectOption/SelectRole";
import useLoginSubmit from "@/hooks/useLoginSubmit";
import ImageLight from "@/assets/img/create-account-office.jpeg";
import ImageDark from "@/assets/img/create-account-office-dark.jpeg";

const SignUp = () => {
  const { t } = useTranslation();
  const { control, onSubmit, register, handleSubmit, errors, loading } =
    useLoginSubmit();

  return (
    <div className="flex items-center min-h-screen p-6 bg-[#f8f7f4] dark:bg-gray-900">
      <div className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
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
                {t("CreateAccount")}
              </h1>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-2">
                  <LabelArea label="Name" />
                  <InputArea
                    required={true}
                    register={register}
                    label="Name"
                    name="name"
                    type="text"
                    placeholder="Admin"
                  />
                  <Error errorName={errors.name} />
                </div>
                <div className="mb-2">
                  <LabelArea label="Email" />
                  <InputArea
                    required={true}
                    register={register}
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="john@doe.com"
                  />
                  <Error errorName={errors.email} />
                </div>

                <div className="mb-2">
                  <LabelArea label="Password" />
                  <InputArea
                    required={true}
                    register={register}
                    label="Password"
                    name="password"
                    type="password"
                    autocomplete="current-password"
                    placeholder="***************"
                  />
                  <Error errorName={errors.password} />
                </div>

                <div className="mb-6">
                  <LabelArea label="Staff Role" />
                  <div className="col-span-8 sm:col-span-4">
                    <SelectRole
                      register={register}
                      control={control}
                      label="Role"
                      name="role"
                    />
                    {/* <Error errorName={errors.role} /> */}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Input type="checkbox" className="h-4 w-4" />
                  <Label className="text-sm">
                    {t("Iagree")}{" "}
                    <span className="underline">{t("privacyPolicy")}</span>
                  </Label>
                </div>

                <Button
                  disabled={loading}
                  isLoading={loading}
                  type="submit"
                  size="lg"
                  className="mt-4 w-full"
                >
                  {loading ? "Loading..." : t("CreateAccountTitle")}
                </Button>
              </form>

              <hr className="my-10" />

              <p className="mt-4">
                <Link
                  className="text-sm font-medium text-emerald-500 dark:text-emerald-400 hover:underline"
                  to="/login"
                >
                  {t("AlreadyAccount")}
                </Link>
              </p>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
