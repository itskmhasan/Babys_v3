import { baseURL, handleResponse } from "@services/CommonService";

const getStoreCustomizationSetting = async () => {
  try {
    const response = await fetch(`${baseURL}/setting/store/customization`, {
      // cache: "force-cache", //if you want to no cache then comment this line, this setup will only re-call the api on hard reload after first call
      next: { revalidate: 900 }, // revalidate every 15 minutes
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
      // cache: "force-cache", //if you want to no cache then comment this line, this setup will only re-call the api on hard reload after first call
      next: { revalidate: 300 }, // revalidate every 5 minutes
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
      // cache: "force-cache", //if you want to no cache then comment this line, this setup will only re-call the api on hard reload after first call
      next: { revalidate: 120 }, // revalidate every 2 minutes
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
      // cache: "force-cache", //if you want to no cache then comment this line, this setup will only re-call the api on hard reload after first call
      next: { revalidate: 300 }, // revalidate every 5 minutes
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
      // cache: "force-cache", //if you want to no cache then comment this line, this setup will only re-call the api on hard reload after first call
      next: { revalidate: 120 }, // revalidate every 2 minutes
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
      // cache: "force-cache", //if you want to no cache then comment this line, this setup will only re-call the api on hard reload after first call
      next: { revalidate: 300 }, // revalidate every 5 minutes
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
