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
          className="fixed right-6 top-1/2 -translate-y-1/2 z-30 hidden lg:block"
        >
          <div className="overflow-hidden rounded-lg shadow-lg cursor-pointer">
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-violet-400 to-purple-500 p-3 text-white">
              <span className="text-2xl text-white drop-shadow-lg">
                <IoBagHandleOutline />
              </span>
              <span className="text-sm font-semibold mt-1">
                {totalItems} Items
              </span>
            </div>
            <div className="flex flex-col items-center justify-center bg-gradient-to-br from-violet-500 to-cyan-600 px-3 py-2 text-white text-base font-bold shadow-md">
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
