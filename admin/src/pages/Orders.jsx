import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CustomPagination as Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Label } from "@/components/ui/label";
import { useContext, useState } from "react";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { useTranslation } from "react-i18next";
import exportFromJSON from "export-from-json";

//internal import
import { notifyError } from "@/utils/toast";
import useAsync from "@/hooks/useAsync";
import useFilter from "@/hooks/useFilter";
import OrderServices from "@/services/OrderServices";
import NotFound from "@/components/table/NotFound";
import PageTitle from "@/components/Typography/PageTitle";
import { SidebarContext } from "@/context/SidebarContext";
import OrderTable from "@/components/order/OrderTable";
import TableLoading from "@/components/preloader/TableLoading";
import spinnerLoadingImage from "@/assets/img/spinner.gif";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import AnimatedContent from "@/components/common/AnimatedContent";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const Orders = () => {
  const {
    time,
    setTime,
    status,
    endDate,
    setStatus,
    setEndDate,
    startDate,
    currentPage,
    searchText,
    searchRef,
    method,
    setMethod,
    setStartDate,
    setSearchText,
    handleChangePage,
    handleSubmitForAll,
    resultsPerPage,
  } = useContext(SidebarContext);

  const { t } = useTranslation();

  const [loadingExport, setLoadingExport] = useState(false);

  // const { data, loading, error } = useAsync(() =>
  //   OrderServices.getAllOrders({
  //     day: time,
  //     method: method,
  //     status: status,
  //     page: currentPage,
  //     endDate: endDate,
  //     startDate: startDate,
  //     limit: resultsPerPage,
  //     customerName: searchText,
  //   })
  // );

  const {
    data,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: [
      "allOrders",
      time,
      method,
      status,
      currentPage,
      endDate,
      startDate,
      resultsPerPage,
      searchText,
    ],
    queryFn: () =>
      OrderServices.getAllOrders({
        day: time,
        method: method,
        status: status,
        page: currentPage,
        endDate: endDate,
        startDate: startDate,
        limit: resultsPerPage,
        customerName: searchText,
      }),
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    gcTime: 15 * 60 * 1000, // Garbage collect after 15 minutes
    placeholderData: keepPreviousData,
  });

  const { currency, getNumber, getNumberTwo } = useUtilsFunction();

  const { dataTable, serviceData } = useFilter(data?.orders);

  const handleDownloadOrders = async () => {
    try {
      setLoadingExport(true);
      const res = await OrderServices.getAllOrders({
        page: 1,
        day: time,
        method: method,
        status: status,
        endDate: endDate,
        download: true,
        startDate: startDate,
        limit: data?.totalDoc,
        customerName: searchText,
      });

      // console.log("handleDownloadOrders", res);
      const exportData = res?.orders?.map((order) => {
        return {
          _id: order._id,
          invoice: order.invoice,
          subTotal: getNumberTwo(order.subTotal),
          shippingCost: getNumberTwo(order.shippingCost),
          discount: getNumberTwo(order?.discount),
          total: getNumberTwo(order.total),
          paymentMethod: order.paymentMethod,
          status: order.status,
          user_info: order?.user_info?.name,
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
        };
      });
      // console.log("exportData", exportData);

      exportFromJSON({
        data: exportData,
        fileName: "orders",
        exportType: exportFromJSON.types.csv,
      });
      setLoadingExport(false);
    } catch (err) {
      setLoadingExport(false);
      // console.log("err on orders download", err);
      notifyError(err?.response?.data?.message || err?.message);
    }
  };

  // handle reset field
  const handleResetField = () => {
    setTime("");
    setMethod("");
    setStatus("");
    setEndDate("");
    setStartDate("");
    setSearchText("");
    searchRef.current.value = "";
  };
  // console.log("data in orders page", data);

  return (
    <>
      <div className="lg:flex lg:items-center lg:justify-between py-8 gap-2">
        <div className="min-w-0 flex-1">
          <PageTitle>{t("Orders")}</PageTitle>
        </div>
        <form
          onSubmit={handleSubmitForAll}
          className="mt-3 md:flex lg:mt-0 lg:ml-4 gap-2"
        >
          <div className="mt-2 md:mt-0"></div>
          <div className="mt-2 md:mt-0"></div>
          <div className="mt-2 md:mt-0"></div>
        </form>
      </div>

      <AnimatedContent>
        <Card className="min-w-0 shadow-sm overflow-hidden bg-white dark:bg-gray-800 rounded-t-lg rounded-0 mb-4">
          <CardContent>
            <form onSubmit={handleSubmitForAll}>
              <div className="grid gap-4 lg:gap-4 xl:gap-6 md:gap-2 md:grid-cols-5 pt-5 pb-3">
                <div>
                  <Input
                    ref={searchRef}
                    type="search"
                    name="search"
                    placeholder="Search by Customer Name"
                  />
                </div>

                <div>
                  <Select onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Status")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Delivered">
                        {t("PageOrderDelivered")}
                      </SelectItem>
                      <SelectItem value="Pending">
                        {t("PageOrderPending")}
                      </SelectItem>
                      <SelectItem value="Processing">
                        {t("PageOrderProcessing")}
                      </SelectItem>
                      <SelectItem value="Cancel">{t("OrderCancel")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select onValueChange={setTime}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Orderlimits")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">{t("DaysOrders5")}</SelectItem>
                      <SelectItem value="7">{t("DaysOrders7")}</SelectItem>
                      <SelectItem value="15">{t("DaysOrders15")}</SelectItem>
                      <SelectItem value="30">{t("DaysOrders30")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Select onValueChange={setMethod}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("Method")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">{t("Cash")}</SelectItem>
                      <SelectItem value="Card">{t("Card")}</SelectItem>
                      <SelectItem value="Credit">{t("Credit")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  {loadingExport ? (
                    <Button
                      disabled={true}
                      type="button"
                      className="h-12 w-full"
                    >
                      <img
                        src={spinnerLoadingImage}
                        alt="Loading"
                        width={20}
                        height={10}
                      />{" "}
                      <span className="font-serif ml-2 font-light">
                        Processing
                      </span>
                    </Button>
                  ) : (
                    <Button
                      onClick={handleDownloadOrders}
                      disabled={data?.orders?.length <= 0 || loadingExport}
                      type="button"
                      className={`${
                        (data?.orders?.length <= 0 || loadingExport) &&
                        "opacity-50 cursor-not-allowed bg-emerald-600"
                      }  `}
                    >
                      Download All Orders
                      <span className="ml-2 text-base">
                        <IoCloudDownloadOutline />
                      </span>
                    </Button>
                  )}
                </div>
              </div>

              <div className="pb-8 grid gap-4 lg:gap-6 xl:gap-6 lg:grid-cols-3 xl:grid-cols-3 md:grid-cols-3 sm:grid-cols-1 py-2">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    name="startDate"
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>

                <div>
                  <Label>End Date</Label>
                  <Input
                    type="date"
                    name="startDate"
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
                <div className="flex items-center xl:gap-x-4 gap-x-1 flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                  <div className="w-full inline-grid mx-1 mt-2">
                    <Label className="invisible">Filter</Label>
                    <Button type="submit" className="h-10">
                      Filter
                    </Button>
                  </div>

                  <div className="w-full inline-grid mt-2">
                    <Label className="invisible">Reset</Label>
                    <Button
                      className="h-10"
                      variant="outline"
                      onClick={handleResetField}
                      type="reset"
                    >
                      <span className="text-black dark:text-gray-200">
                        Reset
                      </span>
                    </Button>
                  </div>
                </div>
              </div>
            </form>

            {loading ? (
              <TableLoading row={12} col={7} width={160} height={20} />
            ) : error ? (
              <span className="text-center mx-auto text-red-500">{error}</span>
            ) : serviceData?.length !== 0 ? (
              <div>
                <TableContainer className="mb-8 dark:bg-gray-900">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("InvoiceNo")}</TableHead>
                        <TableHead>{t("TimeTbl")}</TableHead>
                        <TableHead>{t("CustomerName")}</TableHead>
                        <TableHead>{t("MethodTbl")}</TableHead>
                        <TableHead>{t("AmountTbl")}</TableHead>
                        <TableHead>{t("OderStatusTbl")}</TableHead>
                        <TableHead>{t("ActionTbl")}</TableHead>
                        <TableHead className="text-right">
                          {t("InvoiceTbl")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <OrderTable orders={dataTable} />
                  </Table>
                </TableContainer>
                <div className="mt-4 flex justify-center">
                  <Pagination
                    resultsperpage={resultsPerPage}
                    totalresults={data?.totalDoc}
                    onChange={handleChangePage}
                  />
                </div>
              </div>
            ) : (
              <NotFound title="Sorry, There are no orders right now." />
            )}
          </CardContent>
        </Card>
      </AnimatedContent>
      {data?.methodTotals?.length > 0 && (
        <Card className="min-w-0 shadow-sm overflow-hidden bg-white dark:bg-gray-800 rounded-t-lg rounded-0 mb-4">
          <CardContent className="p-6">
            <div className="flex gap-1">
              {data?.methodTotals?.map((el, i) => (
                <div key={i + 1} className="dark:text-gray-300">
                  {el?.method && (
                    <>
                      <span className="font-medium"> {el.method}</span> :{" "}
                      <span className="font-semibold mr-2">
                        {currency}
                        {getNumber(el.total)}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default Orders;
