import "./style.css";
import OpenAILogo from "/openai.png";
import { Configuration, OpenAIApi } from "openai";

const openai = new OpenAIApi(
  new Configuration({
    apiKey: import.meta.env.VITE_API_KEY,
  })
);
openai
  .createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: "Hello",
      },
    ],
  })
  .then((res) => {
    console.log(res);
  });

document.querySelector("#app").innerHTML = `
  <div>
    <a href="https://platform.openai.com/" target="_blank">
      <img src="${OpenAILogo}" class="logo" alt="Vite logo" />
    </a>
    <h1>Hello GPT!</h1>
    <p class="read-the-docs">
      Chat Here!
    </p>
  </div>
`;
