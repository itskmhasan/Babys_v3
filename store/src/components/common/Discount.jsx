import useUtilsFunction from "@hooks/useUtilsFunction";

const Discount = ({ discount, product, slug, modal }) => {
  const { getNumber } = useUtilsFunction();

  const price = product?.isCombination
    ? getNumber(product?.variants?.[0]?.price)
    : getNumber(product?.prices?.price);

  const originalPrice = product?.isCombination
    ? getNumber(product?.variants?.[0]?.originalPrice)
    : getNumber(product?.prices?.originalPrice);

  const discountPercentage =
    originalPrice > 0
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  return (
    <>
      {discount > 1 && (
        <span
          className={
            modal
              ? "absolute z-10 left-4 top-4 inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/10 ring-inset"
              : slug
              ? "inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/10 ring-inset"
              : "absolute z-10 inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/10 ring-inset"
          }
        >
          {discount}% Off
        </span>
      )}
      {discount === undefined && discountPercentage > 1 && (
        <span
          className={
            modal
              ? "absolute z-10 left-4 top-4 inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/10 ring-inset"
              : slug
              ? "inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-red-600/10 ring-inset"
              : "absolute z-10 right-3 top-3 inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-600 ring-1 ring-red-600/10 ring-inset"
          }
        >
          {/* {Number(product.prices.discount).toFixed(0)}% Off */}
          {discountPercentage} % Off
        </span>
      )}
    </>
  );
};

export default Discount;
