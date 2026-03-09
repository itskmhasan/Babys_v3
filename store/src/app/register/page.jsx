"use client";

import Link from "next/link";
import { FiLock, FiMail, FiUser } from "react-icons/fi";
import { useActionState, useEffect, useMemo, useState } from "react";

//internal import
import Error from "@components/form/Error";
import { notifyError } from "@utils/toast";
import ErrorTwo from "@components/form/ErrorTwo";
import ShowToast from "@components/common/ShowToast";
import SubmitButton from "@components/form/SubmitButton";
import InputAreaTwo from "@components/form/InputAreaTwo";
import BottomNavigation from "@components/login/BottomNavigation";
import { verifyEmailAddress } from "@services/ServerActionServices";
import { baseURL } from "@services/CommonService";

const Register = () => {
  const [state, formAction] = useActionState(verifyEmailAddress, undefined);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [allowSubmit, setAllowSubmit] = useState(false);

  const passwordStrength = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    const labels = ["Very Weak", "Weak", "Medium", "Strong", "Very Strong"];
    const colors = [
      "bg-rose-500",
      "bg-orange-500",
      "bg-amber-500",
      "bg-teal-500",
      "bg-emerald-600",
    ];

    return {
      score,
      label: labels[score],
      color: colors[score],
      width: `${(score / 4) * 100}%`,
    };
  }, [password]);

  useEffect(() => {
    if (state?.error) {
      notifyError(state?.error);
    }
  }, [state?.error]);

  const handleFormInput = (event) => {
    const target = event.target;
    if (!target?.name) return;

    if (target.name === "email") {
      if (emailError) setEmailError("");
      setAllowSubmit(false);
    }

    if (target.name === "password") {
      setPassword(target.value);
      if (confirmPassword && target.value !== confirmPassword) {
        setConfirmError("Passwords do not match.");
      } else {
        setConfirmError("");
      }
    }

    if (target.name === "confirmPassword") {
      setConfirmPassword(target.value);
      if (password && target.value !== password) {
        setConfirmError("Passwords do not match.");
      } else {
        setConfirmError("");
      }
    }
  };

  const checkEmailAvailability = async (email) => {
    const emailValue = String(email || "").trim().toLowerCase();

    if (!emailValue) {
      setEmailError("Email is required.");
      return { available: false };
    }

    try {
      setIsCheckingEmail(true);
      const response = await fetch(
        `${baseURL}/customer/check-email?email=${encodeURIComponent(emailValue)}`,
        {
          cache: "no-cache",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setEmailError(data?.message || "Could not validate email right now.");
        return { available: false };
      }

      if (!data?.available) {
        setEmailError(
          data?.message ||
            "This email is already registered. Please use a different email."
        );
        return { available: false };
      }

      setEmailError("");
      return { available: true };
    } catch {
      setEmailError("Could not validate email right now. Please try again.");
      return { available: false };
    } finally {
      setIsCheckingEmail(false);
    }
  };

  const handleBeforeSubmit = async (event) => {
    if (allowSubmit) {
      setAllowSubmit(false);
      return;
    }

    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    const email = formData.get("email");

    if (!password || !confirmPassword || password !== confirmPassword) {
      setConfirmError("Passwords do not match.");
      return;
    }

    const emailResult = await checkEmailAvailability(email);
    if (!emailResult.available) {
      return;
    }

    setAllowSubmit(true);
    form.requestSubmit();
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
                    Create Account
                  </h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Sign up with your details to start shopping
                  </p>
                </div>
                <form
                  action={formAction}
                  onInput={handleFormInput}
                  onSubmit={handleBeforeSubmit}
                  className="flex flex-col justify-center"
                >
                  <ShowToast success={state?.user?.message} error={state?.error} />
                  {state?.user?.message && (
                    <p className="mb-4 rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                      {state.user.message}
                    </p>
                  )}
                  <div className="grid grid-cols-1 gap-4">
                    <div className="form-group">
                      <InputAreaTwo
                        label="Name"
                        name="name"
                        type="text"
                        placeholder="Full Name"
                        Icon={FiUser}
                      />

                      <Error errorName={state?.errors?.name?.join(" ")} />
                    </div>

                    <div className="form-group">
                      <InputAreaTwo
                        label="Email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        Icon={FiMail}
                        onBlur={(event) => checkEmailAvailability(event.target.value)}
                      />
                      <Error errorName={state?.errors?.email?.join(" ")} />
                      {isCheckingEmail ? (
                        <p className="mt-2 text-sm text-slate-500">Checking email...</p>
                      ) : null}
                      {emailError ? (
                        <p className="mt-2 text-sm text-rose-600">{emailError}</p>
                      ) : null}
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

                      <div className="mt-3">
                        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                            style={{ width: passwordStrength.width }}
                          />
                        </div>
                        <p className="mt-2 text-xs font-medium text-slate-600">
                          Password strength: {passwordStrength.label}
                        </p>
                      </div>
                    </div>

                    <div className="form-group">
                      <InputAreaTwo
                        label="Confirm Password"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        Icon={FiLock}
                      />
                      {confirmError ? (
                        <p className="mt-2 text-sm text-rose-600">{confirmError}</p>
                      ) : null}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex ms-auto">
                        <Link
                          type="button"
                          href={"/auth/forget-password"}
                          className="text-end text-sm text-heading ps-3 underline hover:no-underline focus:outline-none"
                        >
                          Forgot password?
                        </Link>
                      </div>
                    </div>
                    <SubmitButton title={"Register"} />
                  </div>
                </form>
                <BottomNavigation
                  desc
                  route={"/auth/login"}
                  pageName={"Login"}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
