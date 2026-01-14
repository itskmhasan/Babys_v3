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
import { useContext, useState } from "react";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import { useTranslation } from "react-i18next";

//internal import

import useAsync from "@/hooks/useAsync";
import useFilter from "@/hooks/useFilter";
import NotFound from "@/components/table/NotFound";
import UploadMany from "@/components/common/UploadMany";
import CouponServices from "@/services/CouponServices";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import { SidebarContext } from "@/context/SidebarContext";
import PageTitle from "@/components/Typography/PageTitle";
import DeleteModal from "@/components/modal/DeleteModal";
import MainDrawer from "@/components/drawer/MainDrawer";
import CouponDrawer from "@/components/drawer/CouponDrawer";
import TableLoading from "@/components/preloader/TableLoading";
import CheckBox from "@/components/form/others/CheckBox";
import CouponTable from "@/components/coupon/CouponTable";
import BulkActionDrawer from "@/components/drawer/BulkActionDrawer";
import AnimatedContent from "@/components/common/AnimatedContent";
import { useAction } from "@/context/ActionContext";

const Coupons = () => {
  const { t } = useTranslation();

  const {
    open,
    setOpen,
    selectedId,
    selectedIds,
    isCheckAll,
    toggleDrawer,
    handleSelectAll,
  } = useAction();
  const { data, loading, error } = useAsync(CouponServices.getAllCoupons);

  const { title, handleDeleteMany, handleUpdateMany } = useToggleDrawer();

  const {
    filename,
    isDisabled,
    couponRef,
    dataTable,
    serviceData,
    totalResults,
    resultsPerPage,
    handleChangePage,
    handleSelectFile,
    setSearchCoupon,
    handleSubmitCoupon,
    handleUploadMultiple,
    handleRemoveSelectFile,
  } = useFilter(data);

  // handle reset field function
  const handleResetField = () => {
    setSearchCoupon("");
    couponRef.current.value = "";
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4 lg:py-8 gap-4 lg:gap-2">
        <div className="min-w-0 flex-1">
          <PageTitle>{t("CouponspageTitle")}</PageTitle>
        </div>
        <form
          onSubmit={handleSubmitCoupon}
          className="flex flex-col sm:flex-row lg:flex-row gap-2 lg:ml-4"
        >
          <div className="w-full sm:w-auto">
            <UploadMany
              title="Coupon"
              exportData={data}
              filename={filename}
              isDisabled={isDisabled}
              handleSelectFile={handleSelectFile}
              handleUploadMultiple={handleUploadMultiple}
              handleRemoveSelectFile={handleRemoveSelectFile}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="bulkAction"
              disabled={selectedIds?.length < 1}
              onClick={() => handleUpdateMany(selectedIds)}
              className="w-full sm:w-auto"
            >
              <span>
                <FiEdit />
              </span>
              {t("BulkAction")}
            </Button>
            <Button
              variant="delete"
              disabled={selectedIds?.length < 1}
              onClick={() => handleDeleteMany(selectedIds)}
              className="w-full sm:w-auto"
            >
              <span>
                <FiTrash2 />
              </span>

              {t("Delete")}
            </Button>
            <Button
              variant="create"
              onClick={toggleDrawer}
              className="w-full sm:w-auto"
            >
              <span>
                <FiPlus />
              </span>
              {t("AddCouponsBtn")}
            </Button>
          </div>
        </form>
      </div>

      <DeleteModal
        open={open}
        title={title}
        id={selectedId}
        onOpenChange={() => setOpen(false)}
        ids={selectedIds?.length > 0 ? selectedIds : null}
      />
      <BulkActionDrawer ids={selectedIds} title="Coupons" />

      <MainDrawer>
        <CouponDrawer id={selectedId} />
      </MainDrawer>

      <AnimatedContent>
        <Card className="min-w-0 shadow-sm overflow-hidden bg-white dark:bg-gray-800 rounded-t-lg rounded-0 mb-4">
          <CardContent className="p-5">
            <form
              onSubmit={handleSubmitCoupon}
              className="pb-5 flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <div className="w-full sm:flex-1 relative">
                <Input
                  ref={couponRef}
                  type="search"
                  placeholder={t("SearchCoupon")}
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
                  className="h-10 flex-1 sm:min-w-[75px]"
                  onClick={handleResetField}
                  type="reset"
                  variant="outline"
                >
                  <span className="text-black dark:text-gray-200">Reset</span>
                </Button>
              </div>
            </form>
            {loading ? (
              // <Loading loading={loading} />
              <TableLoading row={12} col={8} width={140} height={20} />
            ) : error ? (
              <span className="text-center mx-auto text-red-500">{error}</span>
            ) : serviceData?.length !== 0 ? (
              <div>
                <TableContainer className="mb-8 rounded-b-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <CheckBox
                            type="checkbox"
                            name="selectAll"
                            id="selectAll"
                            isChecked={isCheckAll}
                            handleSelect={() => handleSelectAll(data)}
                          />
                        </TableHead>
                        <TableHead>{t("CoupTblCampaignsName")}</TableHead>
                        <TableHead>{t("CoupTblCode")}</TableHead>
                        <TableHead>{t("Discount")}</TableHead>

                        <TableHead className="text-center">
                          {t("catPublishedTbl")}
                        </TableHead>
                        <TableHead>{t("CoupTblStartDate")}</TableHead>
                        <TableHead>{t("CoupTblEndDate")}</TableHead>
                        <TableHead>{t("CoupTblStatus")}</TableHead>
                        <TableHead className="text-right">
                          {t("CoupTblActions")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <CouponTable coupons={dataTable} />
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
              <NotFound title="Sorry, There are no coupons right now." />
            )}
          </CardContent>
        </Card>
      </AnimatedContent>
    </>
  );
};

export default Coupons;
