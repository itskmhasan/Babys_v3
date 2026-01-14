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
import React, { useContext, useEffect, useState } from "react";
import { FiChevronRight, FiEdit, FiPlus, FiTrash2 } from "react-icons/fi";
import { Link, useParams } from "react-router-dom";

//internal import
import useFilter from "@/hooks/useFilter";
import Loading from "@/components/preloader/Loading";
import NotFound from "@/components/table/NotFound";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import MainDrawer from "@/components/drawer/MainDrawer";
import CheckBox from "@/components/form/others/CheckBox";
import DeleteModal from "@/components/modal/DeleteModal";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import PageTitle from "@/components/Typography/PageTitle";
import { SidebarContext } from "@/context/SidebarContext";
import AttributeServices from "@/services/AttributeServices";
import AnimatedContent from "@/components/common/AnimatedContent";
import BulkActionDrawer from "@/components/drawer/BulkActionDrawer";
import ChildAttributeTable from "@/components/attribute/ChildAttributeTable";
import AttributeChildDrawer from "@/components/drawer/AttributeChildDrawer";
import { useAction } from "@/context/ActionContext";

const ChildAttributes = () => {
  let { id } = useParams();

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
  const { lang } = useContext(SidebarContext);
  // Fetch attribute by ID
  const {
    data,
    error,
    isLoading: loading,
  } = useQuery({
    queryKey: ["attribute", id], // Unique cache key
    queryFn: () => AttributeServices.getAttributeById(id),
    enabled: !!id, // Only fetch when ID is available
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    gcTime: 15 * 60 * 1000, // Keep data in memory for 15 minutes
  });

  const { showingTranslateValue } = useUtilsFunction();

  // Fetch all attributes
  const {
    data: attributes,
    isLoading: attrLoading,
    error: attrError,
  } = useQuery({
    queryKey: [
      "attributes",
      { type: "attribute", option: "Dropdown", option1: "Radio" },
    ],
    queryFn: () =>
      AttributeServices.getAllAttributes({
        type: "attribute",
        option: "Dropdown",
        option1: "Radio",
      }),
    staleTime: 10 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });

  const {
    totalResults,
    resultsPerPage,
    dataTable,
    serviceData,
    handleChangePage,
  } = useFilter(data?.variants);

  // react hook

  const [attributeData, setAttributeData] = useState([]);

  // attributes filtering except this id
  useEffect(() => {
    const data = attributes?.filter((value) => value._id !== id);
    setAttributeData(data);
  }, [attributes, id]);

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4 lg:py-8 gap-4 lg:gap-2">
        <div className="min-w-0 flex-1">
          <PageTitle>Attributes Values</PageTitle>
          <div className="flex items-center py-4">
            <ol className="flex items-center w-full overflow-hidden font-serif">
              <li className="text-sm pr-1 transition duration-200 ease-in cursor-pointer hover:text-emerald-500 font-semibold">
                <Link className="text-blue-700" to={`/attributes`}>
                  Attributes
                </Link>
              </li>

              <span className="flex items-center font-serif dark:text-gray-400">
                <li className="text-sm mt-[1px]">
                  {" "}
                  <FiChevronRight />{" "}
                </li>

                <li className="text-sm pl-1 font-semibold dark:text-gray-400">
                  {!loading && showingTranslateValue(data?.title)}
                </li>
              </span>
            </ol>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row lg:flex-row gap-2 lg:ml-4">
          <Button onClick={toggleDrawer} variant="create">
            <span className="mr-3">
              <FiPlus />
            </span>
            Add Value
          </Button>

          <Button
            disabled={selectedIds.length < 1}
            onClick={() => handleUpdateMany(selectedIds)}
            variant="bulkAction"
          >
            <FiEdit />
            Bulk Action
          </Button>

          <Button
            disabled={selectedIds.length < 1}
            onClick={() => handleDeleteMany(selectedIds)}
            variant="delete"
          >
            <span className="mr-3">
              <FiTrash2 />
            </span>
            Delete
          </Button>
        </div>

        <DeleteModal
          open={open}
          title={title}
          id={selectedId}
          onOpenChange={() => setOpen(false)}
          ids={selectedIds?.length > 0 ? selectedIds : null}
        />

        <BulkActionDrawer
          childId={id}
          ids={selectedIds}
          attributes={attributeData}
          title="Attribute Value(s)"
        />

        <MainDrawer>
          <AttributeChildDrawer id={selectedId} />
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
                            handleSelect={() => handleSelectAll(data?.variants)}
                          />
                        </TableHead>
                        <TableHead>Id</TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>

                    <ChildAttributeTable
                      att={data}
                      childAttributes={dataTable}
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
              <NotFound title="Sorry, There are no attributes right now." />
            )}
          </CardContent>
        </Card>
      </AnimatedContent>
    </>
  );
};

export default ChildAttributes;
