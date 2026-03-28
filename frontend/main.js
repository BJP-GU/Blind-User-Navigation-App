// --- Main Application Logic ---

const statusDiv = document.getElementById("status");
const authSection = document.getElementById("auth-section");
const appSection = document.getElementById("app-section");
const sessionEndSection = document.getElementById("session-end-section");
const restartBtn = document.getElementById("restartBtn");
const disconnectBtn = document.getElementById("disconnectBtn");
const videoPreview = document.getElementById("video-preview");
const videoPlaceholder = document.getElementById("video-placeholder");
const connectBtn = document.getElementById("connectBtn");
let lastError = null;
let wasConnected = false;

const mediaHandler = new MediaHandler();
const geminiClient = new GeminiClient({
  onOpen: () => {
    wasConnected = true;
    statusDiv.textContent = "Connected";
    statusDiv.className = "status connected";
    authSection.classList.add("hidden");
    appSection.classList.remove("hidden");
    lastError = null;

    (async () => {
      try {
        await mediaHandler.startAudio((data) => {
          if (geminiClient.isConnected()) {
            geminiClient.send(data);
          }
        });
      } catch (e) {
        console.error("Could not auto-start microphone:", e);
      }

      try {
        await mediaHandler.startVideo(videoPreview, (base64Data) => {
          if (geminiClient.isConnected()) {
            geminiClient.sendImage(base64Data);
          }
        });
        videoPlaceholder.classList.add("hidden");
      } catch (e) {
        console.error("Could not auto-start camera:", e);
      }
    })();

    geminiClient.sendText(
      `System: As your initial message, say exactly:
"Hello! I'll help you navigate to your vehicle using your phones camera. I'll communicate using voice to indicate when an object is detected in your path.

Hold your phone at chest level and such that the back camera is facing directly infront of your path."`
    );
  },
  onMessage: (event) => {
    if (typeof event.data === "string") {
      try {
        const msg = JSON.parse(event.data);
        handleJsonMessage(msg);
      } catch (e) {
        console.error("Parse error:", e);
      }
    } else {
      mediaHandler.playAudio(event.data);
    }
  },
  onClose: (e) => {
    console.log("WS Closed:", e);
    if (wasConnected) {
      statusDiv.textContent = "Disconnected";
      statusDiv.className = "status disconnected";
      showSessionEnd();
    } else {
      statusDiv.textContent = "Could not connect to server";
      statusDiv.className = "status error";
      connectBtn.disabled = false;
    }
    wasConnected = false;
  },
  onError: (e) => {
    console.error("WS Error:", e);
    if (!wasConnected) {
      lastError = "Could not connect to server. Is the backend running?";
    }
  },
});

function handleJsonMessage(msg) {
  if (msg.type === "error") {
    const detail = msg.error || "Unknown error";
    lastError = detail;
    statusDiv.textContent = "Error";
    statusDiv.className = "status error";
    return;
  }
  if (msg.type === "interrupted") {
    mediaHandler.stopAudioPlayback();
  }
}

// Connect Button Handler
connectBtn.onclick = async () => {
  statusDiv.textContent = "Connecting...";
  connectBtn.disabled = true;

  try {
    // Initialize audio context on user gesture
    await mediaHandler.initializeAudio();

    geminiClient.connect();
  } catch (error) {
    console.error("Connection error:", error);
    statusDiv.textContent = "Connection Failed: " + error.message;
    statusDiv.className = "status error";
    connectBtn.disabled = false;
  }
};

// UI Controls
disconnectBtn.onclick = () => {
  geminiClient.disconnect();
};

function resetUI() {
  authSection.classList.remove("hidden");
  appSection.classList.add("hidden");
  sessionEndSection.classList.add("hidden");

  lastError = null;
  const errorDetail = sessionEndSection.querySelector(".error-detail");
  if (errorDetail) errorDetail.remove();
  const heading = sessionEndSection.querySelector("h2");
  if (heading) heading.textContent = "Session Ended";

  mediaHandler.stopAudio();
  mediaHandler.stopVideo(videoPreview);
  videoPlaceholder.classList.remove("hidden");

  connectBtn.disabled = false;
}

function showSessionEnd() {
  authSection.classList.add("hidden");
  appSection.classList.add("hidden");
  sessionEndSection.classList.remove("hidden");

  const heading = sessionEndSection.querySelector("h2");
  let errorDetail = sessionEndSection.querySelector(".error-detail");

  if (lastError) {
    heading.textContent = "Session Error";
    if (!errorDetail) {
      errorDetail = document.createElement("p");
      errorDetail.className = "error-detail";
      errorDetail.style.cssText =
        "color: #c62828; background: #ffebee; padding: 12px; border-radius: 6px; margin: 10px 0; word-break: break-word;";
      heading.after(errorDetail);
    }
    errorDetail.textContent = lastError;
  } else {
    heading.textContent = "Session Ended";
    if (errorDetail) errorDetail.remove();
  }

  mediaHandler.stopAudio();
  mediaHandler.stopVideo(videoPreview);
}

restartBtn.onclick = () => {
  resetUI();
};
