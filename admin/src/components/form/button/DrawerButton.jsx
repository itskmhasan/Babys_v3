import React, { useContext } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

//internal import

import spinnerLoadingImage from "@/assets/img/spinner.gif";
import { useAction } from "@/context/ActionContext";

const DrawerButton = ({ id, title, isSubmitting, zIndex = "z-10" }) => {
  const { t } = useTranslation();

  const { openDrawer, toggleDrawer } = useAction();
  return (
    <>
      <div
        className={`fixed ${zIndex} bottom-0 w-full right-0 py-3 sm:py-4 lg:py-6 px-4 sm:px-6 bg-gray-50 border-t border-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300`}
      >
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 max-w-7xl mx-auto">
          {/* Cancel Button */}
          <div className="w-full sm:flex-1">
            <Button
              onClick={toggleDrawer}
              variant="outline"
              className="w-full h-10 sm:h-11"
            >
              {t("CancelBtn")}
            </Button>
          </div>

          {/* Submit/Update Button */}
          <div className="w-full sm:flex-1">
            {isSubmitting ? (
              <Button
                disabled={true}
                type="button"
                className="w-full h-10 sm:h-11"
              >
                <img
                  src={spinnerLoadingImage}
                  alt="Loading"
                  width={20}
                  height={10}
                  className="mr-2"
                />
                <span className="font-serif font-light">Processing</span>
              </Button>
            ) : (
              <Button type="submit" className="w-full h-10 sm:h-11">
                {id ? (
                  <span>
                    {t("UpdateBtn")} {title}
                  </span>
                ) : (
                  <span>Add {title}</span>
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DrawerButton;
