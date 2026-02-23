import Image from "next/image";

// internal
import ProductCard from "@components/product/ProductCard";

const CategoryWiseBlock = async ({
  category,
  getProductsForCategory,
  attributes,
  currency,
}) => {
  // try fetching products - category endpoints return products (not always popularProducts)
  let { products = [], popularProducts = [] } =
    (await getProductsForCategory({ category: category._id, title: "" })) || {};

  let categoryProducts = products?.length ? products : popularProducts;

  // fallback: if no products, try all child categories to gather products
  if ((!categoryProducts || categoryProducts.length === 0) && category?.children?.length) {
    for (const child of category.children) {
      const resp = (await getProductsForCategory({ category: child._id, title: "" })) || {};
      const childProducts = resp?.products?.length ? resp.products : resp?.popularProducts || [];
      if (childProducts.length > 0) {
        categoryProducts = childProducts;
        break;
      }
    }
  }

  const items = (categoryProducts || []).slice(0, 10);

  return (
    <section className="mb-12">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-zinc-800">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            {category?.name?.en || category?.name}
          </h3>
          {category?.description && (
            <p className="text-sm text-gray-500 mt-1">
              {category?.description?.en || category?.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
          <div className="flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 h-64">
            <div className="w-full h-full flex items-center justify-center">
              {category?.icon ? (
                <Image
                  src={category.icon}
                  alt={category?.name?.en || "category"}
                  width={260}
                  height={260}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Image
                  src="https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png"
                  alt="category"
                  width={260}
                  height={260}
                  className="w-full h-full object-contain"
                />
              )}
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {items.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 px-2 py-4">
                  No products found for this category.
                </p>
              ) : (
                items.map((p) => (
                  <ProductCard
                    key={p._id}
                    product={p}
                    attributes={attributes}
                    currency={currency}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CategoryWiseBlock;
