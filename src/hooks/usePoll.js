import { useEffect } from "react";

export default function usePoll(url, delay) {
  useEffect(() => {
    const pollIntervalId = setInterval(function () {
      fetch(url)
        .then((response) => response.text())
        .then((text) => console.log("poll result: " + text));
    }, delay);

    return function cleanup() {
      clearInterval(pollIntervalId);
    };
  }, []);

  return undefined;
}
