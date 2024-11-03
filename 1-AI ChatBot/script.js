const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#enter");
const fileInput = document.querySelector("#file-input");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const fileCancelButton = document.querySelector("#file-cancel");
const chatBotToggler = document.querySelector(".chatbot-toggler");

// Mengasilkan response bot terhadap penggunaan API
const generateBotResponse = async (inComingMessageDiv) => {
  const messageElement = inComingMessageDiv.querySelector(".message-text");

  // Permintaan dari API
  const requestOption = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            { text: userData.message },
            ...(userData.file.data ? [{ inline_data: userData.file }] : []),
          ],
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
    const apiResponseText = data.candidates[0].content.parts[0].text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .trim();
    messageElement.innerText = apiResponseText;
    // Menampilkan jika ada error
  } catch (error) {
    messageElement.innerText = error.message;
    messageElement.style.color = "#ff0000";
    console.log(error);
    // Mengatur ulang masukkan user, agar isi sebelumnya di hapus
  } finally {
    userData.file = {};
    inComingMessageDiv.classList.remove("thinking");
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
  }
};

// API setup
const API_KEY = "AIzaSyCTT0zupLs0M9bsE3Jiiq9sUugTPdFItmM";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

const userData = {
  message: null,
  file: {
    data: null,
    mime_type: null,
  },
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
  fileUploadWrapper.classList.remove("file-uploaded");

  // Membuat tampilan pesan user
  const messageContent = `<div class="message-text">${userData.message}</div>
  ${
    userData.file.data
      ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />`
      : ""
  }`;

  outGoingMessageDiv = createMessage(messageContent, "user-message");
  outGoingMessageDiv.querySelector(".message-text").textContent =
    userData.message;
  chatBody.appendChild(outGoingMessageDiv);
  chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });

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
    chatBody.scrollTo({ top: chatBody.scrollHeight, behavior: "smooth" });
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

// Menangani pemilihan file dan tampilan sementara file
fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    fileUploadWrapper.querySelector("img").src = e.target.result;
    fileUploadWrapper.classList.add("file-uploaded");
    const base64String = e.target.result.split(",")[1];

    // Tempat file data user
    (userData.file = {
      data: base64String,
      mime_type: file.type,
    }),
      (fileInput.value = "");
  };

  reader.readAsDataURL(file);
});

fileCancelButton.addEventListener("click", () => {
  userData.file = {};
  fileUploadWrapper.classList.remove("file-uploaded");
});

// Inisialiasasi emoji picker
const picker = new EmojiMart.Picker({
  theme: "light",
  skinTonePosition: "none",
  previewPosition: "none",
  onEmojiSelect: (emoji) => {
    const { selectionStart: start, selectionEnd: end } = messageInput;
    messageInput.setRangeText(emoji.native, start, end, "end");
    messageInput.focus();
  },
  onClickOutside: (e) => {
    if (e.target.id === "emoji-picker") {
      document.body.classList.toggle("show-emoji-picker");
    } else {
      document.body.classList.remove("show-emoji-picker");
    }
  },
});

document.querySelector(".chat-form").appendChild(picker);

sendMessageButton.addEventListener("click", (e) => handleOutGoingMessage(e));

document
  .querySelector("#file-upload")
  .addEventListener("click", () => fileInput.click());
chatBotToggler.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot")
);
