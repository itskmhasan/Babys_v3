import SearchScreen from "@components/search/SearchScreen";
import { getShowingAttributes } from "@services/AttributeServices";
import { getShowingCategory } from "@services/CategoryService";
import { getShowingProductsPaginated } from "@services/ProductServices";
import { getGlobalSetting } from "@services/SettingServices";

export const metadata = {
  title: "Shop",
  description:
    "Browse all products in one place and discover essentials for moms and babies.",
};

const Shop = async ({ searchParams }) => {
  const params = await searchParams;
  const parsedPage = Number.parseInt(params?.page || "1", 10);
  const currentPage = Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
  const pageSize = 48;

  const { products, totalDoc } = await getShowingProductsPaginated({
    page: currentPage,
    limit: pageSize,
  });

  const totalPages = Math.max(1, Math.ceil((totalDoc || 0) / pageSize));
  const { attributes } = await getShowingAttributes();
  const { categories } = await getShowingCategory();
  const { globalSetting } = await getGlobalSetting();
  const currency = globalSetting?.default_currency || "$";

  return (
    <SearchScreen
      products={Array.isArray(products) ? products : []}
      attributes={attributes}
      categories={categories}
      currency={currency}
      pagination={{
        enabled: true,
        currentPage,
        totalPages,
        totalItems: totalDoc || 0,
        basePath: "/shop",
      }}
    />
  );
};

export default Shop;
