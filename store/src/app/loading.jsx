import CMSkeletonThree from "@components/preloader/CMSkeletonTwo";

export default function Loading() {
  return (
    <>
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-10">
        <div className="grid grid-cols-2 gap-0">
          <CMSkeletonThree count={12} width={100} />
          <CMSkeletonThree count={12} width={80} />
        </div>
        <div className="h-8"></div>
        <CMSkeletonThree count={4} width={100} />
        <div className="h-8"></div>
        <CMSkeletonThree count={3} width={50} />
        <div className="h-2"></div>
        <CMSkeletonThree count={12} width={100} />
        <div className="h-10"></div>
        <CMSkeletonThree count={3} width={50} />
        <div className="h-2"></div>
        <CMSkeletonThree count={20} width={100} />
        <div className="h-10"></div>
        <CMSkeletonThree count={6} width={100} />
        <div className="h-10"></div>
        <CMSkeletonThree count={3} width={50} />
        <div className="h-2"></div>
        <CMSkeletonThree count={20} width={100} />
      </div>
      <div className="h-10"></div>
    </>
  );
}
