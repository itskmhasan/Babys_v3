"use client";

import { Fragment } from "react";
import Link from "next/link";
import { Transition, Menu, MenuButton } from "@headlessui/react";
import { FiUser } from "react-icons/fi";
import Image from "next/image";

//internal imports
import { userNavigation } from "@utils/data";
import { getUserSession } from "@lib/auth-client";

const ProfileDropDown = () => {
  const userInfo = getUserSession();
  // console.log("session", userInfo);

  return (
    <>
      <Menu as="div" className="relative">
        {userInfo?.email ? (
          <MenuButton className="-m-1.5 flex items-center p-1.5">
            <span className="sr-only">Open user menu</span>

            {userInfo?.image ? (
              <Image
                src={userInfo.image}
                width={32}
                height={32}
                className="h-8 w-8 rounded-full bg-gray-50"
                alt={userInfo?.name[0]}
              />
            ) : (
              <div className="flex items-center justify-center h-8 w-8 rounded-full dark:bg-zinc-700 bg-gray-200 text-xl font-bold text-center mr-4">
                {userInfo?.name?.charAt(0)}
              </div>
            )}
          </MenuButton>
        ) : (
          <Link
            href="/auth/login"
            // onClick={() => setOpenLoginModal(!openLoginModal)}
            className="-m-1.5 flex items-center p-1.5"
          >
            <span className="sr-only">Open user menu</span>

            <FiUser className="h-6 w-6 text-white" aria-hidden="true" />
          </Link>
        )}

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-10 mt-2.5 w-60 origin-top-right rounded-md dark:bg-zinc-900 dark:text-white bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
            {userNavigation.map((item) => (
              <Menu.Item
                key={item.name}
                className="px-6 py-1 dark:hover:bg-zinc-800 hover:bg-gray-50 hover:text-teal-600"
              >
                <div className="w-full flex">
                  <item.icon className="my-auto" />
                  <Link
                    href={item.href}
                    className="block px-3 py-1 text-sm leading-6 dark:text-white text-gray-900 hover:text-teal-600"
                  >
                    {item.name}
                  </Link>
                </div>
              </Menu.Item>
            ))}

            {/* <Menu.Item className="px-6 py-1 hover:bg-gray-50 hover:text-teal-600">
              <div className="w-full flex">
                <IoLockOpenOutline className="my-auto" />
                <form action="">
                  <button
                    onClick={handleLogOut}
                    // href={item.href}
                    className="block px-3 py-1 text-sm leading-6 text-gray-900 hover:text-teal-600"
                  >
                    Logout
                  </button>
                </form>
              </div>
            </Menu.Item> */}
          </Menu.Items>
        </Transition>
      </Menu>
    </>
  );
};

export default ProfileDropDown;
