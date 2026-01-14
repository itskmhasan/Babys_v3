"use client";

import { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import dynamic from "next/dynamic";
import { Download, Printer } from "lucide-react";
import { PDFDownloadLink } from "@react-pdf/renderer";

// internal imports
import Invoice from "@components/invoice/Invoice";
import { Button } from "@components/ui/button";
import { useSetting } from "@context/SettingContext";
import useUtilsFunction from "@hooks/useUtilsFunction";
import InvoicePDF from "@components/invoice/InvoiceForDownload";

const DownloadPrintButton = ({ data }) => {
  const { globalSetting, storeCustomization } = useSetting();
  const targetRef = useRef(null);
  const { showingTranslateValue } = useUtilsFunction();
  const dashboard = storeCustomization?.dashboard;

  const handlePrintInvoice = useReactToPrint({
    contentRef: targetRef,
    documentTitle: `Invoice-${data?.invoice}`,
  });

  // Flag to only render PDFDownloadLink after client mount
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  // console.log("globalSetting", globalSetting, "data", data);

  return (
    <>
      <div className="bg-emerald-100 rounded-md mb-5 px-4 py-3">
        <label>
          {showingTranslateValue(dashboard?.invoice_message_first)}{" "}
          <span className="font-bold text-emerald-600">
            {data?.user_info?.name},
          </span>{" "}
          {showingTranslateValue(dashboard?.invoice_message_last)}
        </label>
      </div>

      <Invoice data={data} printRef={targetRef} globalSetting={globalSetting} />

      <div className="bg-white rounded-lg shadow-sm">
        <div className="bg-white p-8 rounded-b-xl">
          <div className="flex lg:flex-row md:flex-row sm:flex-row flex-col justify-between invoice-btn">
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
    </>
  );
};

export default dynamic(() => Promise.resolve(DownloadPrintButton), {
  ssr: false,
});
