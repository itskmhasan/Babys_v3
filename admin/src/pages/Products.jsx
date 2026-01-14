import React, { useContext } from "react";
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
  TableContainer,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from "react-i18next";
import { FiPlus } from "react-icons/fi";
import { FiEdit, FiTrash2 } from "react-icons/fi";

//internal import

import useAsync from "@/hooks/useAsync";
import { useAction } from "@/context/ActionContext";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import UploadMany from "@/components/common/UploadMany";
import NotFound from "@/components/table/NotFound";
import ProductServices from "@/services/ProductServices";
import PageTitle from "@/components/Typography/PageTitle";
import { SidebarContext } from "@/context/SidebarContext";
import ProductTable from "@/components/product/ProductTable";
import MainDrawer from "@/components/drawer/MainDrawer";
import ProductDrawer from "@/components/drawer/ProductDrawer";
import CheckBox from "@/components/form/others/CheckBox";
import useProductFilter from "@/hooks/useProductFilter";
import DeleteModal from "@/components/modal/DeleteModal";
import BulkActionDrawer from "@/components/drawer/BulkActionDrawer";
import TableLoading from "@/components/preloader/TableLoading";
import SelectCategory from "@/components/form/selectOption/SelectCategory";
import AnimatedContent from "@/components/common/AnimatedContent";

const Products = () => {
  const { title, handleDeleteMany, handleUpdateMany } = useToggleDrawer();
  const {
    open,
    setOpen,
    selectedId,
    selectedIds,
    isCheckAll,
    handleSelectAll,
    toggleDrawer,
  } = useAction();

  const { t } = useTranslation();
  const {
    lang,
    category,
    searchText,
    setCategory,
    searchRef,
    currentPage,
    sortedField,
    limitData,
    setSortedField,
    handleChangePage,
    handleSubmitForAll,
  } = useContext(SidebarContext);

  const { data, loading, error } = useAsync(() =>
    ProductServices.getAllProducts({
      page: currentPage,
      limit: limitData,
      category: category,
      title: searchText,
      price: sortedField,
    })
  );

  // handle reset field
  const handleResetField = () => {
    setCategory("");
    setSortedField("");
    searchRef.current.value = "";
  };

  // console.log('productss',products)
  const {
    filename,
    isDisabled,
    serviceData,
    handleSelectFile,
    handleUploadMultiple,
    handleRemoveSelectFile,
  } = useProductFilter(data?.products);

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4 lg:py-8 gap-4 lg:gap-2">
        <div className="min-w-0 flex-1">
          <PageTitle>{t("ProductsPage")}</PageTitle>
        </div>

        <form
          onSubmit={handleSubmitForAll}
          className="flex flex-col sm:flex-row lg:flex-row gap-2 lg:ml-4"
        >
          {/* Upload Component - Full width on mobile, auto on larger screens */}
          <div className="w-full sm:w-auto">
            <UploadMany
              title="Products"
              filename={filename}
              isDisabled={isDisabled}
              totalDoc={data?.totalDoc}
              handleSelectFile={handleSelectFile}
              handleUploadMultiple={handleUploadMultiple}
              handleRemoveSelectFile={handleRemoveSelectFile}
            />
          </div>

          {/* Button Group - Stack on mobile, inline on larger screens */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="bulkAction"
              disabled={selectedIds.length < 1}
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
              {t("AddProduct")}
            </Button>
          </div>
        </form>
      </div>
      <DeleteModal
        open={open}
        title={title}
        ids={selectedIds}
        onOpenChange={() => setOpen(false)}
      />
      <BulkActionDrawer ids={selectedIds} title="Products" />

      <MainDrawer>
        <ProductDrawer id={selectedId} />
      </MainDrawer>
      <AnimatedContent>
        <Card className="min-w-0 shadow-sm overflow-hidden bg-white dark:bg-gray-800 rounded-t-lg rounded-0 mb-4">
          <CardContent className="p-5">
            <form
              onSubmit={handleSubmitForAll}
              className="pb-5 flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              {/* Search Input */}
              <div className="w-full sm:flex-1 relative">
                <Input
                  ref={searchRef}
                  type="search"
                  name="search"
                  placeholder="Search Product"
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

              {/* Category Select */}
              <div className="w-full sm:flex-1">
                <SelectCategory setCategory={setCategory} lang={lang} />
              </div>

              {/* Price/Sort Select */}
              <div className="w-full sm:flex-1">
                <Select onValueChange={setSortedField}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={t("Price")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">{t("LowtoHigh")}</SelectItem>
                    <SelectItem value="high">{t("HightoLow")}</SelectItem>
                    <SelectItem value="published">{t("Published")}</SelectItem>
                    <SelectItem value="unPublished">
                      {t("Unpublished")}
                    </SelectItem>
                    <SelectItem value="status-selling">
                      {t("StatusSelling")}
                    </SelectItem>
                    <SelectItem value="status-out-of-stock">
                      {t("StatusStock")}
                    </SelectItem>
                    <SelectItem value="date-added-asc">
                      {t("DateAddedAsc")}
                    </SelectItem>
                    <SelectItem value="date-added-desc">
                      {t("DateAddedDesc")}
                    </SelectItem>
                    <SelectItem value="date-updated-asc">
                      {t("DateUpdatedAsc")}
                    </SelectItem>
                    <SelectItem value="date-updated-desc">
                      {t("DateUpdatedDesc")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
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
                  <span className="text-black dark:text-gray-200">Reset</span>
                </Button>
              </div>
            </form>

            {loading ? (
              <TableLoading row={12} col={7} width={160} height={20} />
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
                            handleSelect={() => handleSelectAll(data?.products)}
                          />
                        </TableHead>
                        <TableHead>{t("ProductNameTbl")}</TableHead>
                        <TableHead>{t("CategoryTbl")}</TableHead>
                        <TableHead>{t("PriceTbl")}</TableHead>
                        <TableHead>Sale Price</TableHead>
                        <TableHead>{t("StockTbl")}</TableHead>
                        <TableHead>{t("StatusTbl")}</TableHead>
                        <TableHead className="text-center">
                          {t("DetailsTbl")}
                        </TableHead>
                        <TableHead className="text-center">
                          {t("PublishedTbl")}
                        </TableHead>
                        <TableHead className="text-right">
                          {t("ActionsTbl")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <ProductTable products={data?.products} />
                  </Table>
                </TableContainer>
                <div>
                  <Pagination
                    resultsperpage={limitData}
                    totalresults={data?.totalDoc}
                    onChange={handleChangePage}
                    label="Product Page Navigation"
                  />
                </div>
              </div>
            ) : (
              <NotFound title="Product" />
            )}
          </CardContent>
        </Card>
      </AnimatedContent>
    </>
  );
};

export default Products;
