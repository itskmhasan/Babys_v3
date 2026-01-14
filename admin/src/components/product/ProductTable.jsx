import { TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { t } from "i18next";
import { FiZoomIn } from "react-icons/fi";
import { Link } from "react-router-dom";

//internal import
import CheckBox from "@/components/form/others/CheckBox";

import EditDeleteButton from "@/components/table/EditDeleteButton";
import ShowHideButton from "@/components/table/ShowHideButton";
import Tooltip from "@/components/tooltip/Tooltip";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import { useAction } from "@/context/ActionContext";

//internal import

const ProductTable = ({ products }) => {
  const { handleModalOpen, handleUpdate } = useToggleDrawer();
  const { selectedIds, handleSelect } = useAction();
  const { currency, showingTranslateValue, getNumberTwo } = useUtilsFunction();

  return (
    <>
      <TableBody>
        {products?.map((product, i) => (
          <TableRow key={i + 1}>
            <TableCell>
              <CheckBox
                type="checkbox"
                id={product._id}
                handleSelect={handleSelect}
                name={product?.title?.en}
                isChecked={selectedIds?.includes(product._id)}
              />
            </TableCell>

            <TableCell>
              <div className="flex items-center">
                {product?.image[0] ? (
                  <Avatar className="hidden p-1 mr-2 md:block bg-gray-50 shadow-none">
                    <AvatarImage src={product?.image[0]} alt="product" />
                    <AvatarFallback>P</AvatarFallback>
                  </Avatar>
                ) : (
                  <Avatar>
                    <AvatarImage
                      src={`https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png`}
                      alt="product"
                    />
                    <AvatarFallback>P</AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <h2
                    className={`text-sm font-medium ${
                      product?.title.length > 30 ? "wrap-long-title" : ""
                    }`}
                  >
                    {showingTranslateValue(product?.title)?.substring(0, 28)}
                  </h2>
                </div>
              </div>
            </TableCell>

            <TableCell>
              <span className="text-sm text-gray-700 dark:text-gray-200">
                {showingTranslateValue(product?.category?.name)}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-sm font-semibold">
                {currency}
                {product?.isCombination
                  ? getNumberTwo(product?.variants[0]?.originalPrice)
                  : getNumberTwo(product?.prices?.originalPrice)}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-sm font-semibold">
                {currency}
                {product?.isCombination
                  ? getNumberTwo(product?.variants[0]?.price)
                  : getNumberTwo(product?.prices?.price)}
              </span>
            </TableCell>

            <TableCell>
              <span className="text-sm">{product.stock}</span>
            </TableCell>
            <TableCell>
              {product.stock > 0 ? (
                <Badge variant="success">{t("Selling")}</Badge>
              ) : (
                <Badge variant="danger">{t("SoldOut")}</Badge>
              )}
            </TableCell>
            <TableCell>
              <Link
                to={`/product/${product._id}`}
                className="flex justify-center text-gray-400 hover:text-emerald-600"
              >
                <Tooltip
                  id="view"
                  Icon={FiZoomIn}
                  title={t("DetailsTbl")}
                  bgColor="#10B981"
                />
              </Link>
            </TableCell>
            <TableCell className="text-center">
              <ShowHideButton id={product._id} status={product.status} />
              {/* {product.status} */}
            </TableCell>
            <TableCell>
              <EditDeleteButton
                id={product._id}
                product={product}
                selectedIds={selectedIds}
                handleUpdate={handleUpdate}
                handleModalOpen={handleModalOpen}
                title={showingTranslateValue(product?.title)}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </>
  );
};

export default ProductTable;
