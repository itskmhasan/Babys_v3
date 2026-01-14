import requests from "./httpService";

const SettingServices = {
  // global setting all function
  addGlobalSetting: async (body) => {
    return requests.post("/setting/global", body);
  },

  getGlobalSetting: async () => {
    return requests.get("/setting/global");
  },

  updateGlobalSetting: async (body) => {
    return requests.put(`/setting/global`, body);
  },

  // store setting all function
  addStoreSetting: async (body) => {
    return requests.post("/setting/store-setting", body);
  },

  getStoreSetting: async ({ query }) => {
    console.log("query", query);

    return requests.get(`/setting/store-setting?filter=${query}`);
  },

  updateStoreSetting: async (body) => {
    return requests.put(`/setting/store-setting`, body);
  },

  // store customization setting all function
  addStoreCustomizationSetting: async (body) => {
    return requests.post("/setting/store/customization", body);
  },

  getStoreCustomizationSetting: async () => {
    return requests.get("/setting/store/customization");
  },

  updateStoreCustomizationSetting: async (body) => {
    return requests.put(`/setting/store/customization`, body);
  },
};

export default SettingServices;
