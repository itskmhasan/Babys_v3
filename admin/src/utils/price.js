const toPriceNumber = (value) => {
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed) || parsed < 0) return 0;
  return Number(parsed.toFixed(2));
};

export const normalizePricePair = (rawPrice, rawOriginalPrice) => {
  const price = toPriceNumber(rawPrice);
  const originalPrice = toPriceNumber(rawOriginalPrice);

  if (price <= 0 && originalPrice <= 0) {
    return { price: 0, originalPrice: 0, hasDiscount: false };
  }

  if (price <= 0) {
    return { price: originalPrice, originalPrice, hasDiscount: false };
  }

  if (originalPrice <= 0) {
    return { price, originalPrice: price, hasDiscount: false };
  }

  const normalizedPrice = Math.min(price, originalPrice);
  const normalizedOriginalPrice = Math.max(price, originalPrice);

  return {
    price: normalizedPrice,
    originalPrice: normalizedOriginalPrice,
    hasDiscount: normalizedOriginalPrice > normalizedPrice,
  };
};
