// background.js

console.log("Event Blocker extension is starting...");

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    // Check if the request is POST and has a request body
    if (!(details.method === "POST" && details.requestBody)) {
      console.log("Request is not a POST request or has no request body.");
      return;
    }

    const requestBody = JSON.parse(
      new TextDecoder().decode(details.requestBody.raw[0].bytes)
    );

    if (!(requestBody && requestBody.entries)) {
      console.log("Request body is empty.");
      return;
    }

    const eventName = "Lost focus";
    const eventDataToBlock = "Warning - student could be cheating (alt+tab)?";

    if (
      requestBody.entries.some(
        (entry) =>
          entry.eventName === eventName && entry.eventData === eventDataToBlock
      )
    ) {
      // Block the request
      console.log("Event Blocker extension blocked the request.");
      console.log("Raw request body: " + JSON.stringify(requestBody));

      return { cancel: true };
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking", "requestBody"]
);
