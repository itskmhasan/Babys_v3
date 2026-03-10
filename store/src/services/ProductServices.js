import { baseURL, handleResponse } from "@services/CommonService";

const getShowingStoreProducts = async ({
  category = "",
  title = "",
  slug = "",
}) => {
  try {
    // console.log("slug::", slug);
    const response = await fetch(
      `${baseURL}/products/store?category=${category}&title=${title}&slug=${slug}`,
      {
        cache: "no-store",
      }
    );

    const products = await handleResponse(response);

    return {
      error: null,
      reviews: products.reviews,
      products: products.products,
      relatedProducts: products.relatedProducts,
      popularProducts: products.popularProducts,
      discountedProducts: products.discountedProducts,
    };
  } catch (error) {
    return {
      products: [],
      relatedProducts: [],
      popularProducts: [],
      discountedProducts: [],
      error: error.message,
    };
  }
};

const getShowingProducts = async () => {
  try {
    const response = await fetch(`${baseURL}/products/show`, {
      cache: "no-store",
    });

    const products = await handleResponse(response);

    return {
      error: null,
      products,
    };
  } catch (error) {
    return {
      products: [],
      error: error.message,
    };
  }
};

const getShowingProductsPaginated = async ({ page = 1, limit = 48 }) => {
  try {
    const response = await fetch(
      `${baseURL}/products?price=published&page=${page}&limit=${limit}`,
      {
        cache: "no-store",
      }
    );

    const data = await handleResponse(response);

    return {
      error: null,
      products: Array.isArray(data?.products) ? data.products : [],
      totalDoc: Number(data?.totalDoc || 0),
      pages: Number(data?.pages || page),
      limits: Number(data?.limits || limit),
    };
  } catch (error) {
    return {
      error: error.message,
      products: [],
      totalDoc: 0,
      pages: Number(page) || 1,
      limits: Number(limit) || 48,
    };
  }
};

export { getShowingStoreProducts, getShowingProducts, getShowingProductsPaginated };
