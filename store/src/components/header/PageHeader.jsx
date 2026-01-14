import React from "react";
import { cookies } from "next/headers";

//internal imports

const PageHeader = async ({ title, headerBg }) => {
  const cookiesStore = await cookies();
  const lang = cookiesStore.get("_lang")?.value;
  const showingTranslateValue = (data) => {
    const updatedData =
      data !== undefined && Object?.keys(data).includes(lang)
        ? data[lang]
        : data?.en;
    // console.log("lang:::", lang, "updatedData", updatedData);
    return updatedData;
  };

  return (
    <div
      style={{ backgroundImage: `url(${headerBg || "/page-header-bg.jpg"})` }}
      className={`flex justify-center py-10 lg:py-20 bg-indigo-100 w-full bg-cover bg-no-repeat bg-bottom`}
    >
      <div className="flex mx-auto w-full max-w-screen-2xl px-3 sm:px-10">
        <div className="w-full flex justify-center flex-col relative">
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-black text-center">
            {showingTranslateValue(title)}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
