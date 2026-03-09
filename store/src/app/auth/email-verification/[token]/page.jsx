import Link from "next/link";
import { registerCustomer } from "@services/CustomerServices";

export default async function EmailVerificationPage({ params }) {
  const token = params?.token;
  const { user, error } = await registerCustomer(token);

  const isSuccess = !error;

  return (
    <div className="mx-auto max-w-screen-2xl px-3 sm:px-10 py-16">
      <div className="mx-auto w-full max-w-xl rounded-lg bg-white p-6 shadow-md">
        <h1 className="mb-3 text-2xl font-semibold text-gray-900">
          {isSuccess ? "Email Verified" : "Verification Failed"}
        </h1>
        <p className="mb-6 text-sm text-gray-600">
          {isSuccess
            ? user?.message || "Your email has been verified successfully."
            : error || "Your verification link is invalid or expired."}
        </p>

        <div className="flex gap-3">
          <Link
            href="/auth/login"
            className="rounded-md bg-emerald-500 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
          >
            Go to Login
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Back to Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
