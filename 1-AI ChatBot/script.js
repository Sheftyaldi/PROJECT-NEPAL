const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.getElementById("enter");

// Mengasilkan response bot terhadap penggunaan API
const generateBotResponse = async (inComingMessageDiv) => {
  const massageElement = inComingMessageDiv.querySelector(".message-text");

  const requestOption = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: userData.message }],
        },
      ],
    }),
  };

  try {
    // Fetch bot dari API
    const response = await fetch(API_URL, requestOption);
    const data = await response.json();
    if (!response.ok) throw new Error(data.error.message);

    // Mengambil jawaban Bot dalam bentuk text
    const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
    messageElement.innerText = apiResponseText;
} catch (error) {
      messageElement.innerText = error.message;
      messageElement.style.color = "#ff0000";
    console.log(error);
  } finally {
    inComingMessageDiv.classList.remove("thinking");
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth"});   
  }
};

// API setup
const API_KEY = "AIzaSyCTT0zupLs0M9bsE3Jiiq9sUugTPdFItmM";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

const userData = {
  message: null,
};

// Membuat element pesan yang dynamic dan mengembalikan nilainya
const createMessage = (content, ...classes) => {
  const div = document.createElement("div");
  div.classList.add("message", ...classes);
  div.innerHTML = content;
  return div;
};

// Menampilkan pesan user
const handleOutGoingMessage = (e) => {
  e.preventDefault();
  userData.message = messageInput.value.trim();
  messageInput.value = "";
  // Membuat tampilan pesan user
  const messageContent = `<div class="message-text">${userData.message}</div>`;

  outGoingMessageDiv = createMessage(messageContent, "user-message");
  outGoingMessageDiv.querySelector(".message-text").textContent = userData.message;
  chatBody.appendChild(outGoingMessageDiv);
  chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth"});

  // Percobaan animasi prosesing bot
  setTimeout(() => {
    const messageContent = `<div class="message bot-message thinking">
    <span class="material-symbols-rounded"> smart_toy </span>
    <div class="message-text">
      <div class="thinking-indikator">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    </div>
  </div>`;

    inComingMessageDiv = createMessage(
      messageContent,
      "bot-message",
      "thinking"
    );
    chatBody.appendChild(inComingMessageDiv);
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth"});
    generateBotResponse(inComingMessageDiv);
  }, 600);
};

// Untuk dapat isi pesan saat di enter
messageInput.addEventListener("keydown", (e) => {
  const userMessage = e.target.value.trim();
  if (e.key === "Enter" && userMessage) {
    handleOutGoingMessage(e);
  }
});

sendMessageButton.addEventListener("click", (e) => {
  handleOutGoingMessage(e);
});
