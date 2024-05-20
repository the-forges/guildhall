import "./app/authenticated.js";
import "./app/top-menu";
import "./style.css";

document.querySelector("#app").innerHTML = `
  <div>
    <app-authenticated>
      <app-top-menu></app-top-menu>
      <h2>Authenticated</h2>
    </app-authenticated>
  </div>
`;