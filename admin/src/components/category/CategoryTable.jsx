import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import { IoRemoveSharp } from "react-icons/io5";

//internal import

import CheckBox from "@/components/form/others/CheckBox";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import ShowHideButton from "@/components/table/ShowHideButton";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import { useAction } from "@/context/ActionContext";

const CategoryTable = ({ categories, showChild }) => {
  const { handleModalOpen, handleUpdate } = useToggleDrawer();
  const { showingTranslateValue } = useUtilsFunction();
  const { handleSelect, selectedIds } = useAction();

  return (
    <>
      <TableBody>
        {categories?.map((category) => (
          <TableRow key={category._id}>
            <TableCell>
              <CheckBox
                type="checkbox"
                name="category"
                id={category._id}
                handleSelect={handleSelect}
                isChecked={selectedIds?.includes(category._id)}
              />
            </TableCell>

            <TableCell className="font-semibold uppercase text-xs">
              {category?._id?.substring(20, 24)}
            </TableCell>
            <TableCell>
              {category?.icon ? (
                <Avatar className="hidden mr-3 md:block bg-gray-50 p-1">
                  <AvatarImage src={category?.icon} alt={category?.parent} />
                  <AvatarFallback>C</AvatarFallback>
                </Avatar>
              ) : (
                <Avatar className="hidden p-1 mr-2 md:block bg-gray-50 shadow-none">
                  <AvatarImage
                    src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                    alt="product"
                  />
                  <AvatarFallback>C</AvatarFallback>
                </Avatar>
              )}
            </TableCell>

            <TableCell className="font-medium text-sm ">
              {category?.children.length > 0 ? (
                <Link
                  to={`/categories/${category?._id}`}
                  className="text-gray-700 dark:text-gray-300"
                >
                  {showingTranslateValue(category?.name)}

                  {showChild && (
                    <>
                      <div className="pl-2 ">
                        {category?.children?.map((child) => (
                          <div key={child._id}>
                            {/* <Link
                              to={`/categories/${child?._id}`}
                              className="text-gray-700"
                            > */}
                            <div className="flex text-xs items-center  text-gray-700">
                              <span className=" text-xs text-gray-500 pr-1">
                                <IoRemoveSharp />
                              </span>
                              <span className="text-gray-500">
                                {showingTranslateValue(child.name)}
                              </span>
                            </div>
                            {/* </Link> */}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </Link>
              ) : (
                <span>{showingTranslateValue(category?.name)}</span>
              )}
            </TableCell>
            <TableCell className="text-sm">
              {showingTranslateValue(category?.description)}
            </TableCell>

            <TableCell className="text-center">
              <ShowHideButton
                id={category._id}
                category
                status={category.status}
              />
            </TableCell>
            <TableCell>
              <EditDeleteButton
                id={category?._id}
                parent={category}
                selectedIds={selectedIds}
                children={category?.children}
                handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
                title={showingTranslateValue(category?.name)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default CategoryTable;
