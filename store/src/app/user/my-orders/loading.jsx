import React from "react";
import "react-loading-skeleton/dist/skeleton.css";

//internal imports
import CMSkeletonTwo from "@components/preloader/CMSkeletonTwo";

export default function Loading() {
  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-4  sm:px-10">
        <div className="h-10"></div>
        <CMSkeletonTwo count={20} width={100} />
      </div>
    </>
  );
}
