import React, { useEffect, useRef, useState } from "react";
import { FiPrinter } from "react-icons/fi";
import { useReactToPrint } from "react-to-print";

//internal import

import { notifyError } from "@/utils/toast";
import Tooltip from "@/components/tooltip/Tooltip";
import OrderServices from "@/services/OrderServices";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import InvoiceForPrint from "@/components/invoice/InvoiceForPrint";

const DEFAULT_INVOICE_LOGO = "https://babys.com.bd/logo/Babys_3D_Bright.png";

const PrintReceipt = ({ orderId, order }) => {
  const printRef = useRef(null);
  const [orderData, setOrderData] = useState({});
  const [isPreparingPrint, setIsPreparingPrint] = useState(false);
  const { globalSetting } = useUtilsFunction();
  const printableOrder = orderData?._id ? orderData : order;

  const pageStyle = `
    @media print {
      @page {
        size: ${
          globalSetting?.receipt_size === "A4"
            ? "8.5in 14in"
            : globalSetting?.receipt_size === "3-1/8"
            ? "9.8in 13.8in"
            : globalSetting?.receipt_size === "2-1/4"
            ? "3in 8in"
            : "3.5in 8.5in"
        };
        margin: 0;
        padding: 0;
        font-size: 10px !important;
      }
    
      @page: first {
        size: ${
          globalSetting?.receipt_size === "A4"
            ? "8.5in 14in"
            : globalSetting?.receipt_size === "3-1/8"
            ? "9.8in 13.8in"
            : globalSetting?.receipt_size === "2-1/4"
            ? "3in 8in"
            : "3.5in 8.5in"
        };
        margin: 0;
        font-size: 10px !important;
      }
    }
`;

  const handlePrint = useReactToPrint({
    contentRef: printRef,
    pageStyle: pageStyle,
    documentTitle: "Invoice",
  });

  const handlePrintReceipt = async (id) => {
    try {
      setIsPreparingPrint(true);
      const res = await OrderServices.getOrderById(id);
      if (res?._id) {
        setOrderData(res);
      } else {
        setIsPreparingPrint(false);
        notifyError("Unable to load order details for printing.");
      }
    } catch (err) {
      setIsPreparingPrint(false);
      // console.log("order by user id error", err);
      notifyError(err ? err?.response?.data?.message : err?.message);
    }
    // console.log('id', id);
  };

  useEffect(() => {
    if (!isPreparingPrint || !orderData?._id) return;

    const timer = setTimeout(() => {
      handlePrint();
      setIsPreparingPrint(false);
    }, 120);

    return () => clearTimeout(timer);
  }, [isPreparingPrint, orderData?._id, handlePrint]);

  // console.log("orderData", orderData);

  return (
    <>
      <div style={{ display: "none" }}>
        <InvoiceForPrint
          data={{
            ...printableOrder,
            company_info: {
              ...(printableOrder?.company_info || {}),
              logo:
                printableOrder?.company_info?.logo ||
                globalSetting?.logo ||
                DEFAULT_INVOICE_LOGO,
            },
          }}
          printRef={printRef}
          globalSetting={globalSetting}
        />
      </div>
      <button
        onClick={() => {
          handlePrintReceipt(orderId);
        }}
        type="button"
        className="ml-2 p-2 cursor-pointer text-gray-500 hover:text-emerald-600 focus:outline-none"
      >
        <Tooltip
          id="receipt"
          Icon={FiPrinter}
          title="Print Receipt"
          bgColor="#f59e0b"
        />
      </button>
    </>
  );
};

export default PrintReceipt;
