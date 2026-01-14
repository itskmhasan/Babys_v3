import React from "react";

//internal imports

import useUtilsFunction from "@hooks/useUtilsFunction";
import ImageWithFallback from "@components/common/ImageWithFallBack";

const OrderTable = ({ data, currency, drawer }) => {
  const { getNumberTwo } = useUtilsFunction();

  return (
    <tbody className="divide-y divide-gray-100">
      {data?.cart?.map((item, i) => (
        <tr key={i}>
          <th className="px-6 py-2 text-sm font-normal text-gray-500 text-left">
            {i + 1}{" "}
          </th>
          {drawer && (
            <td className="px-6 py-2 text-sm font-normal text-gray-500">
              <ImageWithFallback
                img
                width={40}
                height={40}
                src={item?.image}
                alt={item.title}
              />
            </td>
          )}
          <td className="px-6 py-2 text-sm font-normal text-gray-500">
            {item.title}
          </td>
          <td className="px-6 py-2 text-sm text-center text-gray-500">
            {item.quantity}{" "}
          </td>
          <td className="px-6 py-2 text-sm font-medium text-center text-gray-500">
            {currency}
            {getNumberTwo(item.price)}
          </td>

          <td className="px-6 py-2 text-sm text-right font-semibold text-gray-500">
            {currency}
            {getNumberTwo(item.itemTotal)}
          </td>
        </tr>
      ))}
    </tbody>
  );
};

export default OrderTable;
