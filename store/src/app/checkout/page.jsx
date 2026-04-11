//internal import

import CheckoutForm from "@components/checkout/CheckoutForm";
import { getShippingAddress } from "@services/CustomerServices";

export const metadata = {
  title: "Checkout",
  description:
    "Complete your purchase securely and quickly with our checkout process.",
  keywords: ["checkout", "payment", "shipping", "order"],
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
