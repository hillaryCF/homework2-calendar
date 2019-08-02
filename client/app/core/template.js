class Template {
    static EVENTS = ['click'];

    constructor({template = null, templateURL = null, style = null, styleURL = ''}){
        this.template = template;
        this.templateURL = templateURL;
        this.style = style;
        this.styleURL = styleURL;
        this.templates = {};

        if(templateURL) this.fetchUrl();
        if(styleURL) this.fetchStyle()
    }

    fetchUrl () {
        if(this.template) return Promise.resolve(this.template);

        return fetch(this.templateURL)
            .then(response => response.text())
            .then(template => this.template = template);
    }

    fetchStyle () {
        if(!this.styleURL) return Promise.resolve(this.style);

        return fetch(this.styleURL)
            .then(response => response.text())
            .then(style => this.style = style);
    }

    async render (data = null, component = null) {
        let template = await this.fetchUrl();
        let style = await this.fetchStyle();

        let element = this.replace(template, data, component);

        // add the component style
        if(style) {
            let styleTag = document.createElement('style');
            styleTag.innerHTML = style;
            element.prepend(styleTag);
        }

        return element;
    }

    replace (template, data = null, component = null, events = Template.EVENTS) {
        if(!data && component) data = component.attrs;
        let element = this._templateElement(template);

        // replace values
        Object.keys(data)
            .forEach(k => element.innerHTML = element.innerHTML.replace(`{{${k}}}`, data[k]));

        // finds events
        let counter = 0;
        let eventsToAdd = events
            .map(name => {
                let regex = new RegExp(`\\(${name}\\)+="[^"]*"`, 'gim');
                let match = element.innerHTML.match(regex);
                if(!match) return null;

                let id = ++counter;
                let value = match[0].match(/"[^"]*/)[0]
                    .replace(/\"/, '');
                element.innerHTML = element.innerHTML.replace(regex, `${match[0]} data-event="${id}"`);
                return {name, value, id};
            })
            .filter(event => event);

        element = element.content.cloneNode(true);

        // add DOM events
        eventsToAdd
            .forEach(({name, value, id}) => {
                let items = element.querySelectorAll(`[data-event="${id}"]`);
                if(items) {
                    items.forEach(item => {
                        item.addEventListener(name, component[value].bind(component));
                        item.removeAttribute(`data-event`);
                    });
                }
            });

        return element;
    }

    _templateElement (template) {
        let element = document.createElement('template');
        element.innerHTML = template;

        // sub templates
        let templates = element.content.querySelectorAll('template');
        templates.forEach(t => {
            if(t.id) this.templates[t.id] = new Template({template: t.innerHTML});
            t.parentNode.removeChild(t);
        });

        return element;
    }
}