"use client";

import { useRouter } from "next/navigation";
import { IoChevronForwardSharp } from "react-icons/io5";

//internal import

import useUtilsFunction from "@hooks/useUtilsFunction";

const CategoryNavigateButton = ({ category }) => {
  const router = useRouter();
  const { showingTranslateValue } = useUtilsFunction();

  // console.log("category", category);

  const handleCategoryClick = (id, categoryName) => {
    // console.log("handleCategoryClick", categoryName);

    const category_name = categoryName
      .toLowerCase()
      .replace(/[^A-Z0-9]+/gi, "-");
    const url = `/search?category=${category_name}&_id=${id}`;
    router.push(url);
  };

  return (
    <>
      <div className="pl-4">
        <h3
          onClick={() =>
            handleCategoryClick(
              category._id,
              showingTranslateValue(category?.name)
            )
          }
          className="text-sm text-gray-600 dark:text-gray-300 hover:text-orange-400 font-medium leading-tight line-clamp-1  group-hover"
        >
          {showingTranslateValue(category?.name)}
        </h3>
        <ul className="pt-1 mt-1">
          {category?.children?.slice(0, 3).map((child) => (
            <li key={child._id} className="pt-1">
              <a
                onClick={() =>
                  handleCategoryClick(
                    child._id,
                    showingTranslateValue(child?.name)
                  )
                }
                className="flex hover:translate-x-2 transition-transform duration-300 items-center  text-xs text-gray-400 cursor-pointer"
              >
                <span className="text-xs text-gray-400 ">
                  <IoChevronForwardSharp />
                </span>
                {showingTranslateValue(child?.name)}
                {/* {console.log(
                  "showingTranslateValue(child?.name)",
                  showingTranslateValue(child?.name),
                  child?.name
                )} */}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default CategoryNavigateButton;
