"use client";

import dynamic from "next/dynamic";
import React, { useState } from "react";
import { IoBagHandleOutline } from "react-icons/io5";
import { useCart } from "react-use-cart";

//internal import
import CartDrawer from "@components/drawer/CartDrawer";

const StickyCart = ({ currency }) => {
  const { totalItems, cartTotal } = useCart();
  const [openCartDrawer, setOpenCartDrawer] = useState(false);

  return (
    <>
      <CartDrawer
        currency={currency}
        open={openCartDrawer}
        setOpen={setOpenCartDrawer}
      />
      {!openCartDrawer && (
        <button
          aria-label="Cart"
          onClick={() => setOpenCartDrawer(!openCartDrawer)}
          className="absolute"
        >
          <div className="right-0 w-35 float-right fixed top-2/4 bottom-2/4 align-middle shadow-lg cursor-pointer z-30 hidden lg:block xl:block">
            <div className="flex flex-col items-center justify-center bg-indigo-50 rounded-tl-lg p-2 text-gray-700">
              <span className="text-2xl mb-1 text-emerald-600">
                <IoBagHandleOutline />
              </span>
              <span className="px-2 text-sm  font-medium">
                {totalItems} Items
              </span>
            </div>
            <div className="flex flex-col items-center justify-center bg-emerald-700 p-2 text-white text-base  font-medium rounded-bl-lg mx-auto">
              {currency}
              {cartTotal.toFixed(2)}
            </div>
          </div>
        </button>
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(StickyCart), { ssr: false });
