const style = `
:host {
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background-color: #A6CFD5;
    color: #FFFEFF;
    box-shadow: 0 1px 2px 0 rgba(0 ,0 , 0, 0.05);
    margin: 1em;
}

button {
    border: none;
    background-color: white;
    margin: 1em;
    padding: 1em;
    border-radius: 8px;
    box-shadow: 0 1px 2px 0 rgba(0 ,0 , 0, 0.05);
}

button:hover {
    transition: box-shadow 120ms ease-in-out;
    box-shadow: 0 3px 8px 0 rgba(0, 0, 0, 0.3);
}

button.primary {
    background-color: #CA61C3;
}

button.secondary {
    background-color: #EE85B5;
}

span {
    display: inline-block;
    flex: 3;
    padding: 1em;
    text-align: center;
}
`;
class Index extends HTMLElement {
    static get observedAttributes() {
        return ['current-count'];
    }

    count = 0;
    node = [];
    constructor() {
        super();
        this.attachShadow({mode: "open"});
        this.clear();
        this.render();
    }

    increment() {
        this.count++;
        this.setAttribute('current-count', `${this.count}`);
    }

    decrement() {
        this.count--;
        this.setAttribute('current-count', `${this.count}`);
    }

    clear() {
        if (this.shadowRoot.hasChildNodes()) {
            this.shadowRoot.innerHTML = '';
        }
    }
    render() {
        this.clear();
        this.count = this.getAttribute('current-count') || 0;

        let sheet = document.createElement("style");
        sheet.innerText=style;
        this.shadowRoot.appendChild(sheet);

        let decBtn = document.createElement("button");
        decBtn.onclick=(e) => this.decrement();
        decBtn.innerText="-1";
        decBtn.classList.add("secondary");
        this.shadowRoot.appendChild(decBtn);

        let content = document.createElement("span");
        content.innerText=`Count is ${this.count}`;
        this.shadowRoot.appendChild(content);

        let incBtn = document.createElement("button");
        incBtn.onclick=(e) => this.increment();
        incBtn.innerText="+1";
        incBtn.classList.add("primary");
        this.shadowRoot.appendChild(incBtn);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        this.render();
    }
}
customElements.define('counter-app', Index);