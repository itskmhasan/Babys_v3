import React from "react";
import "react-loading-skeleton/dist/skeleton.css";

//internal imports
import CMSkeletonTwo from "@components/preloader/CMSkeletonTwo";

export default function Loading() {
  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-10">
        <div className="grid grid-cols-3 gap-1">
          <CMSkeletonTwo count={8} width={95} />
          <CMSkeletonTwo count={8} width={95} />
          <CMSkeletonTwo count={8} width={95} />
        </div>

        <div className="h-10"></div>
        <CMSkeletonTwo count={6} width={100} />
        <div className="h-6"></div>
        <CMSkeletonTwo count={20} width={100} />
        <div className="h-10"></div>
        <CMSkeletonTwo count={2} width={15} />
      </div>
    </>
  );
}
