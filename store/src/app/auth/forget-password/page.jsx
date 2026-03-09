"use client";
import Link from "next/link";
import React, { useState } from "react";
import { FiMail } from "react-icons/fi";

//internal import
import InputAreaTwo from "src/components/form/InputAreaTwo";
import SubmitButton from "@components/form/SubmitButton";
import BottomNavigation from "@components/login/BottomNavigation";
import { notifyError, notifySuccess } from "@utils/toast";
import ShowToast from "@components/common/ShowToast";

const ForgetPassword = () => {
  const [message, setMessage] = useState("");
  const [toastMessage, setToastMessage] = useState({ success: "", error: "" });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");

    if (!email) {
      notifyError("Please enter your email.");
      setToastMessage({ success: "", error: "Please enter your email." });
      return;
    }

    try {
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

      setMessage(data?.message || "Please check your email to reset password.");
      const successMessage =
        data?.message || "Please check your email to reset password.";
      notifySuccess(successMessage);
      setToastMessage({ success: successMessage, error: "" });
      event.currentTarget.reset();
    } catch (error) {
      setMessage("");
      const errorMessage = error.message || "Unable to send reset email.";
      notifyError(errorMessage);
      setToastMessage({ success: "", error: errorMessage });
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
      <div className="py-4 flex flex-col lg:flex-row w-full">
        <div className="w-full sm:p-5 lg:p-8">
          <div className="mx-auto text-left justify-center rounded-md w-full max-w-lg px-4 py-8 sm:p-10 overflow-hidden align-middle transition-all transform bg-white shadow-xl rounded-2x">
            <div className="overflow-hidden mx-auto">
              <div className="text-center">
                <Link href="/" className="text-3xl font-bold">
                  Forget Password
                </Link>
                <p className="text-sm md:text-base text-gray-500 mt-1 mb-4">
                  Reset Your Password
                </p>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col justify-center">
                <ShowToast
                  success={toastMessage.success}
                  error={toastMessage.error}
                />
                <div className="grid grid-cols-1 gap-5">
                  {message && (
                    <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                      {message}
                    </p>
                  )}
                  <div className="form-group">
                    <InputAreaTwo
                      label="Email"
                      name="email"
                      type="email"
                      placeholder="Your Register Email"
                      Icon={FiMail}
                    />
                  </div>

                  <SubmitButton title={"Update Password"} />
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
    </div>
  );
};

export default ForgetPassword;
