class Api {
    constructor (url, config = {}) {
        this._url = url;
        this.url = new URL(url);

        this.sortBy = config.sortBy || null;
        this.sortOrder = config.sortOrder || null;
        this.page = config.page || null;
        this.pageItems = config.pageItems || null;
        this.search = config.search || null;
    }

    fetch (url, config = {}) {
        return fetch(url, config)
            .then(response => response.json());
    }

    getAll () {
        let url = new URL(this._url);
        ['sortBy', 'sortOrder', 'page', 'pageItems', 'search']
            .forEach(param => this[param] ? url.searchParams.set(param, this[param]) : '');
        return this.fetch(url.toString())
    }

    async getOne(id = null) {
        if(!id) throw new Error(`Invalid id`);
        let url = new URL(this.url.toString());
        url.pathname += `/id=${id}`;
        return this.fetch(url.toString());
    }

    createOne (data) {

    }
}