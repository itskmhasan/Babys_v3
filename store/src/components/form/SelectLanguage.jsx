import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import React, { Fragment, useEffect, useState } from "react";

//internal imports

import { useLanguage } from "@context/LanguageContext";
const SelectLanguage = ({ data }) => {
  const { lang, setLang } = useLanguage();
  const [currentLang, setCurrentLang] = useState({});

  // handle change function
  const handleLanguage = (language) => {
    setLang(language.code); // Update language globally
  };

  // console.log("currentLang", currentLang, "data", data);

  //   console.log("lang", lang);

  // Sync UI with selected language
  useEffect(() => {
    const selectedLang = data?.find((lan) => lan?.code === lang);
    setCurrentLang(selectedLang);
  }, [data, lang]);

  return (
    <Menu as="div" className="relative">
      <MenuButton className="flex items-center justify-center mt-2">
        <span className="sr-only">Open user menu</span>

        <span className="text-sm font-medium leading-6 text-gray-900 hover:text-teal-600 flex gap-1">
          <div>{currentLang?.flag}</div>
          <span> {currentLang?.name}</span>
          &nbsp;<i className="fas fa-angle-down"></i>
        </span>
      </MenuButton>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <MenuItems className="absolute right-1 z-10 w-40 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
          {data?.map((language, index) => (
            <MenuItem
              key={language?.name + index + 1}
              className="px-6 py-1 hover:bg-gray-50 hover:text-teal-600"
            >
              <div className="w-full flex">
                <button
                  key={language?.name + index + 1}
                  onClick={() => handleLanguage(language)}
                  className="flex gap-4 justify-between px-3 py-0.5 text-sm leading-6 text-gray-900 hover:text-teal-600"
                >
                  <div>{language?.flag}</div>
                  <div>{language?.name}</div>
                </button>
              </div>
            </MenuItem>
          ))}
        </MenuItems>
      </Transition>
    </Menu>
  );
};

export default SelectLanguage;
