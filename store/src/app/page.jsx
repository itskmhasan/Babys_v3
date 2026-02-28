import { Suspense } from "react";
import { unstable_noStore as noStore } from "next/cache";

//internal import
import Banner from "@components/banner/Banner";
import CardTwo from "@components/cta-card/CardTwo";
import StickyCart from "@components/cart/StickyCart";
import MiniOfferCarousel from "@components/offer/MiniOfferCarousel";
import ProductCard from "@components/product/ProductCard";
import MainCarousel from "@components/carousel/MainCarousel";
import CMSkeletonTwo from "@components/preloader/CMSkeleton";
import FeatureCategory from "@components/category/FeatureCategory";
import FirstVisitOfferPopup from "@components/offer/FirstVisitOfferPopup";
import { getShowingCategory } from "@services/CategoryService";
import { getShowingCoupons } from "@services/CouponServices";
import CategoryWiseBlock from "@components/category/CategoryWiseBlock";
import { getShowingStoreProducts } from "@services/ProductServices";
import { getShowingAttributes } from "@services/AttributeServices";
import {
  getGlobalSetting,
  getStoreCustomizationSetting,
} from "@services/SettingServices";
import DiscountedCard from "@components/product/DiscountedCard";

const Home = async () => {
  noStore();

  const { attributes } = await getShowingAttributes();
  const { storeCustomizationSetting, error: storeCustomizationError } =
    await getStoreCustomizationSetting();
  const { popularProducts, discountedProducts, error } =
    await getShowingStoreProducts({
      category: "",
      title: "",
    });

  const { globalSetting } = await getGlobalSetting();
  const currency = globalSetting?.default_currency || "$";
  const { coupons } = await getShowingCoupons();

  // fetch categories for category-wise sections
  const { categories } = await getShowingCategory();

  // console.log("storeCustomizationSetting", storeCustomizationSetting);

  return (
    <div className="min-h-screen dark:bg-zinc-900">
      <FirstVisitOfferPopup
        categories={categories?.[0]?.children || []}
        coupons={coupons || []}
        couponTitle={storeCustomizationSetting?.home?.discount_title}
      />

      {/* sticky cart section */}
      <StickyCart currency={currency} />

      <div className="bg-white dark:bg-zinc-900">
        <div className="mx-auto py-5 max-w-screen-2xl px-3 sm:px-10">
          <div className="flex w-full lg:gap-2 xl:gap-3">
            {/* Home page main carousel */}
            <div className="flex-shrink-0 lg:block w-full lg:w-2/3">
              <Suspense fallback={<p>Loading carousel...</p>}>
                <MainCarousel />
              </Suspense>
            </div>
            {/* mini carousel */}
            <div className="hidden lg:flex lg:w-1/3">
              <Suspense fallback={<p>Loading mini carousel...</p>}>
                <MiniOfferCarousel slider={storeCustomizationSetting?.slider} />
              </Suspense>
            </div>
          </div>

          {/* Banner */}
          <div className="bg-gradient-to-r from-slate-50 via-white to-slate-50 px-6 md:px-8 py-6 md:py-8 rounded-2xl mt-6 border border-slate-200 dark:from-slate-800 dark:via-slate-800 dark:to-slate-900 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
            <Banner storeCustomizationSetting={storeCustomizationSetting} />
          </div>
        </div>
      </div>

      {/* feature category's */}
      {storeCustomizationSetting?.home?.featured_status && (
        <div className="bg-gradient-to-b from-white to-gray-50 dark:from-zinc-800 dark:to-zinc-900 lg:py-20 py-12 border-y-4 border-transparent bg-clip-padding [border-image:linear-gradient(90deg,#ec4899,#a855f7,#06b6d4)_1] shadow-[0_0_0_1px_rgba(236,72,153,0.2)]">
          <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
            <div className="mb-12 flex justify-center">
              <div className="text-center w-full lg:w-3/5 bg-gradient-to-r from-emerald-50 via-white to-teal-50 dark:from-emerald-900/20 dark:via-transparent dark:to-teal-900/20 p-8 md:p-10 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/30 shadow-lg hover:shadow-xl transition-shadow">
                <h2 className="text-3xl lg:text-4xl mb-4 font-bold bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-400 dark:to-teal-400 bg-clip-text text-transparent">
                  <CMSkeletonTwo
                    count={1}
                    height={30}
                    loading={false}
                    error={storeCustomizationError}
                    data={storeCustomizationSetting?.home?.feature_title}
                  />
                </h2>
                <div className="h-1 w-16 bg-gradient-to-r from-emerald-400 to-teal-400 mx-auto mb-6 rounded-full"></div>
                <p className="text-base text-gray-700 dark:text-gray-300 leading-7">
                  <CMSkeletonTwo
                    count={4}
                    height={10}
                    loading={false}
                    error={storeCustomizationError}
                    data={storeCustomizationSetting?.home?.feature_description}
                  />
                </p>
              </div>
            </div>

            <Suspense fallback={<p>Loading feature category...</p>}>
              <FeatureCategory />
            </Suspense>
          </div>
        </div>
      )}

      {/* popular products */}
      {storeCustomizationSetting?.home?.popular_products_status && (
        <div className="bg-gray-50 dark:bg-zinc-900 lg:py-16 py-10 mx-auto max-w-screen-2xl px-3 sm:px-10">
          <div className="mb-10 flex justify-center">
            <div className="text-center w-full lg:w-3/5 bg-gradient-to-r from-pink-50 via-white to-rose-50 dark:from-pink-900/20 dark:via-transparent dark:to-rose-900/20 p-8 md:p-10 rounded-2xl border border-pink-200/50 dark:border-pink-800/30 shadow-lg hover:shadow-xl transition-shadow">
              <h2 className="text-3xl lg:text-4xl mb-4 font-bold bg-gradient-to-r from-pink-600 to-rose-600 dark:from-pink-400 dark:to-rose-400 bg-clip-text text-transparent">
                <CMSkeletonTwo
                  count={1}
                  height={30}
                  loading={false}
                  error={storeCustomizationError}
                  data={storeCustomizationSetting?.home?.popular_title}
                />
              </h2>
              <div className="h-1 w-16 bg-gradient-to-r from-pink-400 to-rose-400 mx-auto mb-6 rounded-full"></div>
              <p className="text-base font-sans text-gray-700 dark:text-gray-300 leading-6">
                <CMSkeletonTwo
                  count={5}
                  height={10}
                  loading={false}
                  error={storeCustomizationError}
                  data={storeCustomizationSetting?.home?.popular_description}
                />
              </p>
            </div>
          </div>
          <div className="flex">
            <div className="w-full">
              {error ? (
                <CMSkeletonTwo
                  count={20}
                  height={20}
                  error={error}
                  loading={false}
                />
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3">
                  {popularProducts
                    ?.slice(
                      0,
                      storeCustomizationSetting?.home
                        ?.latest_discount_product_limit
                    )
                    .map((product) => (
                      <ProductCard
                        key={product._id}
                        product={product}
                        attributes={attributes}
                        currency={currency}
                      />
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* promotional banner card */}
      {storeCustomizationSetting?.home?.delivery_status && (
        <div className="block mx-auto max-w-screen-2xl mt-10 lg:mt-16">
          <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
            <CardTwo />
          </div>
        </div>
      )}

      {/* category-wise products (design pattern) */}
      {categories?.[0]?.children?.length > 0 && (
        <div className="mx-auto max-w-screen-2xl px-3 sm:px-10 mt-12">
          {/** We'll show up to 3 category blocks; adjust slice as needed */}
          {(
            categories[0].children.slice(0, 10) || []
          ).map((cat) => {
            return (
              <CategoryWiseBlock
                key={cat._id}
                category={cat}
                getProductsForCategory={getShowingStoreProducts}
                attributes={attributes}
                currency={currency}
              />
            );
          })}
        </div>
      )}

      {/* discounted products */}
      {storeCustomizationSetting?.home?.discount_product_status &&
        discountedProducts?.length > 0 && (
          <div
            id="discount"
            className="bg-gray-50 dark:bg-zinc-800 lg:py-16 py-10 mx-auto max-w-screen-2xl px-3 sm:px-10"
          >
            <div className="mb-10 flex justify-center">
              <div className="text-center w-full lg:w-3/5 bg-gradient-to-r from-amber-50 via-white to-orange-50 dark:from-amber-900/20 dark:via-transparent dark:to-orange-900/20 p-8 md:p-10 rounded-2xl border border-amber-200/50 dark:border-amber-800/30 shadow-lg hover:shadow-xl transition-shadow">
                <h2 className="text-3xl lg:text-4xl mb-4 font-bold bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent">
                  <CMSkeletonTwo
                    count={1}
                    height={30}
                    loading={false}
                    error={storeCustomizationError}
                    data={
                      storeCustomizationSetting?.home?.latest_discount_title
                    }
                  />
                </h2>
                <div className="h-1 w-16 bg-gradient-to-r from-amber-400 to-orange-400 mx-auto mb-6 rounded-full"></div>
                <p className="text-base font-sans text-gray-700 dark:text-gray-300 leading-6">
                  <CMSkeletonTwo
                    count={5}
                    height={20}
                    loading={false}
                    error={storeCustomizationError}
                    data={
                      storeCustomizationSetting?.home
                        ?.latest_discount_description
                    }
                  />
                </p>
              </div>
            </div>
            <div className="flex">
              <div className="w-full">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5 2xl:grid-cols-6 gap-2 md:gap-3 lg:gap-3">
                  {discountedProducts
                    ?.slice(
                      0,
                      storeCustomizationSetting?.home?.popular_product_limit
                    )
                    .map((product) => (
                      <DiscountedCard
                        key={product._id}
                        product={product}
                        currency={currency}
                        attributes={attributes}
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Home;
