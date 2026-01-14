import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CustomPagination as Pagination } from "@/components/ui/pagination";
import {
  Table,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";

//internal import
import useFilter from "@/hooks/useFilter";
import NotFound from "@/components/table/NotFound";
import CategoryServices from "@/services/CategoryServices";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import PageTitle from "@/components/Typography/PageTitle";
import MainDrawer from "@/components/drawer/MainDrawer";
import CheckBox from "@/components/form/others/CheckBox";
import UploadMany from "@/components/common/UploadMany";
import { useAction } from "@/context/ActionContext";
import CategoryDrawer from "@/components/drawer/CategoryDrawer";
import TableLoading from "@/components/preloader/TableLoading";
import CategoryTable from "@/components/category/CategoryTable";
import BulkActionDrawer from "@/components/drawer/BulkActionDrawer";
import AnimatedContent from "@/components/common/AnimatedContent";
import SwitchToggleChildCat from "@/components/form/switch/SwitchToggleChildCat";

const Category = () => {
  const queryClient = useQueryClient();
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
  const { title, handleDeleteMany, handleUpdateMany } = useToggleDrawer();

  // Fetch all categories
  const {
    data,
    error,
    isFetched,
    isLoading: loading,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: () => CategoryServices.getAllCategory(),
    staleTime: 10 * 60 * 1000, // Cache data for 10 minutes
    gcTime: 15 * 60 * 1000, // Keep data in memory for 15 minutes
  });

  const filteredCategories = useMemo(() => {
    if (isFetched && data?.[0]?.children) {
      return data[0].children;
    }
    return data || [];
  }, [isFetched, data]);

  // Fetch all categories (alternative function)
  const {
    data: allCategories,
    error: allCategoriesError,
    isLoading: allCategoriesLoading,
  } = useQuery({
    queryKey: ["allCategories"],
    queryFn: () => CategoryServices.getAllCategories(),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const {
    dataTable,
    serviceData,
    filename,
    isDisabled,
    categoryRef,
    totalResults,
    resultsPerPage,
    setCategoryType,
    handleSelectFile,
    handleChangePage,
    handleSubmitCategory,
    handleUploadMultiple,
    handleRemoveSelectFile,
  } = useFilter(filteredCategories);

  // react hooks

  const [showChild, setShowChild] = useState(false);

  // handle reset field function
  const handleResetField = () => {
    setCategoryType("");
    categoryRef.current.value = "";
  };

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  }, []);

  // console.log("serviceData", serviceData, "tableData", dataTable);

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4 lg:py-8 gap-4 lg:gap-2">
        <div className="min-w-0 flex-1">
          <PageTitle>{t("Category")}</PageTitle>
        </div>
        <form
          onSubmit={handleSubmitCategory}
          className="flex flex-col sm:flex-row lg:flex-row gap-2 lg:ml-4"
        >
          <div className="w-full sm:w-auto">
            <UploadMany
              title="Categories"
              filename={filename}
              isDisabled={isDisabled}
              exportData={allCategories || []}
              handleSelectFile={handleSelectFile}
              handleUploadMultiple={handleUploadMultiple}
              handleRemoveSelectFile={handleRemoveSelectFile}
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              disabled={selectedIds?.length < 1}
              onClick={() => handleUpdateMany(selectedIds)}
              variant="bulkAction"
              className="w-full sm:w-auto"
            >
              <span className="mr-2">
                <FiEdit />
              </span>

              {t("BulkAction")}
            </Button>
          </div>
          <div className="mt-2 md:mt-0">
            <Button
              disabled={selectedIds?.length < 1}
              onClick={() => handleDeleteMany(selectedIds)}
              variant="delete"
              className="w-full sm:w-auto"
            >
              <span className="mr-2">
                <FiTrash2 />
              </span>

              {t("Delete")}
            </Button>
          </div>
          <div className="mt-2 md:mt-0">
            <Button
              onClick={toggleDrawer}
              variant="create"
              className="w-full sm:w-auto"
            >
              <span className="mr-2">
                <FiPlus />
              </span>

              {t("AddCategory")}
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

      <BulkActionDrawer
        ids={selectedIds}
        title="Categories"
        data={isFetched ? data : []}
      />

      <MainDrawer>
        <CategoryDrawer id={selectedId} data={isFetched ? data : []} />
      </MainDrawer>

      <AnimatedContent>
        <Card className="min-w-0 shadow-sm overflow-hidden bg-white dark:bg-gray-800 rounded-t-lg rounded-0 mb-4">
          <CardContent className="p-5">
            <form
              onSubmit={handleSubmitCategory}
              className="pb-5 flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <div className="w-full sm:flex-1 relative">
                <Input
                  ref={categoryRef}
                  type="search"
                  placeholder={t("SearchCategory")}
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
                  className="h-10 flex-1 sm:min-w-[75px]"
                  type="submit"
                  variant="export"
                >
                  Filter
                </Button>

                <Button
                  className="h-10 flex-1 sm:min-w-[75px]"
                  variant="outline"
                  onClick={handleResetField}
                  type="reset"
                >
                  Reset
                </Button>
              </div>
              <SwitchToggleChildCat
                title=" "
                className="h-10"
                handleProcess={setShowChild}
                processOption={showChild}
                name={showChild}
              />
            </form>

            {loading ? (
              <TableLoading row={12} col={6} width={190} height={20} />
            ) : error ? (
              <span className="text-center mx-auto text-red-500">{error}</span>
            ) : serviceData?.length !== 0 ? (
              <div>
                <TableContainer className="mb-4 rounded-b-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          <CheckBox
                            type="checkbox"
                            name="selectAll"
                            id="selectAll"
                            isChecked={isCheckAll}
                            handleSelect={() =>
                              handleSelectAll(filteredCategories)
                            }
                          />
                        </TableHead>

                        <TableHead>{t("catIdTbl")}</TableHead>
                        <TableHead>{t("catIconTbl")}</TableHead>
                        <TableHead>{t("CatTbName")}</TableHead>
                        <TableHead>{t("CatTbDescription")}</TableHead>
                        <TableHead className="text-center">
                          {t("catPublishedTbl")}
                        </TableHead>
                        <TableHead className="text-right">
                          {t("catActionsTbl")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <CategoryTable
                      categories={dataTable}
                      showChild={showChild}
                    />
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
              <NotFound title="Sorry, There are no categories right now." />
            )}
          </CardContent>
        </Card>
      </AnimatedContent>
    </>
  );
};

export default Category;
