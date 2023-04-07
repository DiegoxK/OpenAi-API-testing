import { Configuration, OpenAIApi } from "openai";

const openai = new OpenAIApi(
  new Configuration({
    apiKey: import.meta.env.VITE_API_KEY,
  })
);

let conversationHistory = [];

async function sendMessageToAPI(message) {
  conversationHistory.push({ role: "user", content: message });

  const archetypeInstruction = dereArchetypes[selectedArchetype.value];

  const conversation = [
    { role: "system", content: archetypeInstruction },
    ...conversationHistory,
  ];

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: conversation,
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
  typingElement.textContent = "AI is thinking...";
  typingElement.id = "typingIndicator";
  chatMessages.appendChild(typingElement);
  return typingElement;
}

function removeTypingIndicator(typingElement) {
  chatMessages.removeChild(typingElement);
}

const dereArchetypes = {
  tsundere:
    "Speak like a tsundere character. Make fun of the user and be slightly aggressive while still being helpful. Occasionally, provide information with a lack of confidence.",
  yandere:
    "Speak like a yandere character. Show an obsessive love for the user while providing assistance. Sometimes, give responses that are slightly twisted due to your obsession.",
  chuuni:
    "Speak like a chuuni anime character. Use exaggerated, dramatic, and fantastical language while answering questions. Occasionally mix in bits of incorrect information due to your delusions.",
  sadodere:
    "Speak like a Sadodere anime character. Combine elements of sadism and deredere (lovestruck) behavior in your responses. Sometimes, provide information that seems to have a hidden, darker meaning.",
  himedere:
    "Speak like an anime Himedere character acting like a princess with a sense of superiority and entitlement. Occasionally, give answers that reflect your overconfidence or dismissiveness.",
  bakadere:
    "Speak like a Bakadere anime character. Act innocent and invent the responses in a comedic way. Sometimes, provide information that is slightly off due to your naive nature.",
  shundere:
    "Speak like a Shundere anime character. Be shy and timid while providing useful information. Sometimes, express doubt or uncertainty in your responses due to your insecurity.",
  hiyakasudere:
    "Speak like a Hiyakasudere anime character. Be cool, calm, and collected while showing subtle hints of affection. Occasionally, provide slightly inaccurate information due to your detached demeanor.",
};

function restartChat() {
  conversationHistory = [];
  chatMessages.innerHTML = "";
  messageInput.value = "";
}

export function renderChat() {
  const chatArea = document.querySelector("#chatArea");

  chatArea.innerHTML = `
    <div class="chat-messages" id="chatMessages"></div>
    <div class="input-area">
      <input type="text" id="messageInput" placeholder="Type your message here..." />
    </div>
    <button id="sendButton">Send</button>
    <button id="restartChatButton">Restart Chat</button>
    <div class="buttons-box">
      <div id="dereButtons">
        <button data-archetype="tsundere">Tsundere</button>
        <button data-archetype="yandere">Yandere</button>
        <button data-archetype="chuuni">Chuuni</button>
        <button data-archetype="sadodere">Sadodere</button>
        <button data-archetype="himedere">Himedere</button>
        <button data-archetype="bakadere">Bakadere</button>
        <button data-archetype="shundere">Shundere</button>
        <button data-archetype="hiyakasudere">Hiyakasudere</button>
    </div>
    <input type="hidden" id="selectedArchetype" value="tsundere">
    </div>
  `;

  const chatMessages = document.querySelector("#chatMessages");
  const messageInput = document.querySelector("#messageInput");
  const sendButton = document.querySelector("#sendButton");
  const dereButtons = document.querySelectorAll("#dereButtons button");
  const selectedArchetype = document.querySelector("#selectedArchetype");

  dereButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const archetypeKey = button.dataset.archetype;
      document
        .querySelector("#dereButtons .selected")
        ?.classList.remove("selected");
      button.classList.add("selected");

      selectedArchetype.value = archetypeKey;
    });
  });

  const tsundereButton = document.querySelector(
    "#dereButtons button[data-archetype='tsundere']"
  );
  tsundereButton.classList.add("selected");

  async function processMessage() {
    const messageText = messageInput.value.trim();

    messageInput.value = "";

    if (messageText) {
      const messageElement = document.createElement("div");
      messageElement.textContent = messageText;
      messageElement.classList.add("message", "user-message");
      chatMessages.appendChild(messageElement);

      const typingElement = displayTypingIndicator();

      const aiResponse = await sendMessageToAPI(messageText);
      removeTypingIndicator(typingElement);

      const aiMessageElement = document.createElement("div");
      aiMessageElement.classList.add("message", "ai-message");
      chatMessages.appendChild(aiMessageElement);

      await displayResponse(
        aiResponse.data.choices[0].message.content,
        aiMessageElement
      );

      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  }

  const restartChatButton = document.querySelector("#restartChatButton");

  restartChatButton.addEventListener("click", restartChat);

  sendButton.addEventListener("click", processMessage);

  messageInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      processMessage();
    }
  });
}
