"use client";
import Link from "next/link";
import React from "react";
import { FiMail } from "react-icons/fi";

//internal import
import InputAreaTwo from "src/components/form/InputAreaTwo";
import SubmitButton from "@components/form/SubmitButton";
import BottomNavigation from "@components/login/BottomNavigation";

const ForgetPassword = () => {
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
              <form className="flex flex-col justify-center">
                <div className="grid grid-cols-1 gap-5">
                  <div className="form-group">
                    <InputAreaTwo
                      label="Email"
                      name="verifyEmail"
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
