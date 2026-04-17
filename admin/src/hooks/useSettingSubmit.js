import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

//internal import
import useDisableForDemo from "./useDisableForDemo";
import { SidebarContext } from "@/context/SidebarContext";
import SettingServices from "@/services/SettingServices";
import { notifyError, notifySuccess } from "@/utils/toast";

const useSettingSubmit = (id) => {
  const { setIsUpdate } = useContext(SidebarContext);
  const [isSave, setIsSave] = useState(true);
  const [enableInvoice, setEnableInvoice] = useState(false);
  const [enableGuestOrder, setEnableGuestOrder] = useState(false);
  const [healthcheckEnabled, setHealthcheckEnabled] = useState(true);
  const [isRunningHealthcheck, setIsRunningHealthcheck] = useState(false);
  const [healthcheckStatus, setHealthcheckStatus] = useState(null);
  const [isAllowAutoTranslation, setIsAllowAutoTranslation] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const { handleDisableForDemo } = useDisableForDemo();

  const {
    watch,
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // console.log("errors", errors);
  // console.log("enabledCOD", enabledCOD);

  const onSubmit = async (data) => {
    // console.log("data", data);
    if (handleDisableForDemo()) {
      return; // Exit the function if the feature is disabled
    }
    try {
      setIsSubmitting(true);
      const settingData = {
        name: "globalSetting",
        setting: {
          //for common setting
          number_of_image_per_product: data.number_of_image_per_product,
          shop_name: data.shop_name,
          address: data.address,
          company_name: data.company_name,
          vat_number: data.vat_number,
          post_code: data.post_code,
          contact: data.contact,
          email: data.email,
          website: data.website,
          receipt_size: data.receipt_size,
          default_language: data.default_language,
          default_currency: data.default_currency,
          default_time_zone: data.default_time_zone,
          default_date_format: data.default_date_format,
          email_to_customer: enableInvoice,
          from_email: data.from_email,
          allow_auto_trans: isAllowAutoTranslation,
          translation_key: data.translation_key,
          enable_guest_order: enableGuestOrder,
          healthcheck_enabled: healthcheckEnabled,
          healthcheck_time: data.healthcheck_time || "08:00",
          healthcheck_email_to: data.healthcheck_email_to || "",
        },
      };

      // console.log("global setting", settingData, "data", data);
      // return;

      if (!isSave) {
        const res = await SettingServices.updateGlobalSetting(settingData);

        if (res) {
          setIsUpdate(true);
          setIsSubmitting(false);

          window.location.reload();
          notifySuccess(res.message);
        }
      } else {
        const res = await SettingServices.addGlobalSetting(settingData);
        // await socket.emit("notification", {
        //   message: `Global setting added`,
        //   option: "globalSetting",
        // });
        setIsUpdate(true);
        setIsSubmitting(false);

        window.location.reload();
        notifySuccess(res.message);
      }
    } catch (err) {
      // console.log("err", err);
      notifyError(err?.response?.data?.message || err?.message);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const healthStatus = await SettingServices.getHealthcheckStatus();
        setHealthcheckStatus(healthStatus);

        const res = await SettingServices.getGlobalSetting();
        // console.log("res>>>", res);
        if (res) {
          setIsSave(false);
          setValue(
            "number_of_image_per_product",
            res.number_of_image_per_product
          );
          setValue("shop_name", res.shop_name);
          setValue("address", res.address);
          setValue("company_name", res.company_name);
          setValue("vat_number", res.vat_number);
          setValue("post_code", res.post_code);
          setValue("contact", res.contact);
          setValue("email", res.email);
          setValue("website", res.website);
          setValue("receipt_size", res.receipt_size);
          setValue("default_language", res.default_language);
          setValue("default_currency", res.default_currency);
          setValue("default_time_zone", res?.default_time_zone);
          setValue("default_date_format", res?.default_date_format);
          setValue("from_email", res?.from_email);
          setEnableInvoice(res?.email_to_customer || false);
          setValue("translation_key", res?.translation_key);
          setIsAllowAutoTranslation(res?.allow_auto_trans || false);
          setEnableGuestOrder(res?.enable_guest_order || false);
          setHealthcheckEnabled(res?.healthcheck_enabled ?? true);
          setValue("healthcheck_time", res?.healthcheck_time || "08:00");
          setValue("healthcheck_email_to", res?.healthcheck_email_to || "");
        }
      } catch (err) {
        notifyError(err?.response?.data?.message || err?.message);
      }
    })();
  }, []);

  const handleRunHealthcheckNow = async () => {
    try {
      if (handleDisableForDemo()) {
        return;
      }

      setIsRunningHealthcheck(true);
      const res = await SettingServices.runHealthcheckNow();
      notifySuccess(res?.message || "Healthcheck report sent successfully.");

      const updatedStatus = await SettingServices.getHealthcheckStatus();
      setHealthcheckStatus(updatedStatus);
    } catch (err) {
      notifyError(err?.response?.data?.message || err?.message);
    } finally {
      setIsRunningHealthcheck(false);
    }
  };

  return {
    watch,
    control,
    setValue,
    errors,
    register,
    isSave,
    isSubmitting,
    onSubmit,
    enableInvoice,
    setEnableInvoice,
    handleSubmit,
    enableGuestOrder,
    setEnableGuestOrder,
    healthcheckEnabled,
    setHealthcheckEnabled,
    healthcheckStatus,
    isRunningHealthcheck,
    handleRunHealthcheckNow,
    isAllowAutoTranslation,
    setIsAllowAutoTranslation,
  };
};

export default useSettingSubmit;
