"use client";

import { FiLock, FiMail } from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";

//internal  import
import { notifyError } from "@utils/toast";
import Error from "@components/form/Error";
import InputArea from "@components/form/InputArea";
import BottomNavigation from "@components/login/BottomNavigation";
import { Button } from "@components/ui/button";

const Login = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const rawRedirectUrl = useSearchParams().get("redirectUrl");
  const redirectUrl = rawRedirectUrl
    ? rawRedirectUrl.startsWith("/")
      ? rawRedirectUrl
      : `/${rawRedirectUrl}`
    : "/user/dashboard";
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const submitHandler = async ({ email, password }) => {
    setLoading(true);
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl: redirectUrl || "/",
    });

    setLoading(false);
    // console.log("result", result);

    if (result?.error) {
      notifyError(result?.error);
      // console.error("Error during sign-in:", result.error);
      // Handle error display here
    } else if (result?.ok) {
      router.push(result.url);
      // window.location.href = result.url;
    }
  };

  return (
    <>
      <section className="bg-gradient-to-b from-slate-50 via-zinc-50 to-teal-50/40">
        <div className="mx-auto max-w-screen-2xl px-4 sm:px-10">
          <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center py-8 sm:py-12">
            <div className="w-full max-w-lg rounded-2xl border border-slate-200/70 bg-white/95 px-5 py-8 shadow-[0_25px_60px_-35px_rgba(15,23,42,0.45)] backdrop-blur sm:px-10 sm:py-10">
              <div className="mx-auto overflow-hidden text-left">
                <div className="mb-7 text-center">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
                    Babys Store
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                    Welcome Back
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Login with your email and password
                  </p>
                </div>
                <form onSubmit={handleSubmit(submitHandler)} className="flex flex-col">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="form-group">
                      <InputArea
                        register={register}
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        Icon={FiMail}
                      />
                      <Error errorMessage={errors.email} />
                    </div>
                    <div className="form-group">
                      <InputArea
                        register={register}
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="Password"
                        Icon={FiLock}
                      />

                      <Error errorMessage={errors.password} />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex ms-auto">
                        <Link
                          href={"/auth/forget-password"}
                          type="button"
                          className="text-end text-sm text-heading ps-3 underline hover:no-underline focus:outline-none"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    </div>
                    <Button
                      disabled={loading}
                      className="mt-1 h-11 bg-slate-900 text-white hover:bg-slate-800"
                      isLoading={loading}
                      type="submit"
                    >
                      {loading ? "Loading" : "Login"}
                    </Button>
                  </div>
                </form>
                <BottomNavigation
                  or={true}
                  route={"/auth/signup"}
                  pageName={"Sign Up"}
                  loginTitle="Login"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
