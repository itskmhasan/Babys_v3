import { IoClose } from "react-icons/io5";
import { Button, Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import React from "react";

const MainModal = ({ children, modalOpen, handleCloseModal }) => {
  return (
    <Dialog
      as="div"
      open={modalOpen}
      onClose={handleCloseModal}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div className="fixed inset-0 z-10 flex items-center justify-center p-4">
        <DialogPanel className="relative rounded-xl bg-white shadow-lg">
          <div className="absolute right-3 top-2">
            <Button
              className="p-2 bg-red-500 hover:bg-red-600 text-end rounded-md cursor-pointer z-10 relative"
              onClick={handleCloseModal}
            >
              <IoClose className="text-lg text-white" />
            </Button>
          </div>
          {/* Modal Content */}
          <div className="overflow-y-auto max-h-[90vh] p-5 lg:p-8">
            {children}
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default MainModal;
