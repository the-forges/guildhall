const template = `
<template id="app-auth">
    <div id="unauthorized">
        <div id="register"></div>
        <div id="login"></div>    
    </div>
    <div id="authorized"><slot name="content"></slot></div>
</template>
`;
class Auth extends HTMLElement {
}
customElements.define("app-auth", Auth);