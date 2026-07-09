import { slugifyCategoryName } from "@utils/categorySlug";

export const getProductRoute = (product) => {
  const categoryName =
    product?.category?.name?.en || product?.category?.name || "product";
  const categorySlug = slugifyCategoryName(categoryName) || "product";

  if (!product?.slug) {
    return `/${categorySlug}`;
  }

  return `/${categorySlug}/${product.slug}`;
};
