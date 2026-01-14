//internal import

import CheckoutForm from "@components/checkout/CheckoutForm";
import { getShippingAddress } from "@services/CustomerServices";

export const metadata = {
  title: "Checkout | Kachabazar",
  description:
    "Complete your purchase securely and quickly with our checkout process.",
  keywords: ["checkout", "payment", "shipping", "order"],
  // You can also add more advanced metadata here
  openGraph: {
    title: "Checkout | Kachabazar",
    description:
      "Complete your purchase securely and quickly with our checkout process.",
    url: "https://kachabazar-store-nine.vercel.app/checkout",
    images: [
      {
        url: "https://kachabazar-store-nine.vercel.app/og-image.jpg",
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
