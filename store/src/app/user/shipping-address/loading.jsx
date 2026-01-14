import React from "react";
import "react-loading-skeleton/dist/skeleton.css";

//internal imports
import CMSkeletonTwo from "@components/preloader/CMSkeletonTwo";

export default function Loading() {
  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-4  sm:px-10">
        <div className="grid md:grid-cols-4 gap-2">
          <CMSkeletonTwo count={6} width={100} />
          <CMSkeletonTwo count={6} width={100} />
          <CMSkeletonTwo count={6} width={100} />
          <CMSkeletonTwo count={6} width={100} />
        </div>
      </div>
    </>
  );
}
