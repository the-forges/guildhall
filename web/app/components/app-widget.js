export class AppWidget extends HTMLElement {
    attributes = [];
    observedCallbacks = {};

    constructor() {
        super();

        this.attachShadow({ mode: "open" });

        this.clear();
        this.preRender();
        this.render();
        this.postRender();
    }
    template() {
        return "<div>Template not implemeneted</div>";
    }
    clear() {
        if (this.shadowRoot.hasChildNodes()) {
            this.shadowRoot.innerHTML = "";
        }
    }
    preRender() {}
    render() {
        let t = document.createElement("template");
        t.innerHTML = this.template();
        this.shadowRoot.appendChild(t.content.cloneNode(true));
    }
    postRender() {}

    static get observedAttributes() {
        return this.attributes;
    }
    attributeChangedCallback(name, oldValue, newValue) {
        this.observedCallbacks[name](oldValue, newValue);
    }
}