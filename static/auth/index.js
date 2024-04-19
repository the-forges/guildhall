var template = `
<style>
.hidden {
    display: none;
}
.visible {
    display: inherit;
}
#authentication {
    margin: 0;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>
<div id="unauthenticated" class="visible">
    <div id="authentication"></div>
</div>
<div id="authenticated" class="hidden"><slot></slot></div>
`;

class Auth extends HTMLElement {
    user = {};
    authenticated = false;
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
        let t = document.createElement("template");
        t.innerHTML = template;
        this.shadowRoot.appendChild(t.content.cloneNode(true));

        this.loadAuthentication();

        if (!this.authenticated) {
            this.setupAuthentication();
        } else {
            let authenticated = this.shadowRoot.getElementById("authenticated");
            authenticated.classList.replace("hidden", "visible");

            let unauthenticated = this.shadowRoot.getElementById("unauthenticated");
            unauthenticated.classList.replace("visible", "hidden");
        }
    }
    loadAuthentication() {
        const user = localStorage.getItem("user");
        console.log(user)
        if (user && user !== "") {
            this.user = JSON.parse(user);
            this.authenticated = true;
        }
    }
    async setupAuthentication() {
        const response = await fetch('/api/preauth');
        const env = await response.json();
        const url = window.location.href+"api";
        console.log(url);

        let authentication = this.shadowRoot.getElementById("authentication");
        new QRCode(authentication, url+"/authenticate/"+env.code);

        let pollId = setInterval(async () => {
            const user = await this.checkAuthentication(url, env.code);
            if (user) {
                this.saveAuthentication(user);
                clearInterval(pollId)
                pollId = null;
            }
        }, 10000)
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