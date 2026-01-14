import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { FiTrash2 } from "react-icons/fi";

//internal import
import CustomerServices from "@/services/CustomerServices";
import AdminServices from "@/services/AdminServices";
import CouponServices from "@/services/CouponServices";
import ProductServices from "@/services/ProductServices";
import CategoryServices from "@/services/CategoryServices";
import { SidebarContext } from "@/context/SidebarContext";
import { notifySuccess, notifyError } from "@/utils/toast";
import useToggleDrawer from "@/hooks/useToggleDrawer";

const MainModal = ({ id, title }) => {
  const { isModalOpen, closeModal, setIsUpdate } = useContext(SidebarContext);
  const { setServiceId } = useToggleDrawer();
  const location = useLocation();

  const handleDelete = () => {
    if (location.pathname === "/products") {
      ProductServices.deleteProduct(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeModal();
      setServiceId();
    }

    if (location.pathname === "/category") {
      CategoryServices.deleteCategory(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeModal();
      setServiceId();
    }
    if (location.pathname === "/customers") {
      CustomerServices.deleteCustomer(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeModal();
      setServiceId();
    }

    if (location.pathname === "/coupons") {
      CouponServices.deleteCoupon(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeModal();
      setServiceId();
    }
    if (location.pathname === "/our-staff") {
      AdminServices.deleteStaff(id)
        .then((res) => {
          setIsUpdate(true);
          notifySuccess(res.message);
        })
        .catch((err) => notifyError(err.message));
      closeModal();
      setServiceId();
    }
  };

  return (
    <>
      <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent className="text-center px-8 pt-6 pb-4">
          <DialogHeader>
            <DialogTitle className="sr-only">Delete Confirmation</DialogTitle>
          </DialogHeader>
          <span className="flex justify-center text-3xl mb-6 text-red-500">
            <FiTrash2 />
          </span>
          <h2 className="text-xl font-medium mb-1">
            Are You Sure! Want to Delete{" "}
            <span className="text-red-500">{title}</span> Record?
          </h2>
          <p>
            Do you really want to delete these records? You can't view this in
            your list anymore if you delete!
          </p>
        </DialogContent>
        <DialogFooter className="justify-center">
          <Button
            className="w-full sm:w-auto hover:bg-white hover:border-gray-50"
            variant="outline"
            onClick={closeModal}
          >
            No, Keep It
          </Button>
          <Button onClick={handleDelete} className="w-full sm:w-auto">
            Yes, Delete It
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default React.memo(MainModal);
