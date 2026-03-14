import {
  baseURL,
  handleResponse,
  fetchWithRetry,
  PUBLIC_FETCH_OPTIONS,
} from "@services/CommonService";

const getStoreCustomizationSetting = async () => {
  try {
    const response = await fetchWithRetry(
      `${baseURL}/setting/store/customization`,
      PUBLIC_FETCH_OPTIONS
    );

    const storeCustomizationSetting = await handleResponse(response);
    // await new Promise((resolve) => setTimeout(resolve, 15000));
    return { storeCustomizationSetting };
  } catch (error) {
    // console.log("error", error);
    return { error: error.message };
  }
};

const getGlobalSetting = async () => {
  try {
    const response = await fetchWithRetry(
      `${baseURL}/setting/global`,
      PUBLIC_FETCH_OPTIONS
    );

    const globalSetting = await handleResponse(response);

    return { globalSetting };
  } catch (error) {
    return { error: error.message };
  }
};

const getShowingLanguage = async () => {
  try {
    const response = await fetchWithRetry(
      `${baseURL}/language/show`,
      PUBLIC_FETCH_OPTIONS
    );
    const languages = await handleResponse(response);
    // console.log("res", response.headers);
    return { languages };
  } catch (error) {
    return { error: error.message };
  }
};

const getStoreSetting = async () => {
  try {
    const response = await fetchWithRetry(
      `${baseURL}/setting/store-setting`,
      PUBLIC_FETCH_OPTIONS
    );

    const storeSetting = await handleResponse(response);
    // console.log("storeSetting", storeSetting);

    return { storeSetting };
  } catch (error) {
    return { error: error.message };
  }
};

const getStoreSecretKeys = async () => {
  try {
    const response = await fetchWithRetry(
      `${baseURL}/setting/store-setting/keys`,
      PUBLIC_FETCH_OPTIONS
    );

    const storeSetting = await handleResponse(response);
    // console.log("storeSetting:::>>>", storeSetting);

    return { storeSetting };
  } catch (error) {
    return { error: error.message };
  }
};

const getStoreSeoSetting = async () => {
  try {
    const response = await fetchWithRetry(
      `${baseURL}/setting/store-setting/seo`,
      PUBLIC_FETCH_OPTIONS
    );

    const seoSetting = await handleResponse(response);

    return { seoSetting };
  } catch (error) {
    return { error: error.message };
  }
};

export {
  getGlobalSetting,
  getShowingLanguage,
  getStoreSetting,
  getStoreSeoSetting,
  getStoreSecretKeys,
  getStoreCustomizationSetting,
};
