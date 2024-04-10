class TopBar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.clear();
        this.render();
    }
    clear() {
        if (this.shadowRoot.hasChildNodes()) {
            this.shadowRoot.innerHTML = "";
        }
    }
    render() {
        this.shadowRoot.innerHTML=`
        <link rel="stylesheet" href="topbar/index.css" />
        <div id="topbar">
            <h1>Guild Hall</h1>
            <div id="deadspace"></div>
            <ul id="actions">
                <li>m3talsmith</li>
                <li><a href="#/logout">Log out</a></li>
            </ul>
        </div>
        `;
    }
}
customElements.define("app-topbar", TopBar);