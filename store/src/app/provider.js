"use client";

import { CartProvider } from "react-use-cart";
import { ToastContainer } from "react-toastify";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { SessionProvider } from "next-auth/react";

//internal imports
import { UserProvider } from "@context/UserContext";
import { SidebarProvider } from "@context/SidebarContext";
import { LanguageProvider } from "@context/LanguageContext";

let stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY);

const Providers = ({ children, storeSetting }) => {
  stripePromise = loadStripe(
    storeSetting?.stripe_key || process.env.NEXT_PUBLIC_STRIPE_KEY
  );

  return (
    <>
      <ToastContainer />
      <SessionProvider>
        <LanguageProvider>
          <SidebarProvider>
            <UserProvider>
              <Elements stripe={stripePromise}>
                <CartProvider>{children} </CartProvider>
              </Elements>
            </UserProvider>
          </SidebarProvider>
        </LanguageProvider>
      </SessionProvider>
    </>
  );
};

export default Providers;
