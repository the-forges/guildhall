import './authenticated.js';
import "./style.css";

document.querySelector("#app").innerHTML = `
  <div>
    <app-authenticated>
      <h2>Authenticated</h2>
      <button id="logout">Logout</button>
    </app-authenticated>
  </div>
`;

let logoutEvent = new Event("logout");
let el = document.querySelector("#logout");
el.addEventListener("click", (_) => window.dispatchEvent(logoutEvent));