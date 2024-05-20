import { AppWidget } from "../app-widget";

class AppMenu extends AppWidget {
    title = "";
    observedCallbacks = {
        'title': (oldValue, newValue) =>{
            this.title = newValue;
        }
    }
    constructor() {
        super();
    }
    template() {
        return `
            <style>
                .menu-bar {
                    display: flex;
                    align-items: center;
                    height: 2rem;
                    padding: 1em;
                    margin: -2rem;

                    div {
                        display: flex-item;
                    }

                    ::slotted(*) #logout {
                        padding: 2rem;
                    }

                    .menu-expanded {
                        flex: 3;
                    }
                }
            </style>
            <div class="menu-bar">
                <div class="menu-leading"><slot name="leading"></slot></div>
                <div class="menu-title">${this.title}</div>
                <div class="menu-expanded"></div>
                <div class="menu-trailing"><slot name="trailing"></slot></div>
            </div>
        `;
    }
}
customElements.define("app-menu", AppMenu);