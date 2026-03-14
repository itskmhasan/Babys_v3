import {
  baseURL,
  handleResponse,
  fetchWithRetry,
  PUBLIC_FETCH_OPTIONS,
} from "@services/CommonService";

const PRODUCT_FETCH_OPTIONS = {
  ...PUBLIC_FETCH_OPTIONS,
  next: { revalidate: 60 },
};

const getShowingStoreProducts = async ({
  category = "",
  title = "",
  slug = "",
}) => {
  try {
    // console.log("slug::", slug);
    const response = await fetchWithRetry(
      `${baseURL}/products/store?category=${category}&title=${title}&slug=${slug}`,
      PRODUCT_FETCH_OPTIONS
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
    const response = await fetchWithRetry(
      `${baseURL}/products/show`,
      PRODUCT_FETCH_OPTIONS
    );

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
    const response = await fetchWithRetry(
      `${baseURL}/products?price=published&page=${page}&limit=${limit}`,
      PRODUCT_FETCH_OPTIONS
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
