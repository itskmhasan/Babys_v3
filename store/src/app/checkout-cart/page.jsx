import CheckoutCartScreen from "@components/checkout/CheckoutCartScreen";
import React from "react";

export const metadata = {
  title: "Checkout Cart",
  description:
    "Get in touch with us! Find our contact information and fill out our contact form.",
  keywords: ["contact", "email", "phone", "location"],
};

const CheckoutCart = async () => {
  return (
    <div className="">
      <CheckoutCartScreen />
    </div>
  );
};

export default CheckoutCart;
