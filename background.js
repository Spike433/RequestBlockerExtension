// background.js

console.log("Event Blocker extension is starting...");

chrome.webRequest.onBeforeRequest.addListener(
  function (details) {
    // Check if the request contains the specified event name
    if (details.method === "POST" && details.requestBody) {
      const requestBody = JSON.parse(
        new TextDecoder().decode(details.requestBody.raw[0].bytes)
      );
      const eventName = "Lost focus";
      const eventDataToBlock = "Warning - student could be cheating (alt+tab)?";

      if (
        requestBody.entries.some(
          (entry) =>
            entry.eventName === eventName &&
            entry.eventData === eventDataToBlock
        )
      ) {
        // Block the request
        console.log("Event Blocker extension blocked the request.");
        return { cancel: true };
      }
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking", "requestBody"]
);
