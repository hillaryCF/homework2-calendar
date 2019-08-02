(function (config){
    const API_URL = 'http://localhost:3000/api/v1/cars';
    class NavbarComponent extends Component {
        constructor() {
            super(config);

            this.api = new Api(API_URL, {
                sortBy: 'name',
                sortOrder: 'dec',
                page: 1
            });
        }

        afterConnected () {
            this.getAll();
        }

        getAll () {
            let template = this.template.templates.car;
            this.api.getAll()
                .then(cars =>
                    Promise.all(cars.data
                        .map(car => template.render(car, this))
                    )
                )
                .then(items => {
                    let tboby = this.shadowRoot.querySelector('tbody');
                    tboby.innerHTML = '';
                    items.forEach(item => tboby.appendChild(item));
                });
        }

        edit (event) {
            console.log('edit', event);
        }

        sort (event) {
            let sortBy = event.target.getAttribute('data-sort');
            console.log('sort', sortBy);
            if(this.api.sortBy !== sortBy) {
                this.api.sortBy = sortBy;
                this.api.sortOrder = 'asc';
            }else {
                this.api.sortOrder = 'desc';
            }
            this.getAll();
        }
    }
    RegisterComponent(config.component, NavbarComponent);
})({
    component: 'car-list',
    templateURL: 'app/cars/cars.template.html',
    styleURL: 'app/cars/cars.css',
});