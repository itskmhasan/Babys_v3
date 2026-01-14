import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";

//internal import
import { SidebarContext } from "@/context/SidebarContext";
import LanguageServices from "@/services/LanguageServices";
import { notifyError, notifySuccess } from "@/utils/toast";
import { useAction } from "@/context/ActionContext";

const useLanguageSubmit = (id) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { setIsUpdate } = useContext(SidebarContext);
  const { openDrawer, closeDrawer } = useAction();

  const queryClient = useQueryClient();
  const form = useForm({
    defaultValues: {
      name: "",
      code: "",
      flag: "",
      status: true,
    },
  });

  const {
    control,
    register,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = form;

  const onSubmit = async ({ name, code, flag, status }) => {
    // console.log(name, code, language_code)
    // return notifyError("This option disabled for this option!");

    // console.log("onSubmit", status);

    try {
      setIsSubmitting(true);
      const languageData = {
        name,
        code,
        flag,
        status: status ? "show" : "hide",
      };

      if (id) {
        const res = await LanguageServices.updateLanguage(id, languageData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);

        closeDrawer();
        // Invalidate query to trigger refetch
        queryClient.invalidateQueries(["languages"]);
      } else {
        const res = await LanguageServices.addLanguage(languageData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);

        closeDrawer();
        // Invalidate query to trigger refetch
        queryClient.invalidateQueries(["languages"]);
      }
    } catch (err) {
      notifyError(err ? err?.response?.data?.message : err?.message);
      closeDrawer();
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!id) {
      setValue("name");
      setValue("code");
      setValue("flag");
      clearErrors("name");
      clearErrors("code");
      clearErrors("flag");
      clearErrors("status");
      return;
    }
  }, [id, setValue, openDrawer, clearErrors]);

  useEffect(() => {
    if (id) {
      (async () => {
        try {
          const res = await LanguageServices.getLanguageById(id);
          // console.log("res", res);

          if (res) {
            setValue("name", res.name);
            setValue("code", res.code);
            setValue("flag", res.flag);
            setValue("status", res.status === "show" ? true : false);
          }
        } catch (err) {
          notifyError(err ? err?.response?.data?.message : err?.message);
        }
      })();
    }
  }, [id]);

  return {
    form,
    control,
    onSubmit,
    register,
    errors,
    setValue,
    handleSubmit,
    isSubmitting,
  };
};

export default useLanguageSubmit;
