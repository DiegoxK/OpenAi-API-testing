import { Configuration, OpenAIApi } from "openai";

const openai = new OpenAIApi(
  new Configuration({
    apiKey: import.meta.env.VITE_API_KEY,
  })
);

let conversationHistory = [];

async function sendMessageToAPI(message) {
  conversationHistory.push({ role: "user", content: message });

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: conversationHistory,
  });

  conversationHistory.push({
    role: "assistant",
    content: response.data.choices[0].message.content,
  });

  return response;
}

async function displayResponse(response, targetElement) {
  let currentIndex = 0;

  function displayNextCharacter() {
    if (currentIndex < response.length) {
      targetElement.textContent += response.charAt(currentIndex);
      currentIndex++;
      setTimeout(displayNextCharacter, 35);
    }
  }

  displayNextCharacter();
}

function displayTypingIndicator() {
  const typingElement = document.createElement("div");
  typingElement.textContent = "AI is typing...";
  typingElement.id = "typingIndicator";
  chatMessages.appendChild(typingElement);
  return typingElement;
}

function removeTypingIndicator(typingElement) {
  chatMessages.removeChild(typingElement);
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

  async function processMessage() {
    const messageText = messageInput.value.trim();

    if (messageText) {
      const messageElement = document.createElement("div");
      messageElement.textContent = `User: ${messageText}`;
      chatMessages.appendChild(messageElement);
      messageInput.value = "";

      const typingElement = displayTypingIndicator();

      const aiResponse = await sendMessageToAPI(messageText);
      removeTypingIndicator(typingElement);

      const aiMessageElement = document.createElement("div");
      chatMessages.appendChild(aiMessageElement);

      await displayResponse(
        `AI: ${aiResponse.data.choices[0].message.content}`,
        aiMessageElement
      );

      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  sendButton.addEventListener("click", processMessage);

  messageInput.addEventListener("keydown", (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();
      processMessage();
    }
  });
}
