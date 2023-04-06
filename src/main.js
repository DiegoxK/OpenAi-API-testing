import "./style.css";
import javascriptLogo from "/javascript.svg";
import viteLogo from "/vite.svg";
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
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite!</h1>
    <p class="read-the-docs">
      aaaaaaaaa
    </p>
  </div>
`;
