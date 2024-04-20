class Auth extends HTMLElement {
    user = {};
    authenticated = false;

    template = `
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
    <div id="authentication"></div>
</div>
<div id="authenticated" class="hidden"><slot></slot></div>
`;
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        window.addEventListener("logout", evt => this.logout());
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
        t.innerHTML = this.template;
        this.shadowRoot.appendChild(t.content.cloneNode(true));

        let authenticated = this.shadowRoot.getElementById("authenticated");
        let unauthenticated = this.shadowRoot.getElementById("unauthenticated");
        unauthenticated.classList.remove("hidden");

        this.loadAuthentication();

        if (!this.authenticated) {
            this.setupAuthentication();
        } else {
            authenticated.classList.remove("hidden");
            unauthenticated.classList.add("hidden");
        }
    }
    logout(_) {
        this.authenticated = false;
        this.user = {};
        localStorage.clear();
        this.clear();
        this.render();
    }
    loadAuthentication() {
        const user = localStorage.getItem("user");
        if (user && user !== "") {
            this.user = JSON.parse(user);
            this.authenticated = true;
        }
    }
    async setupAuthentication() {
        const response = await fetch('/api/preauth');
        const env = await response.json();
        const url = window.location.href+"api";
        let authentication = this.shadowRoot.getElementById("authentication");

        new QRCode(authentication, url+"/authenticate/"+env.code);

        let pollId = setInterval(async () => {
            const user = await this.checkAuthentication(url, env.code);
            if (user) {
                this.saveAuthentication(user);
                clearInterval(pollId)
                pollId = null;
            }
        }, 100)
    }
    saveAuthentication(user) {
        localStorage.setItem("user", JSON.stringify(user));
        this.setAttribute("authenticated", "true");
    }
    async checkAuthentication(url, code){
        const response = await fetch(url+"/authenticated/"+code);
        const json = await response.json();
        return json.user;
    }
    static get observedAttributes() {
        return ['authenticated'];
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.authenticated = true;
        this.render();
    }
}
customElements.define("app-auth", Auth);