import React from "react";
import { useParams } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CustomPagination as Pagination } from "@/components/ui/pagination";
import { useTranslation } from "react-i18next";
import { IoBagHandle } from "react-icons/io5";

//internal import
import useAsync from "@/hooks/useAsync";
import OrderServices from "@/services/OrderServices";
import useFilter from "@/hooks/useFilter";
import PageTitle from "@/components/Typography/PageTitle";
import Loading from "@/components/preloader/Loading";
import CustomerOrderTable from "@/components/customer/CustomerOrderTable";

const CustomerOrder = () => {
  const { id } = useParams();
  const { t } = useTranslation();

  const { data, loading, error } = useAsync(() =>
    OrderServices.getOrderCustomer(id)
  );

  const { handleChangePage, totalResults, resultsPerPage, dataTable } =
    useFilter(data);

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4 lg:py-8 gap-4 lg:gap-2">
        <div className="min-w-0 flex-1">
          <PageTitle>{t("CustomerOrderList")}</PageTitle>
        </div>
      </div>

      {loading && <Loading loading={loading} />}
      {!error && !loading && dataTable.length === 0 && (
        <div className="w-full bg-white rounded-md dark:bg-gray-800">
          <div className="p-8 text-center">
            <span className="flex justify-center my-30 text-red-500 font-semibold text-6xl">
              <IoBagHandle />
            </span>
            <h2 className="font-medium text-base mt-4 text-gray-600">
              {t("CustomerOrderEmpty")}
            </h2>
          </div>
        </div>
      )}

      {data.length > 0 && !error && !loading ? (
        <div>
          <TableContainer className="mb-8">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead> {t("CustomerOrderId")} </TableHead>
                  <TableHead>{t("CustomerOrderTime")}</TableHead>
                  <TableHead>{t("CustomerShippingAddress")}</TableHead>
                  <TableHead>{t("Phone")} </TableHead>
                  <TableHead>{t("CustomerOrderMethod")} </TableHead>
                  <TableHead>{t("Amount")}</TableHead>
                  <TableHead className="text-center">
                    {t("CustomerOrderStatus")}{" "}
                  </TableHead>
                  <TableHead className="text-center">
                    {t("CustomerOrderAction")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <CustomerOrderTable orders={dataTable} />
            </Table>
          </TableContainer>
          <div>
            <Pagination
              resultsperpage={resultsPerPage}
              totalresults={totalResults}
              onChange={handleChangePage}
              label="Table navigation"
            />
          </div>
        </div>
      ) : null}
    </>
  );
};

export default CustomerOrder;
