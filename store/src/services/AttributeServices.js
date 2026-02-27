import { baseURL, handleResponse } from "@services/CommonService";

const getShowingAttributes = async () => {
  try {
    const response = await fetch(`${baseURL}/attributes/show`, {
      cache: "no-store",
    });

    const attributes = await handleResponse(response);
    return { attributes, error: null };
  } catch (error) {
    return { attributes: [], error: error.message };
  }
};

export { getShowingAttributes };
