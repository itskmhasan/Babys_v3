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
import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

//internal import
import useFilter from "@/hooks/useFilter";
import NotFound from "@/components/table/NotFound";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import PageTitle from "@/components/Typography/PageTitle";
import UploadMany from "@/components/common/UploadMany";
import MainDrawer from "@/components/drawer/MainDrawer";
import CheckBox from "@/components/form/others/CheckBox";
import DeleteModal from "@/components/modal/DeleteModal";
import AttributeServices from "@/services/AttributeServices";
import AnimatedContent from "@/components/common/AnimatedContent";
import AttributeDrawer from "@/components/drawer/AttributeDrawer";
import BulkActionDrawer from "@/components/drawer/BulkActionDrawer";
import AttributeTable from "@/components/attribute/AttributeTable";
import TableLoading from "@/components/preloader/TableLoading";
import { useAction } from "@/context/ActionContext";

//internal import

const Attributes = () => {
  const {
    open,
    setOpen,
    selectedId,
    selectedIds,
    isCheckAll,
    toggleDrawer,
    handleSelectAll,
  } = useAction();

  const { title, handleDeleteMany, handleUpdateMany } = useToggleDrawer();

  const {
    data,
    error,
    isLoading: loading,
  } = useQuery({
    queryKey: ["attributes"],
    queryFn: () =>
      AttributeServices.getAllAttributes({
        type: "attribute",
        option: "Dropdown",
        option1: "Radio",
      }),
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    gcTime: 15 * 60 * 1000, // Keep data in memory for 15 minutes
    placeholderData: keepPreviousData,
  });

  const { t } = useTranslation();

  const {
    filename,
    isDisabled,
    dataTable,
    serviceData,
    totalResults,
    attributeRef,
    resultsPerPage,
    handleSelectFile,
    handleChangePage,
    setAttributeTitle,
    handleSubmitAttribute,
    handleUploadMultiple,
    handleRemoveSelectFile,
  } = useFilter(data);

  // handle reset field function
  const handleResetField = () => {
    setAttributeTitle("");
    attributeRef.current.value = "";
  };

  // console.log("resultsPerPage", resultsPerPage, "totalResult", totalResults);

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4 lg:py-8 gap-4 lg:gap-2">
        <div className="min-w-0 flex-1">
          <PageTitle>{t("AttributeTitle")}</PageTitle>
        </div>
        <form
          onSubmit={handleSubmitAttribute}
          className="flex flex-col sm:flex-row lg:flex-row gap-2 lg:ml-4"
        >
          <div className="w-full sm:w-auto">
            <UploadMany
              title="Attribute"
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
              disabled={selectedIds.length < 1}
              onClick={() => handleUpdateMany(selectedIds)}
              variant="bulkAction"
              className="w-full sm:w-auto"
            >
              <span>
                <FiEdit />
              </span>

              {t("BulkAction")}
            </Button>
            <Button
              disabled={selectedIds.length < 1}
              onClick={() => handleDeleteMany(selectedIds)}
              variant="delete"
              className="w-full sm:w-auto"
            >
              <span>
                <FiTrash2 />
              </span>
              {t("Delete")}
            </Button>

            <Button
              onClick={toggleDrawer}
              variant="create"
              className="w-full sm:w-auto"
            >
              <span>
                <FiPlus />
              </span>
              {t("CouponsAddAttributeBtn")}
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
      <BulkActionDrawer ids={selectedIds} title="Attributes" />
      <MainDrawer>
        <AttributeDrawer id={selectedId} />
      </MainDrawer>

      <AnimatedContent>
        <Card className="min-w-0 shadow-sm overflow-hidden bg-white dark:bg-gray-800 rounded-t-lg rounded-0 mb-4">
          <CardContent className="p-5">
            <form
              onSubmit={handleSubmitAttribute}
              className="pb-5 flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <div className="w-full sm:flex-1 relative">
                <Input
                  ref={attributeRef}
                  type="search"
                  placeholder={t("SearchAttributePlaceholder")}
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
                  className="h-10 flex-1 sm:min-w-[75px]"
                  onClick={handleResetField}
                  type="reset"
                >
                  <span className="text-black dark:text-gray-200">Reset</span>
                </Button>
              </div>
            </form>

            {loading ? (
              <TableLoading row={12} col={6} width={180} height={20} />
            ) : error ? (
              <span className="text-center mx-auto text-red-500">{error}</span>
            ) : serviceData?.length !== 0 ? (
              <div>
                <TableContainer className="mb-8">
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
                        <TableHead> {t("Id")} </TableHead>
                        <TableHead> {t("AName")}</TableHead>
                        <TableHead> {t("ADisplayName")}</TableHead>
                        <TableHead>{t("AOption")}</TableHead>

                        <TableHead className="text-center">
                          {t("catPublishedTbl")}
                        </TableHead>

                        <TableHead className="text-center">
                          {t("Avalues")}
                        </TableHead>

                        <TableHead className="text-right">
                          {t("AAction")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <AttributeTable attributes={dataTable} />
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
              <NotFound title="Sorry, There are no attributes right now." />
            )}
          </CardContent>
        </Card>
      </AnimatedContent>
    </>
  );
};

export default Attributes;
