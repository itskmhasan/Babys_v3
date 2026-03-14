import {
  baseURL,
  handleResponse,
  fetchWithRetry,
  PUBLIC_FETCH_OPTIONS,
} from "@services/CommonService";

const ATTRIBUTE_FETCH_OPTIONS = {
  ...PUBLIC_FETCH_OPTIONS,
  next: { revalidate: 300 },
};

const getShowingAttributes = async () => {
  try {
    const response = await fetchWithRetry(
      `${baseURL}/attributes/show`,
      ATTRIBUTE_FETCH_OPTIONS
    );

    const attributes = await handleResponse(response);
    return { attributes, error: null };
  } catch (error) {
    return { attributes: [], error: error.message };
  }
};

export { getShowingAttributes };
