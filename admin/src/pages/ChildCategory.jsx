import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { FiChevronRight, FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";

//internal import
import useFilter from "@/hooks/useFilter";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import Loading from "@/components/preloader/Loading";
import NotFound from "@/components/table/NotFound";
import CheckBox from "@/components/form/others/CheckBox";
import DeleteModal from "@/components/modal/DeleteModal";
import PageTitle from "@/components/Typography/PageTitle";
import { SidebarContext } from "@/context/SidebarContext";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import CategoryServices from "@/services/CategoryServices";
import CategoryTable from "@/components/category/CategoryTable";
import BulkActionDrawer from "@/components/drawer/BulkActionDrawer";
import AnimatedContent from "@/components/common/AnimatedContent";
import { useAction } from "@/context/ActionContext";
import CategoryDrawer from "@/components/drawer/CategoryDrawer";
import MainDrawer from "@/components/drawer/MainDrawer";

const ChildCategory = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [childCategory, setChildCategory] = useState([]);
  const [selectedObj, setSelectObj] = useState([]);

  const { lang } = useContext(SidebarContext);
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
  // const { data, loading, error } = useAsync(CategoryServices.getAllCategory);

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

  const { showingTranslateValue } = useUtilsFunction();

  useEffect(() => {
    const getAncestors = (target, children, ancestors = []) => {
      for (let node of children) {
        if (node._id === target) {
          return ancestors.concat(node);
        }
        const found = getAncestors(
          target,
          node?.children,
          ancestors?.concat(node)
        );
        if (found) {
          return found;
        }
      }
      return undefined;
    };

    const findChildArray = (obj, target) => {
      // console.log('obj', obj);
      return obj._id === target
        ? obj
        : obj?.children?.reduce(
            (acc, obj) => acc ?? findChildArray(obj, target),
            undefined
          );
    };

    if (!loading) {
      const result = findChildArray(data[0], id);
      const res = getAncestors(id, data[0]?.children);

      if (result?.children?.length > 0) {
        setChildCategory(result?.children);
        setSelectObj(res);
      }
      // console.log("result", result, "res", res);
    }
  }, [id, loading, data, childCategory]);

  const {
    dataTable,
    serviceData,
    totalResults,
    resultsPerPage,
    handleChangePage,
  } = useFilter(childCategory);

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4 lg:py-8 gap-4 lg:gap-2">
        <div className="min-w-0 flex-1">
          <PageTitle>{t("CategoryPageTitle")}</PageTitle>
          <div className="flex items-center py-4">
            <ol className="flex items-center w-full overflow-hidden font-serif">
              <li className="text-sm pr-1 transition duration-200 ease-in cursor-pointer hover:text-emerald-500 font-semibold">
                <Link to={`/categories`}>{t("Categories")}</Link>
              </li>
              {selectedObj?.map((child, i) => (
                <span key={i + 1} className="flex items-center font-serif">
                  <li className="text-sm mt-[1px]">
                    {" "}
                    <FiChevronRight />{" "}
                  </li>
                  <li className="text-sm pl-1 transition duration-200 ease-in cursor-pointer text-blue-700 hover:text-emerald-500 font-semibold ">
                    <Link to={`/categories/${child._id}`}>
                      {showingTranslateValue(child?.name)}
                    </Link>
                  </li>
                </span>
              ))}
            </ol>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-row gap-2 lg:ml-4">
          <Button onClick={toggleDrawer} variant="create">
            <span className="mr-3">
              <FiPlus />
            </span>
            {t("AddCategory")}
          </Button>

          <Button
            disabled={selectedIds?.length < 1}
            onClick={() => handleUpdateMany(selectedIds)}
            variant="bulkAction"
          >
            <FiEdit />
            {t("BulkAction")}
          </Button>

          <Button
            disabled={selectedIds?.length < 1}
            onClick={() => handleDeleteMany(selectedIds)}
            variant="delete"
          >
            <span className="mr-3">
              <FiTrash2 />
            </span>
            {t("Delete")}
          </Button>
        </div>
        <DeleteModal
          category
          open={open}
          title={title}
          id={selectedId}
          onOpenChange={() => setOpen(false)}
          ids={selectedIds?.length > 0 ? selectedIds : null}
        />

        <BulkActionDrawer
          title="Child Categories"
          ids={selectedIds}
          data={isFetched ? data : []}
        />
        <MainDrawer>
          <CategoryDrawer id={selectedId} data={isFetched ? data : []} />
        </MainDrawer>
      </div>

      <AnimatedContent>
        <Card className="min-w-0 shadow-sm overflow-hidden bg-white dark:bg-gray-800 rounded-t-lg rounded-0 mb-4">
          <CardContent className="p-5">
            {loading ? (
              <Loading loading={loading} />
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
                            handleSelect={() => handleSelectAll(childCategory)}
                          />
                        </TableHead>
                        <TableHead>{t("catIdTbl")}</TableHead>
                        <TableHead>{t("catIconTbl")}</TableHead>
                        <TableHead>{t("Name")}</TableHead>
                        <TableHead>{t("Description")}</TableHead>

                        <TableHead className="text-center">
                          {t("catPublishedTbl")}
                        </TableHead>
                        <TableHead className="text-right">
                          {t("catActionsTbl")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <CategoryTable categories={dataTable} showChild={false} />
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

export default ChildCategory;
