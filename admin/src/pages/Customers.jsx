import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

//internal import
import useFilter from "@/hooks/useFilter";
import NotFound from "@/components/table/NotFound";
import UploadMany from "@/components/common/UploadMany";
import CustomerTable from "@/components/customer/CustomerTable";
import TableLoading from "@/components/preloader/TableLoading";
import PageTitle from "@/components/Typography/PageTitle";
import CustomerServices from "@/services/CustomerServices";
import AnimatedContent from "@/components/common/AnimatedContent";
import DeleteModal from "@/components/modal/DeleteModal";
import MainDrawer from "@/components/drawer/MainDrawer";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import { useAction } from "@/context/ActionContext";
import CustomerDrawer from "@/components/drawer/CustomerDrawer";

const Customers = () => {
  const { open, setOpen, selectedId, selectedIds } = useAction();
  const { title } = useToggleDrawer();

  const {
    data,
    error,
    isFetched,
    isLoading: loading,
  } = useQuery({
    queryKey: ["customers"],
    queryFn: CustomerServices.getAllCustomers,
    staleTime: 10 * 60 * 1000, // Cache data for 10 minutes
    gcTime: 15 * 60 * 1000, // Keep data in memory for 15 minutes
  });

  // console.log("customer", data, "isFetched", isFetched);

  // return;

  const filteredData = useMemo(() => {
    return isFetched ? data : [];
  }, [isFetched, data]);

  const {
    userRef,
    dataTable,
    serviceData,
    filename,
    isDisabled,
    setSearchUser,
    totalResults,
    resultsPerPage,
    handleSubmitUser,
    handleSelectFile,
    handleChangePage,
    handleUploadMultiple,
    handleRemoveSelectFile,
  } = useFilter(filteredData);

  const { t } = useTranslation();
  const handleResetField = () => {
    setSearchUser("");
    userRef.current.value = "";
  };

  return (
    <>
      <DeleteModal
        open={open}
        title={title}
        id={selectedId}
        onOpenChange={() => setOpen(false)}
        ids={selectedIds?.length > 0 ? selectedIds : null}
      />

      <MainDrawer>
        <CustomerDrawer id={selectedId} data={isFetched ? data : []} />
      </MainDrawer>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4 lg:py-8 gap-4 lg:gap-2">
        <div className="min-w-0 flex-1">
          <PageTitle>{t("CustomersPage")}</PageTitle>
        </div>
        <form
          onSubmit={handleSubmitUser}
          className="flex flex-col sm:flex-row lg:flex-row gap-2 lg:ml-4"
        >
          <div className="w-full sm:w-auto">
            <UploadMany
              title="Customers"
              exportData={data}
              filename={filename}
              isDisabled={isDisabled}
              handleSelectFile={handleSelectFile}
              handleUploadMultiple={handleUploadMultiple}
              handleRemoveSelectFile={handleRemoveSelectFile}
            />
          </div>
        </form>
      </div>

      <AnimatedContent>
        <Card className="min-w-0 shadow-sm overflow-hidden bg-white dark:bg-gray-800 rounded-t-lg rounded-0 mb-4">
          <CardContent className="p-5">
            <form
              onSubmit={handleSubmitUser}
              className="pb-5 flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <div className="w-full sm:flex-1 relative">
                <Input
                  ref={userRef}
                  type="search"
                  name="search"
                  placeholder={t("CustomersPageSearchPlaceholder")}
                  className="w-full"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </button>
              </div>
              <div className="flex gap-2 sm:flex-shrink-0 sm:min-w-[160px]">
                <Button
                  type="submit"
                  className="h-10 flex-1 sm:min-w-[75px]"
                  variant="export"
                >
                  Filter
                </Button>
                <Button
                  variant="outline"
                  onClick={handleResetField}
                  type="reset"
                  className="h-10 flex-1 sm:min-w-[75px]"
                >
                  <span className="text-black dark:text-gray-200">Reset</span>
                </Button>
              </div>
            </form>
            {loading ? (
              // <Loading loading={loading} />
              <TableLoading row={12} col={6} width={190} height={20} />
            ) : error ? (
              <span className="text-center mx-auto text-red-500">{error}</span>
            ) : serviceData?.length !== 0 ? (
              <div>
                <TableContainer className="mb-4 rounded-b-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("CustomersId")}</TableHead>
                        <TableHead>{t("CustomersJoiningDate")}</TableHead>
                        <TableHead>{t("CustomersName")}</TableHead>
                        <TableHead>{t("CustomersEmail")}</TableHead>
                        <TableHead>{t("CustomersPhone")}</TableHead>
                        <TableHead className="text-right">
                          {t("CustomersActions")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <CustomerTable customers={dataTable} />
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
            ) : (
              <NotFound title="Sorry, There are no customers right now." />
            )}
          </CardContent>
        </Card>
      </AnimatedContent>
    </>
  );
};

export default Customers;
