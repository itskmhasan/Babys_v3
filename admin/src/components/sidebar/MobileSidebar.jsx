import React, { useContext } from "react";
import { cn } from "@/lib/utils";

//internal import
import SidebarContent from "@/components/sidebar/SidebarContent";
import { SidebarContext } from "@/context/SidebarContext";

function MobileSidebar() {
  const { isSidebarOpen, closeSidebar } = useContext(SidebarContext);

  return (
    <>
      {isSidebarOpen && (
        <>
          <div 
            className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity duration-150"
            onClick={closeSidebar}
          />

          <aside className={cn(
            "fixed inset-y-0 z-50 flex-shrink-0 w-64 mt-16 overflow-y-auto bg-white dark:bg-gray-800 lg:hidden",
            "transition-transform duration-150 ease-in-out",
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            <SidebarContent />
          </aside>
        </>
      )}
    </>
  );
}

export default MobileSidebar;
