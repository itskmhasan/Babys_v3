const router = require("express").Router();
const { isAuth, isAdmin, isSuperAdmin } = require("../config/auth");
const {
  addGlobalSetting,
  getGlobalSetting,
  getHealthcheckStatus,
  runHealthcheckReportNow,
  updateGlobalSetting,
  addStoreSetting,
  getStoreSetting,
  getStoreSecretKeys,
  updateStoreSetting,
  getStoreSeoSetting,
  addStoreCustomizationSetting,
  getStoreCustomizationSetting,
  updateStoreCustomizationSetting,
} = require("../controller/settingController");

/**
 * Global Settings
 */
router
  .route("/global")
  .post(isAuth, isAdmin, addGlobalSetting) // POST /global
  .get(getGlobalSetting) // GET /global
  .put(isAuth, isAdmin, updateGlobalSetting); // PUT /global

router.get("/healthcheck/status", isAuth, isAdmin, getHealthcheckStatus);
router.post("/healthcheck/run", isAuth, isAdmin, runHealthcheckReportNow);

/**
 * Store Settings
 */
router
  .route("/store-setting")
  .post(isAuth, isAdmin, addStoreSetting) // POST /store-setting
  .get(getStoreSetting) // GET /store-setting
  .put(isAuth, isAdmin, updateStoreSetting); // PUT /store-setting

router.get("/store-setting/keys", isAuth, isSuperAdmin, getStoreSecretKeys); // GET /store-setting/keys
router.get("/store-setting/seo", getStoreSeoSetting); // GET /store-setting/seo

/**
 * Store Customization
 */
router
  .route("/store/customization")
  .post(isAuth, isAdmin, addStoreCustomizationSetting) // POST /store/customization
  .get(getStoreCustomizationSetting) // GET /store/customization
  .put(isAuth, isAdmin, updateStoreCustomizationSetting); // PUT /store/customization

module.exports = router;
