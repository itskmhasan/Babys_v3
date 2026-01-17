"use client";

import React, { useEffect, useState } from "react";

//internal imports
import Coupon from "@components/coupon/Coupon";
import PageHeader from "@components/header/PageHeader";
import { baseURL, handleResponse } from "@services/CommonService";

const Offers = () => {
  const [setting, setSetting] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const response = await fetch(`${baseURL}/setting/store/customization`, {
          cache: "no-store",
        });
        const data = await handleResponse(response);
        setSetting(data);
      } catch (error) {
        console.error("Error fetching settings:", error);
        setSetting(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSetting();
  }, []);

  if (loading) {
    return (
      <div className="dark:bg-zinc-900 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dark:bg-zinc-900">
      <PageHeader
        headerBg={setting?.offers?.header_bg}
        title={setting?.offers?.title || "Offers"}
      />

      <div className="mx-auto max-w-screen-2xl px-4 py-10 lg:py-20 sm:px-10">
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
          <Coupon />
        </div>
      </div>
    </div>
  );
};

export default Offers;
