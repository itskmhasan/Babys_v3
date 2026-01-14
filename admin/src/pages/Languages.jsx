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
import { FiPlus } from "react-icons/fi";
import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { FiEdit, FiTrash2 } from "react-icons/fi";
//internal import
import BulkActionDrawer from "@/components/drawer/BulkActionDrawer";
import CheckBox from "@/components/form/others/CheckBox";
import LanguageTable from "@/components/language/LanguageTable";
import DeleteModal from "@/components/modal/DeleteModal";
import TableLoading from "@/components/preloader/TableLoading";
import NotFound from "@/components/table/NotFound";
import useAsync from "@/hooks/useAsync";
import useFilter from "@/hooks/useFilter";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import LanguageServices from "@/services/LanguageServices";
import PageTitle from "@/components/Typography/PageTitle";
import { SidebarContext } from "@/context/SidebarContext";
import LanguageDrawer from "@/components/drawer/LanguageDrawer";
import MainDrawer from "@/components/drawer/MainDrawer";
import AnimatedContent from "@/components/common/AnimatedContent";
import { useAction } from "@/context/ActionContext";

const Languages = () => {
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
  const { data, loading, error } = useAsync(LanguageServices.getAllLanguages);
  // console.log("data-language", data);
  const {
    dataTable,
    languageRef,
    totalResults,
    resultsPerPage,
    handleChangePage,
    handleSubmitLanguage,
  } = useFilter(data);

  const { t } = useTranslation();

  // console.log(
  //   "data",
  //   data,
  //   "totalResults",
  //   totalResults,
  //   "resultsPerPage",
  //   resultsPerPage
  // );

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4 lg:py-8 gap-4 lg:gap-2">
        <div className="min-w-0 flex-1">
          <PageTitle>Languages</PageTitle>
        </div>
        <form
          onSubmit={handleSubmitLanguage}
          className="flex flex-col sm:flex-row lg:flex-row gap-2 lg:ml-4"
        >
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
              Add language
            </Button>
          </div>
        </form>
      </div>

      <MainDrawer>
        <LanguageDrawer id={selectedId} />
      </MainDrawer>

      <BulkActionDrawer ids={selectedIds} title="Languages" />
      <DeleteModal
        open={open}
        title={title}
        id={selectedId}
        onOpenChange={() => setOpen(false)}
        ids={selectedIds?.length > 0 ? selectedIds : null}
      />

      <AnimatedContent>
        <Card className="min-w-0 shadow-sm overflow-hidden bg-white dark:bg-gray-800 rounded-t-lg rounded-0 mb-4">
          <CardContent className="p-5">
            <form
              onSubmit={handleSubmitLanguage}
              className="pb-5 flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <div className="w-full sm:flex-1 relative">
                <Input
                  ref={languageRef}
                  type="search"
                  placeholder={t("SearchLanguage")}
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
            </form>
            {loading ? (
              // <Loading loading={loading} />
              <TableLoading row={12} col={7} width={163} height={20} />
            ) : error ? (
              <span className="text-center mx-auto text-red-500">{error}</span>
            ) : (
              data.length !== 0 && (
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
                          {/* <TableHead>{t("LanguagesSr")}</TableHead> */}
                          <TableHead>{t("LanguagesNname")}</TableHead>
                          <TableHead>{t("LanguagesIsoCode")}</TableHead>
                          <TableHead>{t("LanguagesFlag")}</TableHead>
                          <TableHead className="text-center">
                            {t("LanguagesPublished")}
                          </TableHead>
                          <TableHead className="text-right">
                            {t("LanguagesActions")}
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <LanguageTable languages={dataTable} />
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
              )
            )}
            {!loading && data.length === 0 && !error && (
              <NotFound title="Sorry, There are no languages right now." />
            )}
          </CardContent>
        </Card>
      </AnimatedContent>
    </>
  );
};

export default Languages;
