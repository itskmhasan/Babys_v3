import { baseURL, handleResponse } from "@services/CommonService";

const getStoreCustomizationSetting = async () => {
  try {
    const response = await fetch(`${baseURL}/setting/store/customization`, {
      cache: "no-store",
    });

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
    const response = await fetch(`${baseURL}/setting/global`, {
      cache: "no-store",
    });

    const globalSetting = await handleResponse(response);

    return { globalSetting };
  } catch (error) {
    return { error: error.message };
  }
};

const getShowingLanguage = async () => {
  try {
    const response = await fetch(`${baseURL}/language/show`, {
      cache: "no-store",
    });
    const languages = await handleResponse(response);
    // console.log("res", response.headers);
    return { languages };
  } catch (error) {
    return { error: error.message };
  }
};

const getStoreSetting = async () => {
  try {
    const response = await fetch(`${baseURL}/setting/store-setting`, {
      cache: "no-store",
    });

    const storeSetting = await handleResponse(response);
    // console.log("storeSetting", storeSetting);

    return { storeSetting };
  } catch (error) {
    return { error: error.message };
  }
};

const getStoreSecretKeys = async () => {
  try {
    const response = await fetch(`${baseURL}/setting/store-setting/keys`, {
      cache: "no-store",
    });

    const storeSetting = await handleResponse(response);
    // console.log("storeSetting:::>>>", storeSetting);

    return { storeSetting };
  } catch (error) {
    return { error: error.message };
  }
};

const getStoreSeoSetting = async () => {
  try {
    const response = await fetch(`${baseURL}/setting/store-setting/seo`, {
      cache: "no-store",
    });

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
