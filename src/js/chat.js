import { Configuration, OpenAIApi } from "openai";

const openai = new OpenAIApi(
  new Configuration({
    apiKey: import.meta.env.VITE_API_KEY,
  })
);

async function sendMessageToAPI(message) {
  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: message,
      },
    ],
  });
  return response;
}

export function renderChat() {
  const chatArea = document.querySelector("#chatArea");

  chatArea.innerHTML = `
    <div class="chat-messages" id="chatMessages"></div>
    <div class="input-area">
      <input type="text" id="messageInput" placeholder="Type your message here..." />
      <button id="sendButton">Send</button>
    </div>
  `;

  const chatMessages = document.querySelector("#chatMessages");
  const messageInput = document.querySelector("#messageInput");
  const sendButton = document.querySelector("#sendButton");

  sendButton.addEventListener("click", async () => {
    const messageText = messageInput.value.trim();

    if (messageText) {
      const messageElement = document.createElement("div");
      messageElement.textContent = `User: ${messageText}`;
      chatMessages.appendChild(messageElement);
      messageInput.value = "";

      const aiResponse = await sendMessageToAPI(messageText);
      const aiMessageElement = document.createElement("div");
      aiMessageElement.textContent = `AI: ${aiResponse.data.choices[0].message.content}`;
      chatMessages.appendChild(aiMessageElement);

      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  });
}
