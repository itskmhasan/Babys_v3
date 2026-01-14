"use server";

import { getHeaders } from "@lib/auth-server";
import { baseURL, handleResponse } from "@services/CommonService";
import { revalidatePath, revalidateTag } from "next/cache";

const getReviewsByProduct = async (productId) => {
  try {
    const response = await fetch(`${baseURL}/reviews/${productId}`, {
      cache: "no-cache",
      headers: await getHeaders(),
    });

    const reviews = await handleResponse(response);
    return { reviews, error: null, loading: false };
  } catch (error) {
    return { reviews: [], error: error.message, loading: false };
  }
};
const getUserPurchasedProducts = async ({ page, limit }) => {
  try {
    const response = await fetch(
      `${baseURL}/reviews/purchased-products?page=${page}&limit=${limit}`,
      {
        // cache: "force-cache",
        next: {
          revalidate: 60,
          tags: [`reviewed_products`],
        },
        headers: await getHeaders(),
      }
    );

    const reviews = await handleResponse(response);
    return { reviews, error: null, loading: false };
  } catch (error) {
    return { reviews: [], error: error.message, loading: false };
  }
};
const addReview = async (reviewData) => {
  try {
    const response = await fetch(`${baseURL}/reviews`, {
      cache: "no-cache",
      method: "POST",
      headers: await getHeaders(),
      body: JSON.stringify(reviewData),
    });

    // console.log("response", response);

    const review = await handleResponse(response);
    // revalidatePath(`/user/my-reviews`);
    revalidateTag("reviewed_products");
    revalidateTag("store_products");
    return { review, error: null, loading: false };
  } catch (error) {
    return { review: null, error: error.message, loading: false };
  }
};
const updateReview = async (reviewData) => {
  try {
    const response = await fetch(`${baseURL}/reviews`, {
      cache: "no-cache",
      method: "PUT",
      headers: await getHeaders(),
      body: JSON.stringify(reviewData),
    });

    const review = await handleResponse(response);
    revalidatePath(`/user/my-reviews`);
    return { review, error: null, loading: false };
  } catch (error) {
    return { review: null, error: error.message, loading: false };
  }
};

const deleteReview = async (reviewId) => {
  try {
    const response = await fetch(`${baseURL}/reviews/${reviewId}`, {
      headers: await getHeaders(),
      method: "DELETE",
    });

    const review = await handleResponse(response);
    return { review, error: null, loading: false };
  } catch (error) {
    return { review: null, error: error.message, loading: false };
  }
};

export {
  addReview,
  updateReview,
  deleteReview,
  getReviewsByProduct,
  getUserPurchasedProducts,
};
