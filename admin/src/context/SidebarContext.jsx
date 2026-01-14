import LanguageServices from "@/services/LanguageServices";
import SettingServices from "@/services/SettingServices";
import { useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { createContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

// create context
export const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
  const resultsPerPage = 20;
  const searchRef = useRef("");
  const invoiceRef = useRef("");
  // const dispatch = useDispatch();

  const [limitData, setLimitData] = useState(20);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isBulkDrawerOpen, setIsBulkDrawerOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [lang, setLang] = useState("en");
  const [currLang, setCurrLang] = useState({
    code: "en",
    name: "English",
    flag: "🇬🇧",
  });
  const [time, setTime] = useState("");
  const [sortedField, setSortedField] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchText, setSearchText] = useState(null);
  const [invoice, setInvoice] = useState(null);
  const [zone, setZone] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [method, setMethod] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [windowDimension, setWindowDimension] = useState(window.innerWidth);
  const [loading, setLoading] = useState(false);
  const [navBar, setNavBar] = useState(true);
  const { i18n } = useTranslation();
  const [tabIndex, setTabIndex] = useState(0);

  const currLan = Cookies.get("_currLang");
  const pathname = window?.location.pathname === "/login";

  const { data: globalSetting } = useQuery({
    queryKey: ["globalSetting"],
    queryFn: () => SettingServices.getGlobalSetting(),
    staleTime: 20 * 60 * 1000, // Cache for 20 minutes
    gcTime: 25 * 60 * 1000, // Keep data in memory
  });

  const { data: languages } = useQuery({
    queryKey: ["languages"],
    queryFn: () => LanguageServices.getShowingLanguage(),
    staleTime: 20 * 60 * 1000, // Cache for 20 minutes
    gcTime: 25 * 60 * 1000,
    enabled: !pathname && !currLan,
  });

  const closeSidebar = () => setIsSidebarOpen(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const closeBulkDrawer = () => setIsBulkDrawerOpen(false);
  const toggleBulkDrawer = () => setIsBulkDrawerOpen(!isBulkDrawerOpen);

  const closeModal = () => setIsModalOpen(false);
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const handleLanguageChange = (value) => {
    // console.log("handleChangeLang", value);

    Cookies.set("i18next", value?.code, {
      sameSite: "None",
      secure: true, // Include the "secure" attribute
    });
    i18n.changeLanguage(value?.code);
    setLang(value?.code);
    Cookies.set("_currLang", JSON.stringify(value), {
      sameSite: "None",
      secure: true, // Include the "secure" attribute
    });
    setCurrLang(value);
  };

  const handleChangePage = (p) => {
    setCurrentPage(p);
  };

  const handleSubmitForAll = (e) => {
    e.preventDefault();
    if (!searchRef?.current?.value) return setSearchText(null);
    setSearchText(searchRef?.current?.value);
    setCategory(null);
  };

  // console.log("globalSetting", globalSetting, "languages", languages);

  useEffect(() => {
    // if (pathname) return;
    const defaultLang = globalSetting?.default_language || "en";
    const cookieLang = Cookies.get("i18next");

    const removeRegion = (langCode) => langCode?.split("-")[0];

    let selectedLang = removeRegion(cookieLang || defaultLang);

    // Ensure language consistency with global settings
    if (globalSetting?.default_language) {
      selectedLang = removeRegion(globalSetting.default_language);
    }

    // Update state with selected language
    setLang(selectedLang);

    // Set i18next language & update cookies **only when needed**
    if (!cookieLang || cookieLang !== selectedLang) {
      Cookies.set("i18next", selectedLang, {
        sameSite: "None",
        secure: true,
      });
    }

    // console.log("currLan", !currLan, "selectedLang", selectedLang);

    // Change i18n language **only if it differs**
    if (i18n.language !== selectedLang && !currLan) {
      i18n.changeLanguage(selectedLang);
    }

    // Find the corresponding language object
    if (languages?.length && !pathname && !currLan) {
      const result = languages?.find((lang) => lang?.code === selectedLang);
      setCurrLang(result);
    }
  }, [globalSetting?.default_language, languages]); // Add `languages` as a dependency

  useEffect(() => {
    function handleResize() {
      setWindowDimension(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        method,
        setMethod,
        isSidebarOpen,
        toggleSidebar,
        closeSidebar,
        closeBulkDrawer,
        isBulkDrawerOpen,
        toggleBulkDrawer,
        isModalOpen,
        toggleModal,
        closeModal,
        isUpdate,
        setIsUpdate,
        lang,
        setLang,
        currLang,
        handleLanguageChange,
        currentPage,
        setCurrentPage,
        handleChangePage,
        searchText,
        setSearchText,
        category,
        setCategory,
        searchRef,
        handleSubmitForAll,
        status,
        setStatus,
        zone,
        setZone,
        time,
        setTime,
        sortedField,
        setSortedField,
        resultsPerPage,
        limitData,
        setLimitData,
        windowDimension,
        modalOpen,
        setModalOpen,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        loading,
        setLoading,
        invoice,
        setInvoice,
        invoiceRef,
        setNavBar,
        navBar,
        tabIndex,
        setTabIndex,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
