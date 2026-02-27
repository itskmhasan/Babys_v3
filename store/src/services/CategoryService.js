import { baseURL, handleResponse } from "@services/CommonService";

const getShowingCategory = async () => {
  try {
    const response = await fetch(`${baseURL}/category/show`, {
      cache: "no-store",
    });

    const categories = await handleResponse(response);
    return { categories, error: null, loading: false };
  } catch (error) {
    return { categories: [], error: error.message, loading: false };
  }
};

export { getShowingCategory };
