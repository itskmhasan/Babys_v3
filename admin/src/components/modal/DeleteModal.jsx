import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import React, { useContext } from "react";
import { FiTrash2 } from "react-icons/fi";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

//internal import
import spinnerLoadingImage from "@/assets/img/spinner.gif";
import { SidebarContext } from "@/context/SidebarContext";
import AdminServices from "@/services/AdminServices";
import CategoryServices from "@/services/CategoryServices";
import CouponServices from "@/services/CouponServices";
import CustomerServices from "@/services/CustomerServices";
import LanguageServices from "@/services/LanguageServices";
import ProductServices from "@/services/ProductServices";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import AttributeServices from "@/services/AttributeServices";
import CurrencyServices from "@/services/CurrencyServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import useDisableForDemo from "@/hooks/useDisableForDemo";
import { useAction } from "@/context/ActionContext";

const DeleteModal = ({
  id,
  ids,
  open,
  title,
  category,
  useParamId,
  onOpenChange,
}) => {
  const { setSelectedId, setSelectedIds } = useAction();
  const { setIsUpdate } = useContext(SidebarContext);

  const location = useLocation();
  const { t } = useTranslation();

  const queryClient = useQueryClient();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { handleDisableForDemo } = useDisableForDemo();

  const handleDelete = async () => {
    if (handleDisableForDemo()) {
      return; // Exit the function if the feature is disabled
    }
    try {
      setIsSubmitting(true);
      if (location.pathname === "/products") {
        if (ids) {
          const res = await ProductServices.deleteManyProducts({
            ids: ids,
          });
          handleSuccess(res);
          // Invalidate query to trigger refetch
          queryClient.invalidateQueries(["products"]);
        } else {
          const res = await ProductServices.deleteProduct(id);
          handleSuccess(res);
          // Invalidate query to trigger refetch
          queryClient.invalidateQueries(["products"]);
        }
      }

      if (location.pathname === "/coupons") {
        if (ids) {
          console.log("will need to delete multiple", ids);

          const res = await CouponServices.deleteManyCoupons({
            ids: ids,
          });
          handleSuccess(res);
          // Invalidate query to trigger refetch
          queryClient.invalidateQueries(["coupons"]);
        } else {
          console.log("will need to delete single");

          const res = await CouponServices.deleteCoupon(id);
          handleSuccess(res);
          // Invalidate query to trigger refetch
          queryClient.invalidateQueries(["coupons"]);
        }
      }

      if (location.pathname === "/categories" || category) {
        if (ids) {
          //  console.log('delete modal categorices',ids)
          const res = await CategoryServices.deleteManyCategory({
            ids: ids,
          });
          //  console.log('delete many category res',res)
          handleSuccess(res);
          // Invalidate query to trigger refetch
          queryClient.invalidateQueries(["categories"]);
        } else {
          if (id === undefined || !id) {
            notifyError("Please select a category first!");
            setIsSubmitting(false);
            return onOpenChange();
          }
          // console.log('delete modal open',id)
          const res = await CategoryServices.deleteCategory(id);
          handleSuccess(res);
          // Invalidate query to trigger refetch
          queryClient.invalidateQueries(["categories"]);
        }
      } else if (
        location.pathname === `/categories/${useParamId}` ||
        category
      ) {
        // console.log('delete modal ')
        if (id === undefined || !id) {
          notifyError("Please select a category first!");
          setIsSubmitting(false);
          return onOpenChange();
        }

        const res = await CategoryServices.deleteCategory(id);
        handleSuccess(res);
        // Invalidate query to trigger refetch
        queryClient.invalidateQueries(["categories"]);
      }

      if (location.pathname === "/customers") {
        const res = await CustomerServices.deleteCustomer(id);
        handleSuccess(res);
        // Invalidate query to trigger refetch
        queryClient.invalidateQueries(["customers"]);
      }

      if (location.pathname === "/attributes") {
        if (ids) {
          const res = await AttributeServices.deleteManyAttribute({
            ids: ids,
          });
          handleSuccess(res);
          // Invalidate query to trigger refetch
          queryClient.invalidateQueries(["attributes"]);
        } else {
          const res = await AttributeServices.deleteAttribute(id);
          handleSuccess(res);
          // Invalidate query to trigger refetch
          queryClient.invalidateQueries(["attributes"]);
        }
      }

      if (
        location.pathname === `/attributes/${location.pathname.split("/")[2]}`
      ) {
        if (ids) {
          const res = await AttributeServices.deleteManyChildAttribute({
            id: location.pathname.split("/")[2],
            ids: ids,
          });
          handleSuccess(res);
          // Invalidate query to trigger refetch
          queryClient.invalidateQueries(["attribute"]);
        } else {
          // console.log("att value delete", id, location.pathname.split("/")[2]);

          const res = await AttributeServices.deleteChildAttribute({
            id: id,
            ids: location.pathname.split("/")[2],
          });
          handleSuccess(res);
          // Invalidate query to trigger refetch
          queryClient.invalidateQueries(["attribute"]);
        }
      }

      if (location.pathname === "/our-staff") {
        const res = await AdminServices.deleteStaff(id);
        handleSuccess(res);
        // Invalidate query to trigger refetch
        queryClient.invalidateQueries(["our-staff"]);
      }

      if (location.pathname === "/languages") {
        if (ids) {
          const res = await LanguageServices.deleteManyLanguage({
            ids: ids,
          });
          handleSuccess(res);
          // Invalidate query to trigger refetch
          queryClient.invalidateQueries(["languages"]);
        } else {
          const res = await LanguageServices.deleteLanguage(id);
          handleSuccess(res);
          // Invalidate query to trigger refetch
          queryClient.invalidateQueries(["languages"]);
        }
      }

      if (location.pathname === "/currencies") {
        if (ids) {
          const res = await CurrencyServices.deleteManyCurrency({
            ids: ids,
          });
          handleSuccess(res);
          // Invalidate query to trigger refetch
          queryClient.invalidateQueries(["currencies"]);
        } else {
          const res = await CurrencyServices.deleteCurrency(id);
          handleSuccess(res);
          // Invalidate query to trigger refetch
          queryClient.invalidateQueries(["currencies"]);
        }
      }
    } catch (err) {
      notifyError(err ? err?.response?.data?.message : err?.message);

      setSelectedIds([]);
      onOpenChange();
      setIsSubmitting(false);
    }
  };

  const handleSuccess = (res) => {
    setIsUpdate(true);
    notifySuccess(res.message);
    setSelectedIds([]);
    setSelectedId();
    onOpenChange();
    setIsSubmitting(false);
  };
  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="text-center">
        <DialogHeader>
          <DialogTitle className="sr-only">Delete Confirmation</DialogTitle>
        </DialogHeader>
        <span className="flex justify-center text-3xl mb-6 text-red-500">
          <FiTrash2 />
        </span>
        {/* <h2 className="text-xl font-medium mb-1">{t('DeleteModalH2')}</h2> */}
        <h2 className="text-lg font-medium mb-2">
          {t("DeleteModalH2")} <span className="text-red-500">{title}</span>?
        </h2>
        <p className="text-sm">{t("DeleteModalPtag")}</p>
        <DialogFooter>
          <Button variant="outline" onClick={onOpenChange}>
            {t("modalKeepBtn")}
          </Button>
          <div className="flex justify-end">
            {isSubmitting ? (
              <Button disabled={true} type="button">
                <img
                  src={spinnerLoadingImage}
                  alt="Loading"
                  width={20}
                  height={10}
                />{" "}
                <span className="font-serif ml-2 font-light">
                  {t("Processing")}
                </span>
              </Button>
            ) : (
              <Button onClick={handleDelete} variant="delete">
                {t("modalDeletBtn")}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(DeleteModal);
