"use client";

import React from "react";
import { IoAlertCircleOutline, IoReturnUpBackOutline } from "react-icons/io5";
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";
import { getUserSession } from "@lib/auth-client";

//internal import

import CartItem from "@components/cart/CartItem";
import useCheckoutSubmit from "@hooks/useCheckoutSubmit";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { useSetting } from "@context/SettingContext";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";

const CheckoutCartScreen = () => {
  const userInfo = getUserSession();
  const { storeCustomization } = useSetting();
  const { showingTranslateValue } = useUtilsFunction();

  const {
    total,
    isEmpty,
    items,
    cartTotal,
    couponInfo,
    couponRef,
    handleCouponCode,
    discountAmount,
    isCouponAvailable,
  } = useCheckoutSubmit({});
  const { currency } = useUtilsFunction();

  const checkout = storeCustomization?.checkout;

  const handleCheckout = () => {
    if (items?.length <= 0) {
      closeCartDrawer();
    } else {
      if (!userInfo) {
        // console.log("userInfo::", userInfo, "history");

        // Redirect to login page with returnUrl query parameter
        router.push(`/auth/login?redirectUrl=checkout`);
        closeCartDrawer();
      } else {
        router.push("/checkout");
        closeCartDrawer();
      }
    }
  };

  return (
    <div className="mx-auto max-w-screen-2xl px-3 sm:px-10 pt-16 pb-16">
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-[60%] xl:w-[55%] divide-y divide-slate-200 dark:divide-slate-700 ">
          <h2 className="font-bold text-xl pb-3">Shopping Cart</h2>
          <div className="w-full block mt-3">
            {items.map((item) => (
              <CartItem key={item.id} item={item} currency={currency} />
            ))}

            {isEmpty && (
              <div className="mt-10 flex flex-col h-full justify-center">
                <div className="flex flex-col items-center">
                  <Image
                    className="size-40 flex-none rounded-md object-cover"
                    src="/no-result.svg"
                    alt="no-result"
                    width={400}
                    height={380}
                  />
                  <h3 className=" font-semibold text-gray-700 text-lg pt-5">
                    Your cart is empty
                  </h3>
                  <p className="px-12 text-center text-sm text-gray-500 pt-2">
                    No items added in your cart. Please add product to your cart
                    list.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 my-10 lg:my-0 lg:mx-10 xl:mx-16 2xl:mx-20 flex-shrink-0"></div>
        <div className="flex-1">
          <div className="sticky top-44 border bg-white rounded-lg border-gray-100">
            <div className="p-8">
              <h2 className="font-semibold text-lg">
                {showingTranslateValue(checkout?.order_summary)}
              </h2>

              {/* <div className="flex items-center">
                <div className="shrink-0">
                  <IoAlertCircleOutline className="text-gray-700" />
                </div>
                <div className="ml-2">
                  <h3 className="text-sm font-medium text-gray-700">
                    Spend <strong>$500</strong> more and get free shipping!
                  </h3>
                </div>
              </div> */}

              <div className="mt-3 text-sm text-slate-500 dark:text-gray-400 divide-y divide-gray-200/70 dark:divide-gray-700/80">
                <div className="flex justify-between py-3">
                  <span className="font-semibold text-gray-600">
                    {showingTranslateValue(checkout?.sub_total)}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {currency}
                    {cartTotal?.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="font-semibold text-gray-600">
                    {showingTranslateValue(checkout?.discount)}
                  </span>
                  <span className="font-semibold text-gray-900 dark:text-gray-100">
                    {currency}
                    {discountAmount.toFixed(2)}
                  </span>
                </div>

                <form className="w-full mt-8">
                  {couponInfo.couponCode ? (
                    <span className="bg-emerald-50 px-4 py-3 leading-tight w-full rounded-md flex justify-between">
                      {" "}
                      <p className="text-emerald-600">Coupon Applied </p>{" "}
                      <span className="text-red-500 text-right font-semibold">
                        {couponInfo.couponCode}
                      </span>
                    </span>
                  ) : (
                    <div className="flex flex-row items-start justify-end w-full">
                      <Input
                        ref={couponRef}
                        type="text"
                        placeholder="Coupon Code"
                        className="px-4 py-2 h-10 mr-1 border border-gray-300 rounded-md focus:outline-none"
                        // className="form-input py-2 px-3 md:px-4 w-full appearance-none transition ease-in-out border text-input text-sm rounded-md h-12 duration-200 bg-white border-gray-200 focus:ring-0 focus:outline-none focus:border-emerald-500 placeholder-gray-500 placeholder-opacity-75"
                      />
                      <Button
                        onClick={handleCouponCode}
                        className="h-10 rounded-sm"
                        variant="create"
                        // className="md:text-sm leading-4 inline-flex items-center cursor-pointer transition ease-in-out duration-300 font-semibold text-center justify-center border border-gray-200 rounded-md placeholder-white focus-visible:outline-none focus:outline-none px-5 md:px-6 lg:px-8 py-3 md:py-3.5 lg:py-3 mt-3 sm:mt-0 sm:ml-3 md:mt-0 md:ml-3 lg:mt-0 lg:ml-3 hover:text-white hover:bg-emerald-500 h-12 text-sm lg:text-base w-full sm:w-auto"
                      >
                        {showingTranslateValue(checkout?.apply_button)}
                      </Button>
                    </div>
                  )}
                </form>
              </div>
            </div>

            <div className="bg-neutral-100 dark:bg-slate-900 p-8 rounded-b-md">
              <p className="flex justify-between font-semibold text-slate-900 dark:text-slate-100">
                <span>
                  <span className="text-sm">
                    {showingTranslateValue(checkout?.total_cost)}
                  </span>
                  <span className="block text-sm text-slate-500 dark:text-slate-400 font-normal">
                    Shipping and taxes calculated at checkout.
                  </span>
                </span>
                <span className="font-bold text-gray-900 dark:text-gray-100">
                  {currency}
                  {parseFloat(total).toFixed(2)}
                </span>
              </p>

              <div className="flex space-x-3 items-center mt-8">
                <Link
                  href="/products"
                  className="relative h-auto inline-flex items-center justify-center rounded-md transition-colors text-xs sm:text-base font-medium py-2 px-3 bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 flex-1 border border-slate-200 dark:border-slate-700 dark:focus:ring-offset-0"
                >
                  <span className="text-xl mr-2">
                    <IoReturnUpBackOutline />
                  </span>
                  {showingTranslateValue(checkout?.continue_button)}
                </Link>
                <Link
                  href="/checkout"
                  onClick={handleCheckout}
                  className="relative h-auto inline-flex items-center justify-center rounded-md w-full transition-colors text-xs sm:text-base font-medium py-2 px-3 bg-emerald-500 hover:bg-emerald-600 border border-emerald-500 text-white flex-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0 "
                >
                  Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default dynamic(() => Promise.resolve(CheckoutCartScreen), {
  ssr: false,
});
