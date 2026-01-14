import useUtilsFunction from "@hooks/useUtilsFunction";

const Price = ({ product, price, card, currency, originalPrice }) => {
  // console.log("price", price, "originalPrice", originalPrice, "card", card);
  const { getNumberTwo } = useUtilsFunction();

  return (
    <div className="product-price font-bold">
      {product?.isCombination ? (
        <>
          <span
            className={
              card
                ? "inline-block text-base text-gray-900"
                : "inline-block text-xl"
            }
          >
            {currency}
            {getNumberTwo(price)}
          </span>
          {originalPrice > price ? (
            <>
              <del
                className={
                  card
                    ? "sm:text-sm font-normal text-base text-gray-400 ml-1"
                    : "text-lg font-normal text-gray-400 ml-1"
                }
              >
                {currency}
                {getNumberTwo(originalPrice)}
              </del>
            </>
          ) : null}
        </>
      ) : (
        <>
          <div className="relative mb-2">
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">Originally:</div>
              <div className="text-xs text-gray-500 font-semibold">
                {originalPrice > price ? (
                  <>
                    <del
                      className={
                        card
                          ? "font-normal text-xs text-gray-400 ml-1"
                          : "text-base font-normal text-gray-400 ml-1"
                      }
                    >
                      {currency}
                      {getNumberTwo(originalPrice)}
                    </del>
                  </>
                ) : null}
              </div>
            </div>
            {/* Wavy Line Background */}
            <div
              className="relative h-5 w-full bg-no-repeat bg-contain bg-center mt-1"
              style={{
                backgroundImage: `url('https://i.ibb.co.com/GQQy11TV/display-price-line.webp')`,
              }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-bold text-[#ef4a23] mt-6">
                <span
                  className={
                    card
                      ? "inline-block text-base text-gray-900"
                      : "inline-block text-xl"
                  }
                >
                  {currency}
                  {getNumberTwo(product?.prices?.price)}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Price;
