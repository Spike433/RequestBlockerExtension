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

    const eventNameToBlock = "Lost focus";
    const eventNameToAllow = "Answer saved";

    const hasLostFocusEvent = requestBody.entries.some(
      (entry) => entry.eventName === eventNameToBlock
    );

    const hasAnswerSavedEvent = requestBody.entries.some(
      (entry) => entry.eventName === eventNameToAllow
    );

    if (hasLostFocusEvent && !hasAnswerSavedEvent) {
      // Block the request
      console.log("Event Blocker extension blocked the request.");
      console.log("Raw request body: " + JSON.stringify(requestBody));

      return { cancel: true };
    }

    const eventToAlsoFilter = "Got focus";
    requestBody.entries = requestBody.entries.filter(
      (entry) =>
        entry.eventName !== eventNameToBlock &&
        entry.eventName !== eventToAlsoFilter
    );

    const modifiedRequestBody = {
      ...requestBody,
    };

    // Convert the modified payload back to a string
    const modifiedPayloadString = JSON.stringify(modifiedRequestBody);

    // Set the modified payload in the request
    details.requestBody = {
      raw: [
        {
          bytes: new TextEncoder().encode(modifiedPayloadString),
        },
      ],
    };

    console.log("Event Blocker extension modified the request payload.");
    console.log("Modified request body: " + modifiedPayloadString);

    //not working
    return { requestBody: details.requestBody };
  },
  { urls: ["<all_urls>"] },
  ["blocking", "requestBody"]
);
