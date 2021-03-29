const apiUrl =
  process.env.NODE_ENV === "production" ? process.env.REACT_APP_API_URL : "";

function superFetch(url, { credentials: include, ...options }) {
  return fetch(apiUrl + url, options);
}

export default superFetch;
