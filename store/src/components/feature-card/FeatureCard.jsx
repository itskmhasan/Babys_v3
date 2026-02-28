import React from "react";
import { FiCreditCard, FiGift, FiPhoneCall, FiTruck } from "react-icons/fi";

//internal import

import useUtilsFunction from "@hooks/useUtilsFunction";

const FeatureCard = async ({ storeCustomizationSetting }) => {
  const { showingTranslateValue } = useUtilsFunction();
  const footer = storeCustomizationSetting?.footer;

  const featurePromo = [
    {
      id: 1,
      title: showingTranslateValue(footer?.shipping_card),
      icon: FiTruck,
      cardClass: "bg-rose-50 border-rose-100",
      iconClass: "text-rose-500",
    },
    {
      id: 2,
      title: showingTranslateValue(footer?.support_card),
      icon: FiPhoneCall,
      cardClass: "bg-sky-50 border-sky-100",
      iconClass: "text-sky-500",
    },
    {
      id: 3,
      title: showingTranslateValue(footer?.payment_card),
      icon: FiCreditCard,
      cardClass: "bg-emerald-50 border-emerald-100",
      iconClass: "text-emerald-500",
    },
    {
      id: 4,
      title: showingTranslateValue(footer?.offer_card),
      icon: FiGift,
      cardClass: "bg-violet-50 border-violet-100",
      iconClass: "text-violet-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mx-auto">
      {featurePromo.map((promo) => (
        <div
          key={promo.id}
          className={`rounded-xl border px-4 py-4 flex items-center gap-3 ${promo.cardClass}`}
        >
          <div className="w-9 h-9 rounded-lg bg-white/80 flex items-center justify-center shadow-sm">
            <promo.icon
              className={`flex-shrink-0 h-5 w-5 ${promo.iconClass}`}
              aria-hidden="true"
            />
          </div>
          <div className="min-w-0">
            <span className="block text-sm font-semibold leading-5 text-gray-800">
              {promo?.title}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FeatureCard;
