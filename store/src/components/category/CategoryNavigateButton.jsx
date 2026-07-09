"use client";

import { useRouter } from "next/navigation";
import { IoChevronForwardSharp } from "react-icons/io5";

//internal import

import useUtilsFunction from "@hooks/useUtilsFunction";
import { slugifyCategoryName } from "@utils/categorySlug";

const CategoryNavigateButton = ({ category }) => {
  const router = useRouter();
  const { showingTranslateValue } = useUtilsFunction();

  // console.log("category", category);

  const handleCategoryClick = (categoryName) => {
    // console.log("handleCategoryClick", categoryName);

    const category_name = slugifyCategoryName(categoryName);
    if (!category_name) return;

    router.push(`/${category_name}`);
  };

  return (
    <>
      <div className="pl-4">
        <h3
          onClick={() =>
            handleCategoryClick(showingTranslateValue(category?.name))
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
                  handleCategoryClick(showingTranslateValue(child?.name))
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
