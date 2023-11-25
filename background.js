// background.js

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    // Check if the request contains the specified event name
    if (
      details.method === "POST" &&
      details.url === "https://edgar.fer.hr/exam/run/1" &&
      details.requestBody
    ) {
      const requestBody = JSON.parse(
        new TextDecoder().decode(details.requestBody.raw[0].bytes)
      );
      const eventName = "Lost focus";

      if (requestBody.entries.some((entry) => entry.eventName === eventName)) {
        // Block the request
        return { cancel: true };
      }
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking", "requestBody"]
);