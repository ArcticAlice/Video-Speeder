const circles = document.getElementsByClassName('circle');

// Adds an event listener to each of the circles
for (let circle of circles) {
  circle.addEventListener('click', () => {
    const style = window.getComputedStyle(circle);
    const color = style.backgroundColor;

    // Send the selected color to the content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { type: "UPDATE_COLOR", color });
    });
  });
}
