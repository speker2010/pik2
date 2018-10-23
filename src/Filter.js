export default class Filter {
    constructor(users) {
        this.users = users;
    }

    setFilter(searchString) {
        searchString = searchString.trim();
        this.filters = searchString.toLowerCase().split(' ');
    }

    filter() {
        let filterItem = this.filterItem.bind(this);
       return this.users.filter(filterItem);
    }

    filterItem(elem) {
        if (this.filters.length === 0) return true;
        let filters = this.filters;
        for (let i = 0; i < filters.length; i++) {
            let item = filters[i];
            if (item.length === 0) return true;
            let regexpSubstr = /^\*/;
            let regexp;
            if (!regexpSubstr.test(item)) {
                regexp = new RegExp('^' + item);
            } else {
                item = item.replace(/\*/, '');
                regexp = new RegExp(item);
            }
            if (regexp.test(elem.name.toLowerCase())) return true;
        }
        console.log('item');
        return false;
    }

    result() {
        console.log(this.usersFiltered);
    }
}