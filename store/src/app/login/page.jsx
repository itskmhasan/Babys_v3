"use client";

import { FiLock, FiMail } from "react-icons/fi";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState, useEffect } from "react";

//internal  import
import Error from "@components/form/Error";
import { notifyError } from "@utils/toast";
import ErrorTwo from "@components/form/ErrorTwo";
import { getUserSession } from "@lib/auth-client";
import InputAreaTwo from "@components/form/InputAreaTwo";
import SubmitButton from "@components/form/SubmitButton";
import BottomNavigation from "@components/login/BottomNavigation";
import { handleLogin } from "@services/ServerActionServices";

const Login = () => {
  const userInfo = getUserSession();
  const redirectUrl = useSearchParams().get("redirectUrl");
  const [state, formAction] = useActionState(
    handleLogin.bind(null, userInfo),
    undefined
  );

  useEffect(() => {
    // console.log("state error 1st", state);
    if (state?.error) {
      // console.log("state error", state);
      notifyError(state?.error);
    }
  });

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
                <form action={formAction} className="flex flex-col justify-center">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="form-group">
                      <InputAreaTwo
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        Icon={FiMail}
                      />

                      <Error errorName={state?.errors?.email?.join(" ")} />
                    </div>
                    <div className="form-group">
                      <InputAreaTwo
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="Password"
                        Icon={FiLock}
                      />

                      {state?.errors?.password && (
                        <ErrorTwo errors={state?.errors?.password} />
                      )}
                    </div>

                    {/* passing the redirect url for redirect from page after login */}
                    <div className="form-group hidden">
                      <InputAreaTwo
                        defaultValue={redirectUrl || "user/dashboard"}
                        label="redirectUrl"
                        name="redirectUrl"
                        type="text"
                        placeholder="redirectUrl"
                        // Icon={FiMail}
                        readOnly={true}
                      />
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
                  </div>
                  <SubmitButton title={"Login"} />
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
