import { baseURL, handleResponse } from "@services/CommonService";

const getAllCoupons = async () => {
  try {
    const response = await fetch(`${baseURL}/coupon`, {
      cache: "no-store",
    });
    const coupons = await handleResponse(response);
    return { coupons };
  } catch (error) {
    return { error: error.message };
  }
};

const getShowingCoupons = async () => {
  try {
    const response = await fetch(`${baseURL}/coupon/show`, {
      cache: "no-store",
    });
    const coupons = await handleResponse(response);
    return { coupons, error: null };
  } catch (error) {
    return { coupons: [], error: error.message };
  }
};

export { getAllCoupons, getShowingCoupons };
