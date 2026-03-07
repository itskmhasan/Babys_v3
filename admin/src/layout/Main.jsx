import React from "react";
import useGetCData from "@/hooks/useGetCData";
import NotFoundPage from "@/components/common/NotFoundPage";

const Main = ({ children }) => {
  const { path, accessList, role } = useGetCData();
  const privilegedRoles = ["admin", "super admin"];
  const hasPrivilegedRole = privilegedRoles.includes(
    String(role || "").toLowerCase()
  );

  if (!hasPrivilegedRole && !accessList?.includes(path)) {
    return <NotFoundPage />;
  }
  return (
    <main className="h-full overflow-y-auto">
      <div className="sm:container grid lg:px-6 sm:px-4 px-2 mx-auto">
        {children}
      </div>
    </main>
  );
};

export default Main;
