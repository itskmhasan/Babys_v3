"use client";

import { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { notifyError, notifySuccess } from "@utils/toast";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = useParams();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const password = useRef("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newPassword = formData.get("newPassword");
    const confirmPassword = formData.get("confirmPassword");

    if (!newPassword || String(newPassword).length < 8) {
      notifyError("Password must be at least 8 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      notifyError("Password confirmation does not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/customer/reset-password`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token, newPassword }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Unable to reset password.");
      }

      setDone(true);
      notifySuccess(data?.message || "Password reset successful.");
    } catch (error) {
      notifyError(error.message || "Unable to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl px-3 sm:px-10 py-10">
      <div className="mx-auto w-full max-w-lg rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-2 text-2xl font-semibold">Reset Password</h1>
        <p className="mb-6 text-sm text-gray-600">
          {done
            ? "Your password was updated. You can log in now."
            : "Enter your new password below."}
        </p>

        {done ? (
          <button
            onClick={() => router.push("/auth/login")}
            className="rounded-md bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-700"
          >
            Go to Login
          </button>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">New Password</label>
              <input
                name="newPassword"
                type="password"
                minLength={8}
                required
                onChange={(e) => {
                  password.current = e.target.value;
                }}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                minLength={8}
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-cyan-600 py-2 text-sm font-medium text-white hover:bg-cyan-700 disabled:opacity-70"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
