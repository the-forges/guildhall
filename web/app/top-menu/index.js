import { AppWidget } from "../components/app-widget";
import "../components/menu";

export class TopMenu extends AppWidget {
    template() {
        return `
        <app-menu title="Guildhall">
            <div slot="trailing">
                <button id="logout">Logout</button>
            </div>
        </app-menu>
        `;
    }
    postRender() {
        let logoutEvent = new Event("logout");
        let el = this.shadowRoot.querySelector("#logout");
        el.addEventListener("click", (_) => window.dispatchEvent(logoutEvent));
    }
}
customElements.define("app-top-menu", TopMenu);