//internal import

import CheckoutForm from "@components/checkout/CheckoutForm";
import { getShippingAddress } from "@services/CustomerServices";

export const metadata = {
  title: "Checkout | Babys",
  description:
    "Complete your purchase securely and quickly with our checkout process.",
  keywords: ["checkout", "payment", "shipping", "order"],
  // You can also add more advanced metadata here
  openGraph: {
    title: "Checkout | Babys | Best Shop for Moms and Babies",
    description:
      "Complete your purchase securely and quickly with our checkout process.",
    url: "https://babys.com.bd/checkout",
    images: [
      {
        url: "https://babys.com.bd/og-image.jpg",
        width: 800,
        height: 600,
        alt: "Checkout Page",
      },
    ],
  },
};

const Checkout = async () => {
  const { shippingAddress, error: shippingError } = await getShippingAddress({
    id: "",
  });
  // console.log("shippingAddress", shippingAddress);

  const hasShippingAddress =
    shippingAddress && Object.keys(shippingAddress).length > 0;

  return (
    <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
      <CheckoutForm
        shippingAddress={shippingAddress}
        hasShippingAddress={hasShippingAddress}
      />
    </div>
  );
};

export default Checkout;
