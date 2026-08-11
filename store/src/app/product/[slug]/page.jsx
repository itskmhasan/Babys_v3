//internal import

import { redirect } from "next/navigation";
import { getShowingStoreProducts } from "@services/ProductServices";
import { getProductRoute } from "@utils/productRoute";

// This async function generates the metadata
export async function generateMetadata({ params }) {
  const { slug } = await params;

  const { products } = await getShowingStoreProducts({
    category: "",
    slug: slug,
  });

  const product = products?.find((p) => p.slug === slug);

  return {
    title: product?.title?.en || "Product",
    description: product?.description?.en,
    keywords: [product?.tags],
  };
}

const ProductSlug = async ({ params }) => {
  const { slug } = await params;

  const { products } = await getShowingStoreProducts({
    category: "",
    slug: slug,
  });

  const product = products?.find((p) => p.slug === slug);

  if (!product) {
    redirect("/shop");
  }

  redirect(getProductRoute(product));
};

export default ProductSlug;
