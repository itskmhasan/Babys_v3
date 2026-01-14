import Link from "next/link";
import React from "react";

const AddressCard = ({ address }) => {
  // console.log("address", address);
  return (
    <div className="flex h-full relative">
      <div className="flex items-center border border-gray-200 w-full rounded-lg p-4 relative">
        <Link
          href={`/user/shipping-address/${address?._id}`}
          className="absolute top-2 right-2 bg-cyan-600 text-white px-3 py-1 rounded hover:bg-cyan-700"
        >
          Edit
        </Link>
        <div className="flex-grow">
          <h5 className="leading-none mb-2 text-base font-medium text-gray-700">
            {address?.name}
          </h5>
          <p className="text-sm text-gray-500">{address?.phone} </p>
          <p className="text-sm text-gray-500">{address?.address} </p>
          <p className="text-sm text-gray-500">
            {address?.country}, {address?.city}, {address?.area}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddressCard;
