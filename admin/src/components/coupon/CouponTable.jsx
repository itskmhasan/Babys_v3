import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

//internal import
import useUtilsFunction from "@/hooks/useUtilsFunction";
import CheckBox from "@/components/form/others/CheckBox";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import ShowHideButton from "@/components/table/ShowHideButton";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import { useAction } from "@/context/ActionContext";

const CouponTable = ({ coupons }) => {
  const { selectedIds, handleSelect } = useAction();
  const { handleModalOpen, handleUpdate } = useToggleDrawer();
  const { currency, showDateFormat, globalSetting, showingTranslateValue } =
    useUtilsFunction();

  const [updatedCoupons, setUpdatedCoupons] = useState([]);

  useEffect(() => {
    const result = coupons?.map((el) => {
      const newDate = new Date(el?.updatedAt).toLocaleString("en-US", {
        timeZone: globalSetting?.default_time_zone,
      });
      const newObj = {
        ...el,
        updatedDate: newDate,
      };
      return newObj;
    });
    setUpdatedCoupons(result);
  }, [coupons, globalSetting?.default_time_zone]);

  return (
    <>
      <TableBody>
        {updatedCoupons?.map((coupon, i) => (
          <TableRow key={i + 1}>
            <TableCell>
              <CheckBox
                id={coupon._id}
                type="checkbox"
                name={coupon?.title?.en}
                handleSelect={handleSelect}
                isChecked={selectedIds?.includes(coupon._id)}
              />
            </TableCell>

            <TableCell>
              <div className="flex items-center">
                {coupon?.logo ? (
                  <Avatar className="hidden p-1 mr-2 md:block bg-gray-50 shadow-none">
                    <AvatarImage src={coupon?.logo} alt="product" />
                    <AvatarFallback>C</AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar>
                    <AvatarImage
                      src={`https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png`}
                      alt="product"
                    />
                    <AvatarFallback>C</AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <span className="text-sm">
                    {showingTranslateValue(coupon?.title)}
                  </span>{" "}
                </div>
              </div>{" "}
            </TableCell>

            <TableCell>
              {" "}
              <span className="text-sm"> {coupon.couponCode}</span>{" "}
            </TableCell>

            {coupon?.discountType?.type ? (
              <TableCell>
                {" "}
                <span className="text-sm font-semibold">
                  {" "}
                  {coupon?.discountType?.type === "percentage"
                    ? `${coupon?.discountType?.value}%`
                    : `${currency}${coupon?.discountType?.value}`}
                </span>{" "}
              </TableCell>
            ) : (
              <TableCell>
                {" "}
                <span className="text-sm font-semibold"> </span>{" "}
              </TableCell>
            )}

            <TableCell className="text-center">
              <ShowHideButton id={coupon._id} status={coupon.status} />
            </TableCell>

            <TableCell>
              <span className="text-sm">
                {/* {dayjs(coupon.startTime).format("MMM D, YYYY")} */}
                {showDateFormat(coupon.startTime)}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-sm">
                {/* {dayjs(coupon.endTime).format("MMM D, YYYY")} */}
                {showDateFormat(coupon.endTime)}
              </span>
            </TableCell>

            <TableCell className="align-middle ">
              {dayjs().isAfter(dayjs(coupon.endTime)) ? (
                <Badge variant="error">Expired</Badge>
              ) : (
                <Badge variant="success">Active</Badge>
              )}
            </TableCell>

            <TableCell>
              <EditDeleteButton
                id={coupon?._id}
                selectedIds={selectedIds}
                handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
                title={showingTranslateValue(coupon?.title)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default CouponTable;
