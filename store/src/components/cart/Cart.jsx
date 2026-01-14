"use client";

import { useRouter } from "next/navigation";
import { useCart } from "react-use-cart";
import { IoBagCheckOutline, IoClose, IoBagHandle } from "react-icons/io5";

//internal import
import CartItem from "@components/cart/CartItem";
import { getUserSession } from "@lib/auth-client";
import { FiShoppingCart } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

const Cart = ({ setOpen, currency }) => {
  const router = useRouter();
  const { isEmpty, items, cartTotal } = useCart();

  const userInfo = getUserSession();

  const handleCheckout = () => {
    if (items?.length <= 0) {
      setOpen(false);
    } else {
      if (!userInfo) {
        // console.log("userInfo::", userInfo, "history");

        // Redirect to login page with returnUrl query parameter
        // router.push(`/auth/login?redirectUrl=checkout`, { scroll: true });
        // setOpen(false);
        router.push(`/auth/login`, { scroll: true });
      } else {
        router.push("/checkout");
        setOpen(false);
      }
    }
  };

  return (
    <>
      <div className="flex flex-col h-full justify-between items-middle bg-white rounded w-screen max-w-lg">
        <div className="w-full flex justify-between items-center relative px-5 py-4 border-b bg-indigo-50 border-gray-100">
          <h2 className="font-semibold  text-lg m-0 text-heading flex items-center">
            <FiShoppingCart
              aria-hidden="true"
              className="size-6 shrink-0 me-2"
            />
            Shopping Cart
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="inline-flex text-base items-center cursor-pointer justify-center text-gray-500 p-2 focus:outline-none transition-opacity hover:text-red-400"
          >
            <IoClose />
            <span className="font-sens text-sm text-gray-500 hover:text-red-400 ml-1">
              Close
            </span>
          </button>
        </div>
        <div className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-full p-4 lg:p-6">
          {isEmpty && (
            <div className="flex flex-col h-full justify-center">
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

          {items.map((item, i) => (
            <CartItem key={i + 1} item={item} />
          ))}
        </div>
        <div className="bg-neutral-50 dark:bg-slate-900 p-5">
          <p className="flex justify-between font-semibold text-slate-900 dark:text-slate-100">
            <span>
              <span>Subtotal</span>
              <span className="block text-sm text-slate-500 dark:text-slate-400 font-normal">
                Shipping and taxes calculated at checkout.
              </span>
            </span>
            <span>
              {currency}
              {cartTotal.toFixed(2)}
            </span>
          </p>

          <div className="flex space-x-3 mt-5">
            <Link
              href="/checkout-cart"
              className="relative h-auto inline-flex items-center justify-center rounded-md transition-colors text-sm sm:text-base font-medium py-2 px-3 bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-800 flex-1 border border-slate-200 dark:border-slate-700 dark:focus:ring-offset-0"
            >
              View Cart
            </Link>
            <Link
              href="/checkout"
              onClick={handleCheckout}
              className="relative h-auto inline-flex items-center justify-center rounded-md transition-colors text-sm sm:text-base font-medium py-2 px-3 bg-emerald-500 hover:bg-emerald-600 border border-emerald-500 text-white flex-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-6000 dark:focus:ring-offset-0 "
            >
              Checkout
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Cart;
