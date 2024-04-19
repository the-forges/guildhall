var template = `
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
    margin: 2em;
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
    border-right: 1px solid white;
    padding-left: 1em;
    padding-right: 1em;
}

ul li:last-child {
    border-right: none;
    padding-right: 0;
}

button {
    border: none;
    padding: 1em;
    border-radius: 8px;
    box-shadow: 0 1px 2px 0 rgba(0 ,0 , 0, 0.05);
}

button:hover {
    transition: box-shadow 120ms ease-in-out;
    box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.3);
}
</style>
<div id="topbar">
    <h1>Guild Hall</h1>
    <div id="deadspace"></div>
    <ul id="actions">
        <li><slot name="displayName">Anonymous</slot></li>
        <li><button id="topbar-logout">Log out</button></li>
    </ul>
</div>
`;

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
        let t = document.createElement("template");
        t.innerHTML = template;
        this.shadowRoot.appendChild((t.content.cloneNode(true)));
    }
}
customElements.define("app-topbar", TopBar);