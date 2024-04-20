class TopBar extends HTMLElement {
    template = `
<style>
:host * {
    font-family: serif;
    font-size: 16px;
}
#topbar {
    display: flex;
    background-color: #262626;
    color: #FFFFFF;
    box-shadow: 0 3px 8px 0 rgba(0 ,0 , 0, 0.15);
}

h1 {
    font-size: 1em;
    margin: 1.5em 1em;
}

#deadspace {
    flex: 3;
}

ul {
    display: inline-block;
    margin: 1em;
}

ul li {
    display: inline-block;
    margin-left: 1em;
}

button {
    border: none;
    padding: 0.5em 1em;
    background-color: #262626;
    color: #FFFFFF;
    border-radius: 8px;
    box-shadow: 0 1px 2px 0 rgba(0 ,0 , 0, 0.05);
}

button:hover {
    transition: box-shadow 120ms ease-in-out;
    box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.3);
}

button.elevated {
    border: 1px;
    color: #262626;
    background-color: #FFFFFF;
}
</style>
<div id="topbar">
    <h1>Guild Hall</h1>
    <div id="deadspace"></div>
    <ul id="actions">
        <li><button><slot name="displayName">Anonymous</slot></button></li>
        <li><button id="logout" class="elevated">Log out</button></li>
    </ul>
</div>
`;
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
        t.innerHTML = this.template;
        this.shadowRoot.appendChild((t.content.cloneNode(true)));

        let logout = this.shadowRoot.getElementById("logout");
        logout.onclick = this.logout;
    }

    logout(_) {
        const event = new CustomEvent("logout", {});
        window.dispatchEvent(event);
    }
}
customElements.define("app-topbar", TopBar);