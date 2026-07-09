export const slugifyCategoryName = (value) => {
  return String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const getCategoryNameVariants = (category) => {
  const name = category?.name;

  if (!name) return [];
  if (typeof name === "string") return [name];

  return Object.values(name).filter(Boolean);
};

export const flattenCategories = (categories = []) => {
  const flattened = [];

  const walk = (items = []) => {
    items.forEach((item) => {
      flattened.push(item);
      if (Array.isArray(item?.children) && item.children.length > 0) {
        walk(item.children);
      }
    });
  };

  walk(categories);
  return flattened;
};

export const findCategoryBySlug = (categories = [], slug = "") => {
  const normalizedSlug = String(slug || "").trim().toLowerCase();
  if (!normalizedSlug) return null;

  return flattenCategories(categories).find((category) => {
    const variants = getCategoryNameVariants(category);
    return variants.some((variant) => slugifyCategoryName(variant) === normalizedSlug);
  }) || null;
};