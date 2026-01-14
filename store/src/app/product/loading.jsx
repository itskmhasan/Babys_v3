import React from "react";
import "react-loading-skeleton/dist/skeleton.css";

//internal imports
import CMSkeletonTwo from "@components/preloader/CMSkeletonTwo";

export default function Loading() {
  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-10">
        <div className="h-10"></div>
        <CMSkeletonTwo count={2} width={40} textAlign />
        <div className="h-10"></div>
        <div className="grid grid-cols-3 gap-1">
          <div className="my-auto">
            <CMSkeletonTwo count={10} width={90} />
          </div>
          <CMSkeletonTwo count={18} width={100} />
          <CMSkeletonTwo count={16} width={60} />
        </div>

        <div className="h-10"></div>
        <CMSkeletonTwo count={3} width={40} textAlign />
        <div className="h-2"></div>
        <CMSkeletonTwo count={20} width={100} />
        <div className="h-10"></div>
      </div>
      <div className="h-10"></div>
    </>
  );
}
