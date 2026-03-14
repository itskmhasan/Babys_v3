const baseURL = `${process.env.NEXT_PUBLIC_API_BASE_URL}`;
const RETRYABLE_STATUSES = new Set([429, 502, 503, 504]);
const PUBLIC_FETCH_OPTIONS = {
  next: { revalidate: 300 },
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const fetchWithRetry = async (url, options = {}, retries = 2) => {
  let response;

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    response = await fetch(url, options);

    if (!RETRYABLE_STATUSES.has(response.status) || attempt === retries) {
      return response;
    }

    await sleep(250 * (attempt + 1));
  }

  return response;
};

// console.log("baseUrl", baseURL);

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();

    throw new Error(error.message || "Failed to fetch data");
  }

  return response.json();
};

export { baseURL, handleResponse, fetchWithRetry, PUBLIC_FETCH_OPTIONS };
