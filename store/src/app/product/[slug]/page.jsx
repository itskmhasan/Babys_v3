//internal import

import ProductScreen from "@components/slug-card/ProductScreen";
import { showingTranslateValue } from "@lib/translate";
import { getShowingAttributes } from "@services/AttributeServices";
import { getShowingStoreProducts } from "@services/ProductServices";

// This async function generates the metadata
export async function generateMetadata({ params }) {
  const { slug } = await params;

  const { products } = await getShowingStoreProducts({
    category: "",
    slug: slug,
  });

  const product = products?.find((p) => p.slug === slug);

  return {
    title: `${product?.title?.en} | Kachabazar`,
    description: product?.description?.en,
    keywords: [product?.tags],
    openGraph: {
      images: [product?.image],
    },
  };
}

const ProductSlug = async ({ params }) => {
  const { slug } = await params;

  const { attributes } = await getShowingAttributes();

  const { relatedProducts, products, reviews, error } =
    await getShowingStoreProducts({
      category: "",
      slug: slug,
    });

  let product = {};

  // console.log("products", products);

  if (slug) {
    product = products?.find((p) => p.slug === slug);
  }

  return (
    <>
      <ProductScreen
        product={product}
        reviews={reviews}
        attributes={attributes}
        relatedProducts={relatedProducts}
      />
    </>
  );
};

export default ProductSlug;
