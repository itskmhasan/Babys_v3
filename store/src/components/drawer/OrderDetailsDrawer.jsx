import React, { useContext, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { useReactToPrint } from "react-to-print";
import { CreditCard, Download, Printer, Truck, X } from "lucide-react";

//internal import
import MainDrawer from "./MainDrawer";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { SidebarContext } from "@context/SidebarContext";
import { useSetting } from "@context/SettingContext";
import OrderItems from "@components/order/OrderItems";
import { Button } from "@components/ui/button";
import InvoicePDF from "@components/invoice/InvoiceForDownload";

const OrderDetailsDrawer = ({ data }) => {
  const printRef = useRef();
  const { drawerOpen, closeDrawer } = useContext(SidebarContext);
  const { globalSetting, storeCustomization } = useSetting();
  const { showingTranslateValue, getNumberTwo, currency } = useUtilsFunction();

  const dashboard = storeCustomization?.dashboard;

  const handlePrintInvoice = useReactToPrint({
    contentRef: printRef,
    documentTitle: `Invoice-${data?.invoice}`,
  });

  // Flag to only render PDFDownloadLink after client mount
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <MainDrawer open={drawerOpen} onClose={closeDrawer}>
      <div className="flex flex-col w-full h-full justify-between items-middle bg-white rounded">
        <div
          ref={printRef}
          className="overflow-y-scroll scrollbar-hide w-full max-h-full"
        >
          <div className="w-full flex justify-between items-center relative px-5 py-4 border-b bg-indigo-50 border-gray-100">
            <div className="flex flex-col">
              <h2 className="font-semibold text-lg m-0 text-heading flex items-center">
                Invoice No #{data?.invoice}
              </h2>

              <div className="text-sm">
                {(data.status === "Delivered" ||
                  data?.status === "delivered") && (
                  <span className="flex items-center gap-x-2 justify-start">
                    <div className="flex-none rounded-full bg-green-400/10 p-1 text-green-400">
                      <div className="size-2.5 rounded-full bg-current"></div>
                    </div>
                    <span className="block">{data.status}</span>
                  </span>
                )}
                {(data.status === "Pending" || data?.status === "pending") && (
                  <span className="flex items-center gap-x-2 justify-start">
                    <div className="flex-none rounded-full bg-orange-400/10 p-1 text-orange-400">
                      <div className="size-2.5 rounded-full bg-current"></div>
                    </div>
                    <span className="block">{data.status}</span>
                  </span>
                )}
                {(data.status === "Cancel" || data.status === "cancel") && (
                  <span className="flex items-center gap-x-2 justify-start">
                    <div className="flex-none rounded-full bg-red-400/10 p-1 text-red-400">
                      <div className="size-2.5 rounded-full bg-current"></div>
                    </div>
                    <span className="block">{data.status}</span>
                  </span>
                )}
                {(data.status === "Processing" ||
                  data.status === "processing") && (
                  <span className="flex items-center gap-x-2 justify-start">
                    <div className="flex-none rounded-full bg-emerald-400/10 p-1 text-emerald-400">
                      <div className="size-2.5 rounded-full bg-current"></div>
                    </div>
                    <span className="block">{data.status}</span>
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={closeDrawer}
              className="inline-flex print:hidden text-base items-center cursor-pointer justify-center text-gray-500 p-2 focus:outline-none transition-opacity hover:text-red-400"
            >
              <X />
              <span className="font-sens text-sm text-gray-500 hover:text-red-400 ml-1">
                Close
              </span>
            </button>
          </div>
          <div className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-full px-3 sm:px-6 py-4">
            <div className="bg-emerald-100 rounded-md mb-5 px-4 py-3 hidden">
              <label>
                {showingTranslateValue(dashboard?.invoice_message_first)}{" "}
                <span className="font-bold text-emerald-600">
                  {data?.user_info?.name},
                </span>{" "}
                {showingTranslateValue(dashboard?.invoice_message_last)}
              </label>
            </div>

            <OrderItems drawer data={data} currency={currency} />
            <div className="border border-gray-200 mt-4 rounded-md">
              {data?.status === "delivered" ||
                (data?.status === "Delivered" && (
                  <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                    <span>
                      <Truck
                        aria-hidden="true"
                        className="size-4.5 text-gray-400 shrink-0"
                      />
                    </span>
                    <div className="items-center gap-4 flex justify-between flex-wrap">
                      <span className="font-semibold text-base">Delivery </span>
                      <span className="text-gray-600 text-sm">
                        Estimated Delivery: <strong>Feb 8, 2025</strong>
                      </span>
                    </div>
                  </div>
                ))}
              <div className="flex flex-col text-gray-500 p-4 text-sm">
                <span>{data?.user_info?.name}</span>
                <span>{data?.user_info?.email} </span>
                <span>
                  {data?.user_info?.address} {data?.city} {data?.country}
                  {data?.zipCode}
                </span>
                <span className="font-medium">{data?.user_info?.contact}</span>
              </div>
            </div>
            <div className="mt-6 border border-gray-200 rounded-md">
              <div className="flex items-center gap-3 p-4 border-b border-gray-200">
                <span>
                  <CreditCard
                    aria-hidden="true"
                    className="size-4.5 text-gray-400 shrink-0"
                  />
                </span>
                <div className="flex justify-between items-center gap-4 flex-wrap">
                  <h4 className="font-semibold text-base">Payment</h4>
                  <p className="text-gray-500 text-sm">
                    Payment Method: <strong>{data?.paymentMethod}</strong>
                  </p>
                </div>
              </div>
              <div className="flex flex-col text-gray-500 p-4">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>Shipping Cost</span>
                  <span className="text-gray-800 font-semibold">
                    {currency}
                    {getNumberTwo(data.shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Discount</span>
                  <span className="text-gray-800 font-semibold">
                    {currency}
                    {getNumberTwo(data.discount)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-sm text-gray-500 bg-gray-50 px-4 py-2">
                <span>Total Amount</span>
                <span className="text-red-500 font-bold text-base">
                  {currency}
                  {getNumberTwo(data.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-neutral-50 dark:bg-slate-900 p-6 mt-4">
          <div className="flex space-x-3 flex-wrap justify-between">
            {isClient && (
              <PDFDownloadLink
                document={
                  <InvoicePDF data={data} globalSetting={globalSetting} />
                }
                fileName={`Invoice-${data.invoice}.pdf`}
              >
                {({ loading }) => (
                  <Button variant="create">
                    {loading ? "Generating..." : "Download PDF"}{" "}
                    <Download className="ml-2" />
                  </Button>
                )}
              </PDFDownloadLink>
            )}

            <Button onClick={handlePrintInvoice} variant="import">
              {showingTranslateValue(dashboard?.print_button)}{" "}
              <span className="ml-2">
                <Printer />
              </span>
            </Button>
          </div>
        </div>
      </div>
    </MainDrawer>
  );
};

export default dynamic(() => Promise.resolve(OrderDetailsDrawer), {
  ssr: false,
});
