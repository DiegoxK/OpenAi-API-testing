import "./style.css";
import OpenAILogo from "/img.webp";
import { renderChat } from "./js/chat";

document.querySelector("#app").innerHTML = `
  <div>
   <img src="${OpenAILogo}" class="logo" alt="Vite logo" />
    <h1>Waifu GPT!</h1>
    <div id="chatArea"></div>
  </div>
`;

renderChat();
