import { useEffect, useState } from "react";
import { useAction } from "@/context/ActionContext";

const useToggleDrawer = () => {
  const [title, setTitle] = useState("");
  const {
    setOpen,
    openDrawer,
    toggleDrawer,
    setOpenBulkAction,
    setSelectedId,
  } = useAction();

  const handleUpdate = (id) => {
    // console.log("will need to update", id);
    setSelectedId(id);
    toggleDrawer();
  };

  const handleUpdateMany = (ids) => {
    setOpenBulkAction(true);
  };

  const handleModalOpen = (id, title) => {
    setSelectedId(id);
    setOpen(true);
    setTitle(title);
  };

  useEffect(() => {
    if (!openDrawer) {
      setSelectedId();
    }
  }, [openDrawer]);

  const handleDeleteMany = async (ids) => {
    setOpen(true);
    setTitle("Selected Products");
  };

  return {
    title,
    handleUpdate,
    handleModalOpen,
    handleDeleteMany,
    handleUpdateMany,
  };
};

export default useToggleDrawer;
