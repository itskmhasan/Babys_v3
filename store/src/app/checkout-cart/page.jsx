import CheckoutCartScreen from "@components/checkout/CheckoutCartScreen";
import React from "react";

export const metadata = {
  title: "Checkout Cart | Kachabazar",
  description:
    "Get in touch with us! Find our contact information and fill out our contact form.",
  keywords: ["contact", "email", "phone", "location"],
  // You can also add more advanced metadata here
  openGraph: {
    title: "Checkout Cart | Kachabazar",
    description:
      "Get in touch with us! Find our contact information and fill out our contact form.",
    url: "https://kachabazar-store-nine.vercel.app/faq",
    images: [
      {
        url: "https://kachabazar-store-nine.vercel.app/og-image.jpg",
        width: 800,
        height: 600,
        alt: "Checkout Cart Page",
      },
    ],
  },
};

const CheckoutCart = async () => {
  return (
    <div className="">
      <CheckoutCartScreen />
    </div>
  );
};

export default CheckoutCart;
