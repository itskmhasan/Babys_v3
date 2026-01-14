"use client";

import { Fragment } from "react";
import Link from "next/link";
import { Transition, Menu } from "@headlessui/react";
import { FiChevronDown } from "react-icons/fi";

//internal imports
import { pages } from "@utils/data";

const PagesDropDown = () => {
  return (
    <Menu as="div" className="relative mt-3.5">
      <Menu.Button className="flex items-center p-1.5">
        <span className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-800 dark:hover:text-white">
          Pages
        </span>
        <FiChevronDown
          className="ml-1 h-3 w-3 group-hover:text-emerald-600"
          aria-hidden="true"
        />
      </Menu.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2.5 w-60 origin-top-right rounded-md bg-white dark:bg-zinc-900 py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
          {pages.map((item) => (
            <Menu.Item
              key={item.title}
              className="px-6 py-1 hover:bg-gray-50 hover:text-teal-600 dark:hover:bg-black dark:hover:text-white"
            >
              <div className="w-full flex">
                <item.icon className="my-auto dark:text-gray-300" />
                <Link
                  href={item.href}
                  className="block px-3 py-1 text-sm leading-6 text-gray-900 dark:text-gray-300 hover:text-teal-600 dark:hover:text-white"
                >
                  {item.title}
                </Link>
              </div>
            </Menu.Item>
          ))}
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default PagesDropDown;
