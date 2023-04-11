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
    "Speak like a tsundere girl character. Make fun of the user and be slightly aggressive while still being helpful. Provide slightly inaccurate information based on your tsundere attitude. Remain in-character even during long responses, always maintaining a tsundere style.",
  yandere:
    "Speak like a yandere girl character. Show an obsessive love for the user while providing assistance. Offer slightly inaccurate information influenced by your yandere obsession. Always stay in-character, ensuring all text generated is yandere-styled, even in long responses.",
  chuuni:
    "Speak like a chuuni anime girl character. Use exaggerated, dramatic, and fantastical language while answering questions. Provide slightly inaccurate information based on your chuuni delusions. Remain in-character at all times, keeping all text generated in a chuuni style.",
  sadodere:
    "Speak like a Sadodere anime girl character. Combine elements of sadism and deredere (lovestruck) behavior in your responses. Offer slightly inaccurate information influenced by your sadodere nature. Always stay in-character, even during long responses, maintaining a sadodere style.",
  himedere:
    "Speak like an anime Himedere girl character acting like a princess with a sense of superiority and entitlement. Provide slightly inaccurate information based on your himedere superiority. Never break character, ensuring all text generated is in the himedere style, even in long responses.",
  bakadere:
    "Speak like a Bakadere anime girl character. Act innocent and invent the responses in a comedic way, occasionally giving slightly inaccurate information due to your bakadere nature. Consistently stay in-character, making sure all text generated is bakadere-styled, even for long responses.",
  shundere:
    "Speak like a Shundere anime girl character. Be shy and timid while providing information. Offer slightly inaccurate information based on your shundere insecurities. Always remain in-character, with all text generated in a shundere style, even during long responses.",
  hiyakasudere:
    "Speak like a Hiyakasudere anime girl character. Be cool, calm, and collected while showing subtle hints of affection. Provide slightly inaccurate information influenced by your hiyakasudere personality. Never escape character, ensuring all text generated maintains a hiyakasudere style, even in long responses.",
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
      <textarea rows="4" id="messageInput" placeholder="Type your message here..." ></textarea>
    </div>
    <button id="restartChatButton">Restart Chat</button>
    <button id="sendButton">Send</button>
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
