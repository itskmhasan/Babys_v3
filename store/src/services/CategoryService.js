import {
  baseURL,
  handleResponse,
  fetchWithRetry,
  PUBLIC_FETCH_OPTIONS,
} from "@services/CommonService";

const getShowingCategory = async () => {
  try {
    const response = await fetchWithRetry(
      `${baseURL}/category/show`,
      PUBLIC_FETCH_OPTIONS
    );

    const categories = await handleResponse(response);
    return { categories, error: null, loading: false };
  } catch (error) {
    return { categories: [], error: error.message, loading: false };
  }
};

export { getShowingCategory };
