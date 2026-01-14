import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { FiPlus } from "react-icons/fi";

//internal import

import useAsync from "@/hooks/useAsync";
import useFilter from "@/hooks/useFilter";
import MainDrawer from "@/components/drawer/MainDrawer";
import StaffDrawer from "@/components/drawer/StaffDrawer";
import TableLoading from "@/components/preloader/TableLoading";
import StaffTable from "@/components/staff/StaffTable";
import NotFound from "@/components/table/NotFound";
import PageTitle from "@/components/Typography/PageTitle";
import { AdminContext } from "@/context/AdminContext";
import AdminServices from "@/services/AdminServices";
import AnimatedContent from "@/components/common/AnimatedContent";
import DeleteModal from "@/components/modal/DeleteModal";
import { useAction } from "@/context/ActionContext";
import useToggleDrawer from "@/hooks/useToggleDrawer";

const Staff = () => {
  const { state } = useContext(AdminContext);
  const { adminInfo } = state;
  const { selectedId, toggleDrawer } = useAction();
  const { title } = useToggleDrawer();

  const { data, loading, error } = useAsync(() =>
    AdminServices.getAllStaff({ email: adminInfo.email })
  );

  const {
    userRef,
    setRole,
    dataTable,
    serviceData,
    totalResults,
    resultsPerPage,
    handleChangePage,
    handleSubmitUser,
  } = useFilter(data);

  const { t } = useTranslation();

  // handle reset filed
  const handleResetField = () => {
    setRole("");
    userRef.current.value = "";
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-4 lg:py-8 gap-4 lg:gap-2">
        <div className="min-w-0 flex-1">
          <PageTitle>{t("StaffPageTitle")} </PageTitle>
        </div>
        <div className="flex flex-col sm:flex-row lg:flex-row gap-2 lg:ml-4">
          <div className="w-full sm:w-auto">
            <Button onClick={toggleDrawer} variant="create">
              <span className="mr-1">
                <FiPlus />
              </span>
              {t("AddStaff")}
            </Button>
          </div>
        </div>
      </div>

      <MainDrawer>
        <StaffDrawer id={selectedId} />
      </MainDrawer>
      <DeleteModal id={selectedId} title={title} />

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
                  placeholder={t("StaffSearchBy")}
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
              <div className="w-full sm:flex-1">
                <Select onValueChange={() => setRole()} className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder={t("StaffRole")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="admin">{t("StaffRoleAdmin")}</SelectItem>
                    <SelectItem value="cashier">
                      {t("SelectCashiers")}
                    </SelectItem>
                    <SelectItem value="super admin">
                      {t("SelectSuperAdmin")}
                    </SelectItem>
                  </SelectContent>
                </Select>
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
                  layout="outline"
                  onClick={handleResetField}
                  type="reset"
                >
                  Reset
                </Button>
              </div>
            </form>

            {loading ? (
              // <Loading loading={loading} />
              <TableLoading row={12} col={7} width={163} height={20} />
            ) : error ? (
              <span className="text-center mx-auto text-red-500">{error}</span>
            ) : serviceData?.length !== 0 ? (
              <div>
                <TableContainer className="mb-8 rounded-b-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("StaffNameTbl")}</TableHead>
                        <TableHead>{t("StaffEmailTbl")}</TableHead>
                        <TableHead>{t("StaffContactTbl")}</TableHead>
                        <TableHead>{t("StaffJoiningDateTbl")}</TableHead>
                        <TableHead>{t("StaffRoleTbl")}</TableHead>
                        <TableHead className="text-center">
                          {t("OderStatusTbl")}
                        </TableHead>
                        <TableHead className="text-center">
                          {t("PublishedTbl")}
                        </TableHead>
                        <TableHead className="text-center">
                          {t("StaffActionsTbl")}
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <StaffTable staffs={dataTable} />
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
              <NotFound title="Sorry, There are no staff right now." />
            )}
          </CardContent>
        </Card>
      </AnimatedContent>
    </>
  );
};

export default Staff;
