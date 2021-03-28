const baseUrl = process.env.REACT_APP_URL;
function superFetch(url, options) {
  return fetch(baseUrl + "/" + url, options);
}

export default superFetch;
