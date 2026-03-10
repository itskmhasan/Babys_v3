"use client";

import { Fragment, useContext } from "react";
import Link from "next/link";
import {
  Transition,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";

//internal import
import Category from "@components/category/Category";
import { SidebarContext } from "@context/SidebarContext";
import useUtilsFunction from "@hooks/useUtilsFunction";
import SelectLanguage from "@components/form/SelectLanguage";
import {
  AlertCircle,
  ChevronDownIcon,
  File,
  FolderLock,
  Gift,
  HelpCircle,
  Heart,
  Activity,
  PhoneIncoming,
  ShoppingBag,
  User,
} from "lucide-react";
import { useSetting } from "@context/SettingContext";

const NavbarPromo = ({ languages, categories, categoryError }) => {
  const { isLoading, setIsLoading } = useContext(SidebarContext);
  const { storeCustomization } = useSetting();

  const { showingTranslateValue } = useUtilsFunction();
  const navbar = storeCustomization?.navbar;

  return (
    <>
      <div className="hidden lg:block xl:block bg-white border-b">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-10 h-12 flex justify-between items-center">
          <div className="inline-flex">
            <Popover className="relative">
              <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center md:justify-start md:space-x-10">
                  <Popover as="nav" className="md:flex space-x-10 items-center">
                    {navbar?.categories_menu_status && (
                      <Popover className="relative ">
                        <PopoverButton className="group inline-flex items-center py-2 primary-hover focus:outline-none">
                          <span className=" text-sm font-medium">
                            {showingTranslateValue(navbar?.categories)}
                          </span>

                          <ChevronDownIcon
                            className="ml-1 h-3 w-3 group-primary-hover"
                            aria-hidden="true"
                          />
                        </PopoverButton>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="opacity-0 translate-y-1"
                          enterTo="opacity-100 translate-y-0"
                          leave="transition ease-in duration-150"
                          leaveFrom="opacity-100 translate-y-0"
                          leaveTo="opacity-0 translate-y-1"
                        >
                          <PopoverPanel className="absolute z-10 -ml-1 mt-1 transform w-screen max-w-xs c-h-65vh bg-white">
                            <div className="rounded-md shadow-lg  overflow-y-scroll flex-grow scrollbar-hide w-full h-full">
                              <Category
                                categories={categories}
                                categoryError={categoryError}
                              />
                            </div>
                          </PopoverPanel>
                        </Transition>
                      </Popover>
                    )}
                    <Link
                      onClick={() => setIsLoading(!isLoading)}
                      href="/shop"
                      className="mx-2 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-bold rounded-lg transition transform hover:scale-105 shadow-md"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Shop
                    </Link>

                    <Link
                      onClick={() => setIsLoading(!isLoading)}
                      href="/pregnancy-calculator"
                      className="mx-2 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-sm font-bold rounded-lg transition transform hover:scale-105 shadow-md"
                    >
                      <Heart className="w-4 h-4 fill-current" />
                      Pregnancy Calculator
                    </Link>

                    <Link
                      onClick={() => setIsLoading(!isLoading)}
                      href="/bmi-calculator"
                      className="mx-2 inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white text-sm font-bold rounded-lg transition transform hover:scale-105 shadow-md"
                    >
                      <Activity className="w-4 h-4" />
                      BMI Calculator
                    </Link>

                  </Popover>
                </div>
              </div>
            </Popover>
          </div>
          <div className="flex">
            <SelectLanguage data={languages} />

            {navbar?.privacy_policy_status && (
              <Link
                onClick={() => setIsLoading(!isLoading)}
                href="/privacy-policy"
                className=" mx-4 py-2 text-sm font-medium hover:text-emerald-600"
              >
                {showingTranslateValue(navbar?.privacy_policy)}
              </Link>
            )}
            {navbar?.term_and_condition_status && (
              <Link
                onClick={() => setIsLoading(!isLoading)}
                href="/terms-and-conditions"
                className=" mx-4 py-2 text-sm font-medium hover:text-emerald-600"
              >
                {showingTranslateValue(navbar?.term_and_condition)}
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarPromo;
