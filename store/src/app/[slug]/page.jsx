import SearchScreen from "@components/search/SearchScreen";
import { getShowingAttributes } from "@services/AttributeServices";
import { getShowingCategory } from "@services/CategoryService";
import { getShowingStoreProducts } from "@services/ProductServices";
import { getGlobalSetting } from "@services/SettingServices";
import {
  findCategoryBySlug,
  slugifyCategoryName,
} from "@utils/categorySlug";

const buildCategoryProducts = async (slug) => {
  const { categories } = await getShowingCategory();
  const matchedCategory = findCategoryBySlug(categories, slug);

  if (!matchedCategory?._id) {
    return { products: [], categories, matchedCategory: null };
  }

  const { products } = await getShowingStoreProducts({
    category: matchedCategory._id,
  });

  return { products, categories, matchedCategory };
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { categories, matchedCategory } = await buildCategoryProducts(slug);
  const title = matchedCategory?.name?.en || matchedCategory?.name || "Category";

  return {
    title,
    description: `Browse products in ${title}.`,
    alternates: {
      canonical: `/${slugifyCategoryName(title) || slug}`,
    },
  };
}

const CategorySlugPage = async ({ params }) => {
  const { slug } = await params;

  const { products, categories } = await buildCategoryProducts(slug);
  const { attributes } = await getShowingAttributes();
  const { globalSetting } = await getGlobalSetting();
  const currency = globalSetting?.default_currency || "$";

  return (
    <SearchScreen
      products={Array.isArray(products) ? products : []}
      attributes={attributes}
      categories={categories}
      currency={currency}
    />
  );
};

export default CategorySlugPage;