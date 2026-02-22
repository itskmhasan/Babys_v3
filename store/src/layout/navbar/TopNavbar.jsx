import React from "react";
import Link from "next/link";
import { FiPhoneCall } from "react-icons/fi";

//internal imports
import LogoutButton from "./LogoutButton";
import { showingTranslateValue } from "@lib/translate";

const TopNavbar = async ({ storeCustomization }) => {
  const navbar = storeCustomization?.navbar;
  // console.log("storeCustomization", storeCustomization);

  return (
    <div className="hidden lg:block bg-gray-100">
      <div className="max-w-screen-2xl mx-auto px-3 sm:px-10">
        <div className="text-gray-700 py-2 font-sans text-xs font-medium flex justify-between items-center">
          <span className="flex items-center">
            <FiPhoneCall className="mr-2" />
            {showingTranslateValue(navbar?.help_text)}
            <a
              href={`tel:${navbar?.phone_number || "+8801973404971"}`}
              className="font-bold primary-text ml-1"
            >
              {navbar?.phone_number || "+8801973404971"}
            </a>
          </span>

          <div className="lg:text-right flex items-center navBar">
            {navbar?.about_menu_status && (
              <div>
                <Link
                  href="/about-us"
                  className="font-medium primary-hover"
                >
                  {showingTranslateValue(navbar?.about_us)}
                </Link>
                <span className="mx-2">|</span>
              </div>
            )}
            {navbar?.contact_menu_status && (
              <div>
                <Link
                  href="/contact-us"
                  className="font-medium primary-hover"
                >
                  {showingTranslateValue(navbar?.contact_us)}
                </Link>
                <span className="mx-2">|</span>
              </div>
            )}

            <LogoutButton storeCustomization={storeCustomization} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopNavbar;
