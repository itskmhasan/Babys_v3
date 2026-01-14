import { CustomPagination as Pagination } from "@/components/ui/pagination";
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
import { useTheme } from "@/context/ThemeContext";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isToday from "dayjs/plugin/isToday";
import isYesterday from "dayjs/plugin/isYesterday";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiCheck, FiRefreshCw, FiShoppingCart, FiTruck } from "react-icons/fi";
import { ImCreditCard, ImStack } from "react-icons/im";

//internal import
import useAsync from "@/hooks/useAsync";
import useFilter from "@/hooks/useFilter";
import NotFound from "@/components/table/NotFound";
import ChartCard from "@/components/chart/ChartCard";
import OrderTable from "@/components/order/OrderTable";
import PieChart from "@/components/chart/Pie/PieChart";
import CardItem from "@/components/dashboard/CardItem";
import OrderServices from "@/services/OrderServices";
import PageTitle from "@/components/Typography/PageTitle";
import { SidebarContext } from "@/context/SidebarContext";
import CardItemTwo from "@/components/dashboard/CardItemTwo";
import LineChart from "@/components/chart/LineChart/LineChart";
import TableLoading from "@/components/preloader/TableLoading";
import AnimatedContent from "@/components/common/AnimatedContent";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  dayjs.extend(isBetween);
  dayjs.extend(isToday);
  dayjs.extend(isYesterday);

  const { currentPage, handleChangePage } = useContext(SidebarContext);

  // react hook
  const [todayOrderAmount, setTodayOrderAmount] = useState(0);
  const [yesterdayOrderAmount, setYesterdayOrderAmount] = useState(0);
  const [salesReport, setSalesReport] = useState([]);
  const [todayCashPayment, setTodayCashPayment] = useState(0);
  const [todayCardPayment, setTodayCardPayment] = useState(0);
  const [todayCreditPayment, setTodayCreditPayment] = useState(0);
  const [yesterdayCashPayment, setYesterdayCashPayment] = useState(0);
  const [yesterdayCardPayment, setYesterdayCardPayment] = useState(0);
  const [yesterdayCreditPayment, setYesterdayCreditPayment] = useState(0);

  // const {
  //   data: bestSellerProductChart,
  //   loading: loadingBestSellerProduct,
  //   error,
  // } = useAsync(OrderServices.getBestSellerProductChart);

  const {
    data: bestSellerProductChart,
    isLoading: loadingBestSellerProduct,
    error,
  } = useQuery({
    queryKey: ["bestSellerProductChart"],
    queryFn: OrderServices.getBestSellerProductChart,
    staleTime: 20 * 60 * 1000, // Cache for 20 minutes
    gcTime: 25 * 60 * 1000, // Garbage collect after 25 minutes
  });

  // const { data: dashboardRecentOrder, loading: loadingRecentOrder } = useAsync(
  //   () => OrderServices.getDashboardRecentOrder({ page: currentPage, limit: 8 })
  // );
  const { data: dashboardRecentOrder, isLoading: loadingRecentOrder } =
    useQuery({
      queryKey: ["dashboardRecentOrder", currentPage],
      queryFn: () =>
        OrderServices.getDashboardRecentOrder({ page: currentPage, limit: 8 }),
      staleTime: 10 * 60 * 1000, // Cache for 10 minutes
      gcTime: 15 * 60 * 1000, // Garbage collect after 15 minutes
      placeholderData: keepPreviousData,
    });

  // const { data: dashboardOrderCount, loading: loadingOrderCount } = useAsync(
  //   OrderServices.getDashboardCount
  // );

  const { data: dashboardOrderCount, isLoading: loadingOrderCount } = useQuery({
    queryKey: ["dashboardOrderCount"],
    queryFn: OrderServices.getDashboardCount,
    staleTime: 15 * 60 * 1000,
  });

  // const { data: dashboardOrderAmount, loading: loadingOrderAmount } = useAsync(
  //   OrderServices.getDashboardAmount
  // );
  const { data: dashboardOrderAmount, isLoading: loadingOrderAmount } =
    useQuery({
      queryKey: ["dashboardOrderAmount"],
      queryFn: OrderServices.getDashboardAmount,
      staleTime: 15 * 60 * 1000,
    });

  // console.log("dashboardOrderCount", dashboardOrderCount);

  const { dataTable, serviceData } = useFilter(dashboardRecentOrder?.orders);

  useEffect(() => {
    // today orders show
    const todayOrder = dashboardOrderAmount?.ordersData?.filter((order) =>
      dayjs(order.updatedAt).isToday()
    );
    //  console.log('todayOrder',dashboardOrderAmount.ordersData)
    const todayReport = todayOrder?.reduce((pre, acc) => pre + acc.total, 0);
    setTodayOrderAmount(todayReport);

    // yesterday orders
    const yesterdayOrder = dashboardOrderAmount?.ordersData?.filter((order) =>
      dayjs(order.updatedAt).set(-1, "day").isYesterday()
    );

    const yesterdayReport = yesterdayOrder?.reduce(
      (pre, acc) => pre + acc.total,
      0
    );
    setYesterdayOrderAmount(yesterdayReport);

    // sales orders chart data
    const salesOrderChartData = dashboardOrderAmount?.ordersData?.filter(
      (order) =>
        dayjs(order.updatedAt).isBetween(
          new Date().setDate(new Date().getDate() - 7),
          new Date()
        )
    );

    salesOrderChartData?.reduce((res, value) => {
      let onlyDate = value.updatedAt.split("T")[0];

      if (!res[onlyDate]) {
        res[onlyDate] = { date: onlyDate, total: 0, order: 0 };
        salesReport.push(res[onlyDate]);
      }
      res[onlyDate].total += value.total;
      res[onlyDate].order += 1;
      return res;
    }, {});

    setSalesReport(salesReport);

    const todayPaymentMethodData = [];
    const yesterDayPaymentMethodData = [];

    // today order payment method
    dashboardOrderAmount?.ordersData?.filter((item, value) => {
      if (dayjs(item.updatedAt).isToday()) {
        if (item.paymentMethod === "Cash") {
          let cashMethod = {
            paymentMethod: "Cash",
            total: item.total,
          };
          todayPaymentMethodData.push(cashMethod);
        }

        if (item.paymentMethod === "Credit") {
          const cashMethod = {
            paymentMethod: "Credit",
            total: item.total,
          };

          todayPaymentMethodData.push(cashMethod);
        }

        if (item.paymentMethod === "Card") {
          const cashMethod = {
            paymentMethod: "Card",
            total: item.total,
          };

          todayPaymentMethodData.push(cashMethod);
        }
      }

      return item;
    });
    // yesterday order payment method
    dashboardOrderAmount?.ordersData?.filter((item, value) => {
      if (dayjs(item.updatedAt).set(-1, "day").isYesterday()) {
        if (item.paymentMethod === "Cash") {
          let cashMethod = {
            paymentMethod: "Cash",
            total: item.total,
          };
          yesterDayPaymentMethodData.push(cashMethod);
        }

        if (item.paymentMethod === "Credit") {
          const cashMethod = {
            paymentMethod: "Credit",
            total: item?.total,
          };

          yesterDayPaymentMethodData.push(cashMethod);
        }

        if (item.paymentMethod === "Card") {
          const cashMethod = {
            paymentMethod: "Card",
            total: item?.total,
          };

          yesterDayPaymentMethodData.push(cashMethod);
        }
      }

      return item;
    });

    const todayCsCdCit = Object.values(
      todayPaymentMethodData.reduce((r, { paymentMethod, total }) => {
        if (!r[paymentMethod]) {
          r[paymentMethod] = { paymentMethod, total: 0 };
        }
        r[paymentMethod].total += total;

        return r;
      }, {})
    );
    const today_cash_payment = todayCsCdCit.find(
      (el) => el.paymentMethod === "Cash"
    );
    setTodayCashPayment(today_cash_payment?.total);
    const today_card_payment = todayCsCdCit.find(
      (el) => el.paymentMethod === "Card"
    );
    setTodayCardPayment(today_card_payment?.total);
    const today_credit_payment = todayCsCdCit.find(
      (el) => el.paymentMethod === "Credit"
    );
    setTodayCreditPayment(today_credit_payment?.total);

    const yesterDayCsCdCit = Object.values(
      yesterDayPaymentMethodData.reduce((r, { paymentMethod, total }) => {
        if (!r[paymentMethod]) {
          r[paymentMethod] = { paymentMethod, total: 0 };
        }
        r[paymentMethod].total += total;

        return r;
      }, {})
    );
    const yesterday_cash_payment = yesterDayCsCdCit.find(
      (el) => el.paymentMethod === "Cash"
    );
    setYesterdayCashPayment(yesterday_cash_payment?.total);
    const yesterday_card_payment = yesterDayCsCdCit.find(
      (el) => el.paymentMethod === "Card"
    );
    setYesterdayCardPayment(yesterday_card_payment?.total);
    const yesterday_credit_payment = yesterDayCsCdCit.find(
      (el) => el.paymentMethod === "Credit"
    );
    setYesterdayCreditPayment(yesterday_credit_payment?.total);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dashboardOrderAmount]);

  return (
    <>
      <div className="lg:flex lg:items-center lg:justify-between py-8 gap-2">
        <div className="min-w-0 flex-1">
          <PageTitle>{t("DashboardOverview")}</PageTitle>
        </div>
      </div>

      <AnimatedContent>
        <div className="grid gap-2 mb-8 xl:grid-cols-5 md:grid-cols-2">
          <CardItemTwo
            mode={theme}
            title="Today Order"
            title2="TodayOrder"
            Icon={ImStack}
            cash={todayCashPayment || 0}
            card={todayCardPayment || 0}
            credit={todayCreditPayment || 0}
            price={todayOrderAmount || 0}
            className="text-white dark:text-emerald-100 bg-teal-600"
            loading={loadingOrderAmount}
          />

          <CardItemTwo
            mode={theme}
            title="Yesterday Order"
            title2="YesterdayOrder"
            Icon={ImStack}
            cash={yesterdayCashPayment || 0}
            card={yesterdayCardPayment || 0}
            credit={yesterdayCreditPayment || 0}
            price={yesterdayOrderAmount || 0}
            className="text-white dark:text-orange-100 bg-orange-400"
            loading={loadingOrderAmount}
          />

          <CardItemTwo
            mode={theme}
            title2="ThisMonth"
            Icon={FiShoppingCart}
            price={dashboardOrderAmount?.thisMonthlyOrderAmount || 0}
            className="text-white dark:text-emerald-100 bg-blue-500"
            loading={loadingOrderAmount}
          />

          <CardItemTwo
            mode={theme}
            title2="LastMonth"
            Icon={ImCreditCard}
            loading={loadingOrderAmount}
            price={dashboardOrderAmount?.lastMonthOrderAmount || 0}
            className="text-white dark:text-teal-100 bg-cyan-600"
          />

          <CardItemTwo
            mode={theme}
            title2="AllTimeSales"
            Icon={ImCreditCard}
            price={dashboardOrderAmount?.totalAmount || 0}
            className="text-white dark:text-emerald-100 bg-emerald-600"
            loading={loadingOrderAmount}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <CardItem
            title="Total Order"
            Icon={FiShoppingCart}
            loading={loadingOrderCount}
            quantity={dashboardOrderCount?.totalOrder || 0}
            className="text-orange-600 dark:text-orange-100 bg-orange-100 dark:bg-orange-500"
          />
          <CardItem
            title={t("OrderPending")}
            Icon={FiRefreshCw}
            loading={loadingOrderCount}
            quantity={dashboardOrderCount?.totalPendingOrder?.count || 0}
            amount={dashboardOrderCount?.totalPendingOrder?.total || 0}
            className="text-blue-600 dark:text-blue-100 bg-blue-100 dark:bg-blue-500"
          />
          <CardItem
            title={t("OrderProcessing")}
            Icon={FiTruck}
            loading={loadingOrderCount}
            quantity={dashboardOrderCount?.totalProcessingOrder || 0}
            className="text-teal-600 dark:text-teal-100 bg-teal-100 dark:bg-teal-500"
          />
          <CardItem
            title={t("OrderDelivered")}
            Icon={FiCheck}
            loading={loadingOrderCount}
            quantity={dashboardOrderCount?.totalDeliveredOrder || 0}
            className="text-emerald-600 dark:text-emerald-100 bg-emerald-100 dark:bg-emerald-500"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 my-8">
          <ChartCard
            mode={theme}
            loading={loadingOrderAmount}
            title={t("WeeklySales")}
          >
            <LineChart salesReport={salesReport} />
          </ChartCard>

          <ChartCard
            mode={theme}
            loading={loadingBestSellerProduct}
            title={t("BestSellingProducts")}
          >
            <PieChart data={bestSellerProductChart} />
          </ChartCard>
        </div>
      </AnimatedContent>

      <div className="pb-5">
        <PageTitle>{t("RecentOrder")}</PageTitle>
      </div>
      {/* <Loading loading={loading} /> */}
      <div className="min-w-0 shadow-sm overflow-hidden bg-white dark:bg-gray-800 rounded-lg mb-4">
        <div className="p-5">
          {loadingRecentOrder ? (
            <TableLoading row={5} col={4} />
          ) : error ? (
            <span className="text-center mx-auto text-red-500">{error}</span>
          ) : serviceData?.length !== 0 ? (
            <div>
              <TableContainer className="mb-8">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("InvoiceNo")}</TableHead>
                      <TableHead>{t("TimeTbl")}</TableHead>
                      <TableHead>{t("CustomerName")} </TableHead>
                      <TableHead> {t("MethodTbl")} </TableHead>
                      <TableHead> {t("AmountTbl")} </TableHead>
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
                  totalresults={dashboardRecentOrder?.totalOrder}
                  resultsperpage={8}
                  onChange={handleChangePage}
                  label="Table navigation"
                />
              </div>
            </div>
          ) : (
            <NotFound title="Sorry, There are no orders right now." />
          )}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
