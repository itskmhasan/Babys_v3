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
  const title = product?.title?.en ? `${product.title.en} | Babys` : "Product | Babys";
  const description = product?.description?.en;
  const imageUrl = product?.image?.[0];
  const productUrl = `https://babys.com.bd${getProductRoute(product)}`;

  return {
    title,
    description,
    keywords: [product?.tags],
    openGraph: {
      title,
      description,
      url: productUrl,
      siteName: "Babys",
      images: imageUrl ? [{ url: imageUrl, width: 800, height: 800 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
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
