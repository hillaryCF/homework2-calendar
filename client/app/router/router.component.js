(function(config) {
    class RouterComponent extends Component {
        constructor () {
            super(config);
        }

        afterConnected () {
            this.shadowRoot.appendChild(document.createElement('car-list'));
        }
    };
    RegisterComponent(config.component, RouterComponent);
})({
    component: 'car-router',
    templateURL: 'app/router/router.template.html',
    styleURL: 'app/router/router.css',
});