import Switch from "react-switch";
import { useTranslation } from "react-i18next";

const SwitchToggleForCombination = ({
  title,
  product,
  handleProcess,
  processOption,
}) => {
  // console.log('processOption',processOption)
  const { t } = useTranslation();
  return (
    <>
      <div
        className={`${
          product ? "mb-1 flex justify-end items-center mr-3" : "mb-3"
        }`}
        style={{
          height: product ? 20 : 0,
          transition: "all 0.3s",
          visibility: product ? "visible" : "hidden",
          opacity: product ? "1" : "0",
        }}
      >
        <div className="flex items-center">
          {product ? (
            <label className="hidden md:block text-sm font-normal text-orange-500 dark:text-orange-400 mx-4">
              {t("ThisProductHaveVariants")}
            </label>
          ) : (
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
              {title}
            </label>
          )}

          <Switch
            onChange={handleProcess}
            checked={processOption}
            className="react-switch md:ml-0 ml-3"
            uncheckedIcon={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  fontSize: 14,
                  color: "white",
                  paddingRight: 5,
                  paddingTop: 1,
                }}
              >
                No
              </div>
            }
            width={60}
            height={25}
            handleDiameter={22}
            offColor="#E53E3E"
            onColor="#2F855A"
            checkedIcon={
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  fontSize: 14,
                  color: "white",
                  paddingLeft: 8,
                  paddingTop: 1,
                }}
              >
                Yes
              </div>
            }
          />
        </div>
      </div>
    </>
  );
};

export default SwitchToggleForCombination;
