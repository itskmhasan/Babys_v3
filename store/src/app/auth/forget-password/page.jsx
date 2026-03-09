"use client";
import Link from "next/link";
import React, { useState } from "react";
import { FiMail } from "react-icons/fi";

//internal import
import InputAreaTwo from "src/components/form/InputAreaTwo";
import BottomNavigation from "@components/login/BottomNavigation";
import { notifyError, notifySuccess } from "@utils/toast";
import ShowToast from "@components/common/ShowToast";

const ForgetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [toastMessage, setToastMessage] = useState({ success: "", error: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "").trim();

    if (!email) {
      const errorMessage = "Please enter your email.";
      notifyError(errorMessage);
      setMessage({ type: "error", text: errorMessage });
      setToastMessage({ success: "", error: `${errorMessage} ${Date.now()}` });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/customer/forget-password`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Unable to send reset email.");
      }

      const successMessage =
        data?.message || "Please check your email to reset password.";
      notifySuccess(successMessage);
      setMessage({ type: "success", text: successMessage });
      setToastMessage({ success: `${successMessage} ${Date.now()}`, error: "" });
      event.currentTarget.reset();
    } catch (error) {
      const errorMessage = error.message || "Unable to send reset email.";
      notifyError(errorMessage);
      setMessage({ type: "error", text: errorMessage });
      setToastMessage({ success: "", error: `${errorMessage} ${Date.now()}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-b from-slate-50 via-zinc-50 to-cyan-50/40">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-10">
        <div className="flex min-h-[calc(100vh-7rem)] items-center justify-center py-8 sm:py-12">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200/70 bg-white/95 px-5 py-8 shadow-[0_25px_60px_-35px_rgba(15,23,42,0.45)] backdrop-blur sm:px-10 sm:py-10">
            <div className="overflow-hidden mx-auto">
              <div className="mb-7 text-center">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-700">
                  Account Recovery
                </p>
                <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900">
                  Forgot Password
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                  We will send a secure reset link to your email.
                </p>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col justify-center">
                <ShowToast
                  success={toastMessage.success}
                  error={toastMessage.error}
                />
                <div className="grid grid-cols-1 gap-4">
                  {message.text ? (
                    <p
                      className={`rounded-md px-3 py-2 text-sm ${
                        message.type === "success"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {message.text}
                    </p>
                  ) : null}
                  <div className="form-group">
                    <InputAreaTwo
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="Your Register Email"
                      Icon={FiMail}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="mt-1 h-11 w-full rounded-md bg-slate-900 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {loading ? "Sending..." : "Send Reset Link"}
                  </button>
                </div>
              </form>
              <BottomNavigation
                or={true}
                route={"/auth/signup"}
                pageName={"Sign Up"}
                loginTitle="Sign Up"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ForgetPassword;
