import React from "react";

//internal imports
import { getOrderCustomer } from "@services/OrderServices";
import RecentOrder from "@components/order/RecentOrder";
import { getStoreCustomizationSetting } from "@services/SettingServices";

const MyOrders = async ({ searchParams }) => {
  const { storeCustomizationSetting } = await getStoreCustomizationSetting();

  const { page } = await searchParams;

  const dashboard = storeCustomizationSetting?.dashboard;

  const { data, error } = await getOrderCustomer({
    page: Number(page || 1),
    limit: 10,
  });

  // console.log("dashboard", dashboard);

  return (
    <div className="overflow-hidden">
      <RecentOrder link data={data} error={error} title={dashboard?.my_order} />
    </div>
  );
};

export default MyOrders;
