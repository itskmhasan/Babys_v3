import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

//internal import
import { SidebarContext } from "@/context/SidebarContext";
import CurrencyServices from "@/services/CurrencyServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import { useAction } from "@/context/ActionContext";

const useCurrencySubmit = (id) => {
  const [status, setStatus] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setIsUpdate } = useContext(SidebarContext);
  const { openDrawer, closeDrawer } = useAction();

  // console.log(variants);

  const queryClient = useQueryClient();

  const {
    handleSubmit,
    register,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const onSubmit = async ({ symbol, name }) => {
    try {
      setIsSubmitting(true);
      const currencyData = {
        name: name,
        symbol: symbol,
        status: status ? "show" : "hide",
      };

      if (id) {
        const res = await CurrencyServices.updateCurrency(id, currencyData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
        // Invalidate query to trigger refetch
        queryClient.invalidateQueries(["currencies"]);
      } else {
        const res = await CurrencyServices.addCurrency(currencyData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
        // Invalidate query to trigger refetch
        queryClient.invalidateQueries(["currencies"]);
      }
    } catch (err) {
      setIsSubmitting(false);
      notifyError(err?.response?.data?.message || err?.message);
      closeDrawer();
    }
  };

  useEffect(() => {
    if (!id) {
      setValue("name");
      setValue("symbol");

      setStatus(true);
      clearErrors("symbol");
      clearErrors("name");

      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearErrors, id, openDrawer, setValue]);

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const res = await CurrencyServices.getCurrencyById(id);
          if (res) {
            setValue("name", res.name);
            setValue("symbol", res.symbol);
            setStatus(res.status === "show" ? true : false);
          }
        } catch (err) {
          notifyError(err?.response?.data?.message || err?.message);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return {
    errors,
    onSubmit,
    register,
    status,
    setStatus,
    isSubmitting,
    handleSubmit,
  };
};

export default useCurrencySubmit;
