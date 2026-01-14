//internal import
import Coupon from "@components/coupon/Coupon";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { getStoreCustomizationSetting } from "@services/SettingServices";

const OfferCard = async () => {
  const { showingTranslateValue } = useUtilsFunction();
  const { storeCustomizationSetting, error } =
    await getStoreCustomizationSetting();

  return (
    <div className="w-full group dark:bg-zinc-900">
      <div className="bg-gray-50 dark:bg-slate-600 h-full border-2 border-orange-500 transition duration-150 ease-linear transform group-hover:border-emerald-500 rounded shadow">
        <div className="bg-orange-100 dark:bg-slate-600 dark:text-gray-200 text-gray-900 px-6 py-2 rounded-t border-b flex items-center justify-center">
          <h3 className="text-base font-medium ">
            {showingTranslateValue(
              storeCustomizationSetting?.home?.discount_title
            )}
          </h3>
        </div>
        <div className="overflow-hidden dark:bg-zinc-900">
          <Coupon couponInHome />
        </div>
      </div>
    </div>
  );
};

export default OfferCard;
