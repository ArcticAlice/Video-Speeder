//creates a box with text (speed) inside injected into the youtube video
const box = document.createElement('div');
const text = document.createElement('p');

// adds styles from css file
box.classList.add('extensionContainer');
text.classList.add('extensionParagraph');

// access video elements on page
const video = document.querySelector('video');

box.appendChild(text);
document.body.appendChild(box);

// gets the size of video and then positions box within the video border
function positionOverlay() {
    if (!video) return;
    const rect = video.getBoundingClientRect();
    box.style.left = `${rect.left + window.scrollX + 50}px`;
    box.style.top = `${rect.top + window.scrollY + 50}px`;
}

//updates display of video
function updateSpeedDisplay() {
    if (!video) return;
    text.textContent = video.playbackRate.toFixed(2);
}

// updates text inside box
function set() {
    if (!video) return;
    text.innerHTML = video.playbackRate;
}

positionOverlay();
updateSpeedDisplay();

// Pressing A slows video will D speeds up video
window.addEventListener('keydown', (e) => {

    if (!video) return;

    if (e.code === 'KeyA') {
        e.preventDefault();
        video.playbackRate = Math.max(0.1, video.playbackRate - 0.10); // video speed doesn't go into negatives
        text.innerHTML = video.playbackRate.toFixed(2);
    }
    if (e.code === 'KeyD') {
        e.preventDefault();
        video.playbackRate += 0.10
        text.innerHTML = video.playbackRate.toFixed(2);
    }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "UPDATE_COLOR") {
        const update = message.color;
        box.style.borderColor = update;
        text.style.color = update;
    }
});

// Lets box be draggable within video border
let isDragging = false;
let offsetX = 0;
let offsetY = 0;

box.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isDragging = true;
    offsetX = e.clientX - box.getBoundingClientRect().left;
    offsetY = e.clientY - box.getBoundingClientRect().top;
    box.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;

    const videoRect = video.getBoundingClientRect();
    const boxRect = box.getBoundingClientRect();

    let newLeft = e.clientX - offsetX;
    let newTop = e.clientY - offsetY;

    if (newLeft < videoRect.left) {
        newLeft = videoRect.left;
    }
    if (newLeft + boxRect.width > videoRect.right) {
        newLeft = videoRect.right - boxRect.width;
    }

    if (newTop < videoRect.top) {
        newTop = videoRect.top;
    }
    if (newTop + boxRect.height > videoRect.bottom) {
        newTop = videoRect.bottom - boxRect.height;
    }

    box.style.left = `${newLeft}px`;
    box.style.top = `${newTop}px`;
});

document.addEventListener('mouseup', () => {
    isDragging = false;
    box.style.cursor = 'grab';
});
