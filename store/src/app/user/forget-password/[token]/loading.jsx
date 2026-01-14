import React from "react";
import "react-loading-skeleton/dist/skeleton.css";

//internal imports
import CMSkeletonTwo from "@components/preloader/CMSkeletonTwo";

export default function Loading() {
  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-10">
        <CMSkeletonTwo count={4} width={100} />

        <div className="h-10"></div>
        <div className="grid md:grid-cols-2 gap-2">
          <CMSkeletonTwo count={2} width={100} />
          <CMSkeletonTwo count={2} width={100} />
          <CMSkeletonTwo count={2} width={100} />
          <CMSkeletonTwo count={2} width={100} />
        </div>
        <div className="h-4"></div>

        <CMSkeletonTwo count={2} width={20} />
      </div>
    </>
  );
}
