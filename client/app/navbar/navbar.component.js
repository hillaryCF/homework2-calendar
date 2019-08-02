(function (config){
    class NavbarComponent extends Component {
        constructor() {
            super(config);

            this.menu = ['Menu 1', 'Menu 2'];
        }

        afterConnected () {
            let menu = this.shadowRoot.querySelector('ul');
            let template = this.template.templates.menuItem;

            Promise.all(this.menu.map(item => template.render({item})))
                .then(items => items.forEach(item => menu.appendChild(item)))
                .catch(err => console.error(err));
        }
    }
    RegisterComponent(config.component, NavbarComponent);
})({
    component: 'car-navbar',
    templateURL: 'app/navbar/navbar.template.html',
    styleURL: 'app/navbar/navbar.css',
});