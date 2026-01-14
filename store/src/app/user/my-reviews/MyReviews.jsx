"use client";
import { useContext } from "react";

import Reviewed from "@components/review/Reviewed";
import NeedToReview from "@components/review/NeedToReview";
import { SidebarContext } from "@context/SidebarContext";
import { useRouter } from "next/navigation";

const MyReviewsScreen = ({ reviews, error }) => {
  const router = useRouter();
  const { activeTab, setActiveTab } = useContext(SidebarContext);

  return (
    <>
      <div className="mb-4 border-b border-gray-200">
        <nav className="-mb-px flex space-x-6">
          <button
            className={`whitespace-nowrap pb-2 px-1 border-b-2 text-sm font-medium ${
              activeTab === "need"
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => {
              setActiveTab("need");
              router.push("/user/my-reviews?page=1");
            }}
          >
            Need to Review
          </button>
          <button
            className={`whitespace-nowrap pb-2 px-1 border-b-2 text-sm font-medium ${
              activeTab === "reviewed"
                ? "border-emerald-500 text-emerald-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
            onClick={() => {
              setActiveTab("reviewed");
              router.push("/user/my-reviews?page=1");
            }}
          >
            Reviewed Products
          </button>
        </nav>
      </div>

      {activeTab === "need" ? (
        <NeedToReview reviews={reviews} error={error} />
      ) : (
        <Reviewed reviews={reviews} error={error} />
      )}
    </>
  );
};

export default MyReviewsScreen;
