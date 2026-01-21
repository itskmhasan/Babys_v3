import axios from "axios";
import { getSession } from "next-auth/react";

// console.log("httpServices Base_URL:", process.env.NEXT_PUBLIC_API_BASE_URL);

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 50000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const setToken = (token) => {
  // console.log("token", token);
  if (token) {
    instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete instance.defaults.headers.common["Authorization"];
  }
};

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  isRefreshing = false;
  failedQueue = [];
};

// Response interceptor for handling token expiration
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is TOKEN_EXPIRED and we haven't already retried
    if (error.response?.status === 401 && error.response?.data?.code === "TOKEN_EXPIRED" && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = `Bearer ${token}`;
            return instance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Get current session to refresh token
        const session = await getSession();
        
        if (session?.user?.refreshToken) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/customer/refresh`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refreshToken: session.user.refreshToken }),
            }
          );

          const data = await response.json();

          if (response.ok && data.accessToken) {
            // Update NextAuth session with new token
            const event = new Event("token-refreshed");
            event.newToken = data.accessToken;
            window.dispatchEvent(event);

            // Set new token
            setToken(data.accessToken);
            originalRequest.headers["Authorization"] = `Bearer ${data.accessToken}`;
            
            processQueue(null, data.accessToken);
            return instance(originalRequest);
          } else {
            processQueue(new Error("Token refresh failed"), null);
            // Force logout
            window.location.href = "/auth/login";
          }
        } else {
          processQueue(new Error("No refresh token available"), null);
          window.location.href = "/auth/login";
        }
      } catch (refreshError) {
        console.error("Token refresh error:", refreshError);
        processQueue(refreshError, null);
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(error);
  }
);

const responseBody = (response) => response.data;

const requests = {
  get: (url, body) => instance.get(url, body).then(responseBody),
  post: (url, body, headers) =>
    instance.post(url, body, headers).then(responseBody),
  put: (url, body) => instance.put(url, body).then(responseBody),
};

export default requests;
