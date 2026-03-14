import {
  baseURL,
  handleResponse,
  fetchWithRetry,
  PUBLIC_FETCH_OPTIONS,
} from "@services/CommonService";

const COUPON_FETCH_OPTIONS = {
  ...PUBLIC_FETCH_OPTIONS,
  next: { revalidate: 60 },
};

const getAllCoupons = async () => {
  try {
    const response = await fetchWithRetry(`${baseURL}/coupon`, COUPON_FETCH_OPTIONS);
    const coupons = await handleResponse(response);
    return { coupons };
  } catch (error) {
    return { error: error.message };
  }
};

const getShowingCoupons = async () => {
  try {
    const response = await fetchWithRetry(
      `${baseURL}/coupon/show`,
      COUPON_FETCH_OPTIONS
    );
    const coupons = await handleResponse(response);
    return { coupons, error: null };
  } catch (error) {
    return { coupons: [], error: error.message };
  }
};

export { getAllCoupons, getShowingCoupons };
