import { notFound } from "next/navigation";

import ProductScreen from "@components/slug-card/ProductScreen";
import { getShowingAttributes } from "@services/AttributeServices";
import { getShowingStoreProducts } from "@services/ProductServices";

const loadProduct = async (slug) => {
  const { relatedProducts, products, reviews } = await getShowingStoreProducts({
    category: "",
    slug,
  });

  return {
    product: products?.find((item) => item.slug === slug),
    relatedProducts,
    reviews,
  };
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const { product } = await loadProduct(slug);

  return {
    title: product?.title?.en || "Product",
    description: product?.description?.en,
    keywords: [product?.tags],
  };
}

const ProductCategorySlugPage = async ({ params }) => {
  const { slug } = await params;
  const { product, relatedProducts, reviews } = await loadProduct(slug);
  const { attributes } = await getShowingAttributes();

  if (!product) {
    notFound();
  }

  return (
    <ProductScreen
      product={product}
      reviews={reviews}
      attributes={attributes}
      relatedProducts={relatedProducts}
    />
  );
};

export default ProductCategorySlugPage;