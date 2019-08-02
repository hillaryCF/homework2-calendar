class Component extends HTMLElement {
    get attrs () {
        let attrs = {};
        for(let i = 0; i < this.attributes.length; i++) {
            attrs[this.attributes[i].name] = this.attributes[i].value;
        }
        return attrs;
    }

    constructor (config) {
        super();

        // shadow dom
        this.attachShadow({mode: 'open'});
        // this.shadowRoot.appendChild(template.content.cloneNode(true));
        // this.shadowImage = this.shadowRoot.getElementById('image');

        this.template = new Template(config);
    }

    /**
     * Everytime element connects to the dom
     */
    connectedCallback () {
        this.template.render(this.attrs, this)
            .then(template => {
                this.shadowRoot.appendChild(template);
                return this._subTemplates();
            })
            .then(() => {
                if(typeof this.afterConnected === 'function')
                    this.afterConnected();
            });
    }

    async _subTemplates () {
        let templates = this.shadowRoot.querySelectorAll('template');
        this.templates = {};
        templates.forEach(t => {
            if(t.id) this.templates[t.id] = new Template({template: t.innerHTML})
        });
    }

    disconnectedCallback () {}

    /**
     * Every time an element att changes
     * @param name
     * @param oldVal
     * @param newVal
     */
    attributeChangedCallback (name, oldVal, newVal) {
        console.log('attributeChangedCallback', name, newVal);
        this[name] = newVal;
    }
};

const RegisterComponent = (name, component) => {
    const register = () => customElements.define(name, component);
    window.WebComponents ? window.WebComponents.waitFor(register) : register();
};