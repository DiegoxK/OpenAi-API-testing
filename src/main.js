import "./style.css";
import OpenAILogo from "/openai.png";
import { renderChat } from "./js/chat";

document.querySelector("#app").innerHTML = `
  <div>
    <a href="https://platform.openai.com/" target="_blank">
      <img src="${OpenAILogo}" class="logo" alt="Vite logo" />
    </a>
    <h1>Hello GPT!</h1>
    <div id="chatArea"></div>
  </div>
`;

renderChat();
