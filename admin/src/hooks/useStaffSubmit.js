import dayjs from "dayjs";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router";

//internal import
import AdminServices from "@/services/AdminServices";
import { AdminContext } from "@/context/AdminContext";
import { SidebarContext } from "@/context/SidebarContext";
import { notifyError, notifySuccess } from "@/utils/toast";
import useTranslationValue from "./useTranslationValue";
import { useAction } from "@/context/ActionContext";
import useDisableForDemo from "./useDisableForDemo";

const useStaffSubmit = (id) => {
  const { state, dispatch } = useContext(AdminContext);
  const { adminInfo } = state;
  const { setIsUpdate, lang } = useContext(SidebarContext);
  const { openDrawer, closeDrawer } = useAction();
  const [imageUrl, setImageUrl] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    dayjs(new Date()).format("YYYY-MM-DD")
  );
  const [language, setLanguage] = useState("en");
  const [resData, setResData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accessedRoutes, setAccessedRoutes] = useState([]);

  const location = useLocation();

  // console.log("adminInfo", adminInfo);

  const { handlerTextTranslateHandler } = useTranslationValue();
  const { handleDisableForDemo } = useDisableForDemo();

  const {
    control,
    register,
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      // if (resData?.email === "admin@gmail.com") {
      //   return notifyError("Updating Default admin disabled for demo!");
      // }
      if (handleDisableForDemo() && resData?.email === "admin@gmail.com") {
        return; // Exit the function if the feature is disabled
      }
      setIsSubmitting(true);

      const nameTranslates = await handlerTextTranslateHandler(
        data.name,
        language,
        resData?.name
      );

      const staffData = {
        name: {
          ...nameTranslates,
          [language]: data.name,
        },
        email: data.email,
        password: data.password,
        phone: data.phone,
        role: data.role,
        access_list: accessedRoutes?.map((list) => list.value),
        joiningDate: selectedDate
          ? selectedDate
          : dayjs(new Date()).format("YYYY-MM-DD"),
        image: imageUrl,
        lang: language,
      };

      // console.log("staffData", staffData);
      const isSameAdmin = adminInfo?._id === resData?._id;

      if (id) {
        // console.log('id is ',id)
        const res = await AdminServices.updateStaff(id, staffData);

        if (isSameAdmin) {
          dispatch({ type: "USER_LOGIN", payload: res });
          const cookieTimeOut = 0.5;
          Cookies.set("adminInfo", JSON.stringify(res), {
            expires: cookieTimeOut,
            sameSite: "None",
            secure: true,
          });
        }
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess("Staff Updated Successfully!");
        closeDrawer();
      } else {
        const res = await AdminServices.addStaff(staffData);
        setIsUpdate(true);
        setIsSubmitting(false);
        notifySuccess(res.message);
        closeDrawer();
      }
    } catch (err) {
      notifyError(err ? err?.response?.data?.message : err?.message);
      setIsSubmitting(false);
      closeDrawer();
    }
  };

  const getStaffData = async () => {
    try {
      const res = await AdminServices.getStaffById(id, {
        email: adminInfo.email,
      });

      // console.log("res", res);

      if (res) {
        setResData(res);
        setValue("name", res.name[language ? language : "en"]);
        setValue("email", res.email);
        setValue("password");
        setValue("phone", res.phone);
        setValue("role", res.role);
        setSelectedDate(dayjs(res.joiningData).format("YYYY-MM-DD"));
        setImageUrl(res.image);
        const result = res?.access_list?.map((list) => {
          const newObj = {
            label: list,
            value: list,
          };
          return newObj;
        });
        setAccessedRoutes(result);
      }
    } catch (err) {
      notifyError(err ? err?.response?.data?.message : err?.message);
    }
  };

  const handleSelectLanguage = (lang) => {
    setLanguage(lang);

    if (Object.keys(resData).length > 0) {
      setValue("name", resData.name[lang ? lang : "en"]);
    }
  };

  useEffect(() => {
    if (!id) {
      setResData({});
      setValue("name");
      setValue("email");
      setValue("password");
      setValue("phone");
      setValue("role");
      setValue("joiningDate");
      setImageUrl("");
      clearErrors("name");
      clearErrors("email");
      clearErrors("password");
      clearErrors("phone");
      clearErrors("role");
      clearErrors("joiningDate");
      setImageUrl("");
      setLanguage(lang);
      setValue("language", language);
      return;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setValue, id, openDrawer, adminInfo.email, clearErrors]);

  useEffect(() => {
    if (id) {
      getStaffData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (location.pathname === "/edit-profile" && Cookies.get("adminInfo")) {
      getStaffData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, setValue]);

  return {
    control,
    register,
    handleSubmit,
    onSubmit,
    language,
    errors,
    adminInfo,
    setImageUrl,
    imageUrl,
    selectedDate,
    setSelectedDate,
    isSubmitting,
    accessedRoutes,
    setAccessedRoutes,
    handleSelectLanguage,
  };
};

export default useStaffSubmit;
