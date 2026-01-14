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
import { t } from "i18next";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";

//internal import
import useAsync from "@/hooks/useAsync";
import useFilter from "@/hooks/useFilter";
import BulkActionDrawer from "@/components/drawer/BulkActionDrawer";
import CurrencyDrawer from "@/components/drawer/CurrencyDrawer";
import MainDrawer from "@/components/drawer/MainDrawer";
import DeleteModal from "@/components/modal/DeleteModal";
import PageTitle from "@/components/Typography/PageTitle";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import CurrencyServices from "@/services/CurrencyServices";
import TableLoading from "@/components/preloader/TableLoading";
import CheckBox from "@/components/form/others/CheckBox";
import CurrencyTable from "@/components/currency/CurrencyTable";
import NotFound from "@/components/table/NotFound";
import AnimatedContent from "@/components/common/AnimatedContent";
import { useAction } from "@/context/ActionContext";

const Currencies = () => {
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
  const { data, loading, error } = useAsync(CurrencyServices.getAllCurrency);

  const {
    dataTable,
    currencyRef,
    totalResults,
    resultsPerPage,
    handleChangePage,
    handleSubmitCurrency,
  } = useFilter(data);

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4 lg:py-8 gap-4 lg:gap-2">
        <div className="min-w-0 flex-1">
          <PageTitle>Currencies</PageTitle>
        </div>
        <form
          onSubmit={handleSubmitCurrency}
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
              Bulk Action
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
              Delete
            </Button>
            <Button
              onClick={toggleDrawer}
              variant="create"
              className="w-full sm:w-auto"
            >
              <span>
                <FiPlus />
              </span>
              Add Currency
            </Button>
          </div>
        </form>
      </div>

      <BulkActionDrawer ids={selectedIds} title="Currencies" />
      <MainDrawer>
        <CurrencyDrawer id={selectedId} />
      </MainDrawer>
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
              onSubmit={handleSubmitCurrency}
              className="pb-5 flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <div className="w-full sm:flex-1 relative">
                <Input
                  ref={currencyRef}
                  type="search"
                  placeholder={t("SearchIsoCode")}
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
                          <TableHead className="text-center">
                            {t("CurrenciesName")}
                          </TableHead>
                          {/* <TableCell className="text-center">{t("Currencyisocode")}</TableCell> */}
                          <TableHead className="text-center">
                            {t("CurrenciesSymbol")}
                          </TableHead>

                          <TableHead className="text-center">
                            {t("CurrenciesEnabled")}
                          </TableHead>

                          <TableHead className="text-right">
                            {t("CurrenciesActions")}
                          </TableHead>
                        </TableRow>
                      </TableHeader>

                      <CurrencyTable currency={dataTable} />
                    </Table>
                  </TableContainer>
                  {/* <div>
                    <Pagination
                      resultsperpage={resultsPerPage}
                      totalresults={totalResults}
                      onChange={handleChangePage}
                      label="Table navigation"
                    />
                  </div> */}
                </div>
              )
            )}
            {!loading && data.length === 0 && !error && (
              <NotFound title="Sorry, There are no currency right now." />
            )}
          </CardContent>
        </Card>
      </AnimatedContent>
    </>
  );
};

export default Currencies;
