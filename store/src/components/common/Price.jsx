import useUtilsFunction from "@hooks/useUtilsFunction";

const Price = ({ product, price, card, originalPrice, currency }) => {
  const { getNumberTwo } = useUtilsFunction();

  // From "second design" logic
  const isCombo = product?.isCombination;
  const finalPrice = isCombo
    ? getNumberTwo(price)
    : getNumberTwo(product?.prices?.price);
  const baseOriginalPrice = getNumberTwo(originalPrice);
  const discountAmount = originalPrice > price ? originalPrice - price : 0;
  const discountPercent =
    originalPrice > price
      ? ((discountAmount / originalPrice) * 100).toFixed(2)
      : 0;

  return (
    <>
      <div className="product-price font-bold">
        <span
          className={`${
            card
              ? "inline-block text-base text-gray-900"
              : "inline-block text-xl"
          }`}
        >
          {currency}
          {finalPrice}
        </span>
        {discountAmount > 0 && (
          <span
            className={
              card
                ? "sm:text-sm font-normal text-base text-gray-400 ml-1"
                : "text-sm font-normal text-gray-400 ml-1"
            }
          >
            {currency}
            {baseOriginalPrice}
          </span>
        )}
      </div>

      {/* {discountAmount > 0 && !card && (
        <p className="text-xs text-emerald-600">
          Save {currency}
          {getNumberTwo(discountAmount)} ({discountPercent}% off)
        </p>
      )} */}
    </>
  );
};

export default Price;
