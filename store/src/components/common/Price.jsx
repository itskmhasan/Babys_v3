import useUtilsFunction from "@hooks/useUtilsFunction";
import { normalizePricePair } from "@utils/price";

const Price = ({ product, price, card, originalPrice, currency }) => {
  const { getNumberTwo } = useUtilsFunction();
  const normalized = normalizePricePair(
    price ?? product?.prices?.price,
    originalPrice ?? product?.prices?.originalPrice
  );

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
          {getNumberTwo(normalized.price)}
        </span>
        {normalized.hasDiscount && (
          <span
            className={
              card
                ? "sm:text-sm font-normal text-base text-gray-400 ml-1"
                : "text-sm font-normal text-gray-400 ml-1"
            }
          >
            {currency}
            {getNumberTwo(normalized.originalPrice)}
          </span>
        )}
      </div>
    </>
  );
};

export default Price;
