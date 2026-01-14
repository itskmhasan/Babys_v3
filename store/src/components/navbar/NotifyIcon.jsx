"use client";

import { BellIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import React, { useState, useEffect } from "react";
import { useCart } from "react-use-cart";

// Internal imports
import CartDrawer from "@components/drawer/CartDrawer";

const NotifyIcon = ({ currency }) => {
  const { totalItems } = useCart();
  const [openCartDrawer, setOpenCartDrawer] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  let [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <>
      <CartDrawer
        currency={currency}
        open={openCartDrawer}
        setOpen={setOpenCartDrawer}
      />
      <button
        type="button"
        aria-label={isHydrated ? `Cart with ${totalItems} items` : "Cart"}
        onClick={() => setOpenCartDrawer(!openCartDrawer)}
        className="relative flex-shrink-0 rounded-full text-gray-200 p-1 mx-2 hover:text-white focus:outline-none"
      >
        {isHydrated && totalItems > 0 && (
          <span className="absolute z-10 top-0 -right-4 inline-flex items-center justify-center p-1 h-5 w-5 text-xs font-medium leading-none text-red-100 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {totalItems}
          </span>
        )}
        <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Notification"
        className="relative flex-shrink-0 rounded-full text-gray-200 p-1 mx-2 hover:text-white focus:outline-none"
      >
        <BellIcon className="h-6 w-6" aria-hidden="true" />
      </button>

      <span className="mx-4 h-6 w-px bg-gray-200 lg:mx-6" aria-hidden="true" />
    </>
  );
};

export default NotifyIcon;
