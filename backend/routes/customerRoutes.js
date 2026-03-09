const express = require("express");
const router = express.Router();
const { isAuth, isAdmin } = require("../config/auth");
const {
  loginCustomer,
  refreshToken,
  registerCustomer,
  verifyPhoneNumber,
  confirmPhoneVerification,
  signUpWithOauthProvider,
  checkEmailAvailability,
  verifyEmailAddress,
  forgetPassword,
  changePassword,
  resetPassword,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
  addAllCustomers,
  addShippingAddress,
  getShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
} = require("../controller/customerController");
const {
  passwordVerificationLimit,
  emailVerificationLimit,
  phoneVerificationLimit,
} = require("../lib/email-sender/sender");

//verify email
router.post("/verify-email", emailVerificationLimit, verifyEmailAddress);

// check email availability for signup
router.get("/check-email", checkEmailAvailability);

//verify phone number
router.post("/verify-phone", phoneVerificationLimit, verifyPhoneNumber);
router.post(
  "/verify-phone/confirm",
  phoneVerificationLimit,
  confirmPhoneVerification
);

// shipping address send to array
router.post("/shipping/address/:id", isAuth, addShippingAddress);

// get all shipping address
router.get("/shipping/address/:id", isAuth, getShippingAddress);

// shipping address update
router.put("/shipping/address/:userId/:shippingId", isAuth, updateShippingAddress);

// shipping address delete
router.delete("/shipping/address/:userId/:shippingId", isAuth, deleteShippingAddress);

//register a user
router.post("/register/:token", registerCustomer);

//login a user
router.post("/login", loginCustomer);

// refresh token
router.post("/refresh", refreshToken);

//register or login with google and fb
router.post("/signup/oauth", signUpWithOauthProvider);

//forget-password
router.put("/forget-password", passwordVerificationLimit, forgetPassword);

//reset-password
router.put("/reset-password", resetPassword);

//change password
router.post("/change-password", isAuth, changePassword);

//add all users
router.post("/add/all", isAuth, isAdmin, addAllCustomers);

//get all user
router.get("/", isAuth, isAdmin, getAllCustomers);

//get a user
router.get("/:id", isAuth, getCustomerById);

//update a user
router.put("/:id", isAuth, updateCustomer);

//delete a user
router.delete("/:id", isAuth, isAdmin, deleteCustomer);

module.exports = router;
