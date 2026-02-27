"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const PLACEHOLDER_IMAGE =
  "https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png";

const FirstVisitOfferPopup = ({
  categories = [],
  coupons = [],
  couponTitle,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const normalizedCategories = useMemo(() => {
    return (categories || []).map((cat) => ({
      ...cat,
      title: cat?.name?.en || cat?.name || "Category",
      image: cat?.bannerImage || cat?.image || PLACEHOLDER_IMAGE,
      href: `/search?category=${encodeURIComponent(cat?.name?.en || cat?.name || "category")}&_id=${cat?._id}`,
    }));
  }, [categories]);

  if (!isOpen || normalizedCategories.length === 0) return null;

  const hero = normalizedCategories[0];
  const gridItems = normalizedCategories.slice(1, 4);
  const firstCoupon = coupons?.[0];
  const couponHeading =
    couponTitle?.en || couponTitle || "Coupon Offer Card";

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/60 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 h-9 w-9 rounded-full bg-black/55 text-white text-xl leading-none hover:bg-black/70"
          aria-label="Close popup"
        >
          ×
        </button>

        <div className="p-3 sm:p-4">
          {firstCoupon && (
            <div className="mb-3 sm:mb-4 rounded-xl border border-orange-200 bg-orange-50 px-3 sm:px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <p className="text-xs uppercase tracking-wide text-orange-700 font-semibold">
                  {couponHeading}
                </p>
                <p className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                  {firstCoupon?.title?.en || firstCoupon?.title || "Limited Offer"}
                </p>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <span className="px-3 py-1.5 rounded-lg border border-dashed border-orange-400 bg-white text-orange-600 font-extrabold text-sm sm:text-base">
                  {firstCoupon?.couponCode || "SAVE20"}
                </span>
                <Link
                  href="/"
                  onClick={handleClose}
                  className="inline-flex px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-rose-500 text-white font-bold text-sm sm:text-base"
                >
                  SHOP NOW ›
                </Link>
              </div>
            </div>
          )}

          <Link href={hero.href} onClick={handleClose} className="block group">
            <div className="relative w-full h-44 sm:h-56 lg:h-64 rounded-xl overflow-hidden">
              <Image
                src={hero.image}
                alt={hero.title}
                fill
                sizes="100vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/35" />
              <div className="absolute inset-0 flex items-center justify-between p-4 sm:p-6">
                <h3 className="text-white text-2xl sm:text-4xl font-extrabold uppercase tracking-wide">
                  {hero.title}
                </h3>
                <span className="hidden sm:inline-flex px-5 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-xl">
                  SHOP NOW ›
                </span>
              </div>
            </div>
          </Link>

          <div className="mt-3 sm:mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
            {gridItems.map((item) => (
              <Link
                key={item._id}
                href={item.href}
                onClick={handleClose}
                className="group border border-slate-200 rounded-xl overflow-hidden bg-white"
              >
                <div className="relative h-28 sm:h-36">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="px-3 py-2 text-center bg-orange-50">
                  <span className="text-lg font-semibold text-slate-900">{item.title} ›</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstVisitOfferPopup;
