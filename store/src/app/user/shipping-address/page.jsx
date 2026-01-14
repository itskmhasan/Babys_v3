import React from "react";

//internal imports
import { getShippingAddress } from "@services/CustomerServices";
import UpdateShippingAddress from "./UpdateShippingAddress";

const Shipping = async ({ searchParams }) => {
  const { id } = await searchParams;
  const { shippingAddress, error } = await getShippingAddress({
    id: id || "",
  });

  // console.log("getShippingAddress", shippingAddress);
  // console.log("param::", id);
  return (
    <>
      <UpdateShippingAddress shippingAddress={shippingAddress} error={error} />
    </>
  );
};

export default Shipping;
