import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import parse from "html-react-parser";
import { cookies } from "next/headers";

const CMSkeleton = async ({
  html,
  count,
  height,
  color,
  loading,
  error,
  data,
  highlightColor,
}) => {
  const cookiesStore = await cookies();
  const lang = cookiesStore.get("_lang")?.value;
  const showingTranslateValue = (data) => {
    const updatedData =
      data !== undefined && Object?.keys(data).includes(lang)
        ? data[lang]
        : data?.en;
    return updatedData;
  };

  return (
    <>
      {loading ? (
        <Skeleton
          count={count || 6}
          height={height || 25}
          // className="bg-gray-200"
          baseColor={color || "#f1f5f9"}
          highlightColor={highlightColor || "#cbd5e1"}
        />
      ) : error ? (
        <span className="text-center mx-auto text-red-500">{error}</span>
      ) : data ? (
        html ? (
          parse(showingTranslateValue(data))
        ) : (
          showingTranslateValue(data)
        )
      ) : null}
    </>
  );
};

export default CMSkeleton;
