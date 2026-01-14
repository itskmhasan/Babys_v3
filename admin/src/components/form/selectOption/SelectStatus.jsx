import React, { useContext } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

//internal import
import OrderServices from "@/services/OrderServices";
import { notifySuccess, notifyError } from "@/utils/toast";
import { SidebarContext } from "@/context/SidebarContext";
import { useQueryClient } from "@tanstack/react-query";

const SelectStatus = ({ id, order }) => {
  const queryClient = useQueryClient();
  // console.log('id',id ,'order',order)
  const { setIsUpdate } = useContext(SidebarContext);
  const handleChangeStatus = (id, status) => {
    // return notifyError("This option disabled for this option!");
    OrderServices.updateOrder(id, { status: status })
      .then((res) => {
        notifySuccess(res.message);
        queryClient.invalidateQueries({
          queryKey: ["dashboardRecentOrder"],
          exact: false,
        });
        setIsUpdate(true);
      })
      .catch((err) => notifyError(err.message));
  };

  return (
    <>
      <Select
        onValueChange={(value) => handleChangeStatus(id, value)}
        className="h-8"
      >
        <SelectTrigger className="h-8 capitalize">
          <SelectValue placeholder={order?.status} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="delivered">Delivered</SelectItem>
          <SelectItem value="pending">Pending</SelectItem>
          <SelectItem value="processing">Processing</SelectItem>
          <SelectItem value="cancel">Cancel</SelectItem>
        </SelectContent>
      </Select>
    </>
  );
};

export default SelectStatus;
