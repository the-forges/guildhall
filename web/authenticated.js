import QRCode from 'qrcode';

class Authenticated extends HTMLElement {
    sessionId = null;
    user = null;
    authenticated = false;

    constructor() {
        super();
        this.attachShadow({ mode: "open" });
        window.addEventListener("logout", (evt) => this.logout());
        this.clear();
        this.render();
    }
    clear() {
        if (this.shadowRoot.hasChildNodes()) {
            this.shadowRoot.innerHTML = "";
        }
    }
    render() {
        let t = document.createElement("template");
        t.innerHTML = `
        <style>
        .hidden {
            display: none;
        }
        #unauthenticated {
            margin: 0;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            text-align: center;
        }
        </style>
        <div id="unauthenticated" class="hidden">
            <h1>Guildhall Login</h1>
            <p>Please scan your passport</p>
            <canvas id="authentication"></canvas>
            <p>Session ID: <span id="sessionId"></span></p>
        </div>
        <div id="authenticated" class="hidden"><slot></slot></div>
        `;
        this.shadowRoot.appendChild(t.content.cloneNode(true));

        let authenticated = this.shadowRoot.querySelector("#authenticated");
        let unauthenticated = this.shadowRoot.querySelector("#unauthenticated");
        unauthenticated.classList.remove("hidden");

        this.loadAuthentication();

        if (!this.authenticated) {
            this.setupAuthentication().then(() => {
                let el = this.shadowRoot.querySelector("#sessionId");
                el.innerHTML=this.sessionId;
            });

        } else {
            authenticated.classList.remove("hidden");
            unauthenticated.classList.add("hidden");
        }
    }
    logout(_) {
        this.authenticated = false;
        this.sessionId = null;
        this.user = null;
        localStorage.clear();
        this.clear();
        this.render();
    }
    loadAuthentication() {
        const user = localStorage.getItem("user");
        if (user && user !== "") {
            this.user = JSON.parse(user);
        }
        const sessionId = localStorage.getItem("sessionId");
        if (sessionId && sessionId !== "") {
            this.sessionId = sessionId;
            this.authenticated = true;
        }
    }
    saveAuthentication() {
        localStorage.setItem("sessionId", this.sessionId);
        localStorage.setItem("user", JSON.stringify(this.user));
        this.setAttribute("authenticated", "true");
    }
    async setupAuthentication() {
        const response = await fetch('/api/preauth');
        const data = await response.json();

        this.sessionId = data.challenge;
        const url = window.location.href+"api/";
        let authentication = this.shadowRoot.querySelector("#authentication");
        QRCode.toCanvas(authentication, `${url}authenticate/${data.challenge}`)
        console.log(`${url}authenticate/${data.challenge}`);

        let timer = setInterval(async () => {
            console.log(`${url}authenticated/${data.challenge}`);
            const res = await fetch(`${url}authenticated/${data.challenge}`);
            let body = await res.json();
            if (body.user) {
                this.sessionId = body.challenge;
                this.user = body.user;
                this.saveAuthentication();
                clearInterval(timer);
                timer = null;
            }
        }, 10000);
    }
    static get observedAttributes() {
        return ['authenticated'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.authenticated = true;
        this.render();
    }
}
customElements.define("app-authenticated", Authenticated);