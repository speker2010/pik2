import User from './User.js';
import Filter from './Filter.js';
import * as Sort from './SortWorker';
import DragnDrop from './DragnDrop';
import './scss/users.scss';

export default class Users {
    get headers() {
        return [
            {
                name: 'name',
                sort: Sort.SortWorkerName,
                text: 'пользователь'
            },
            {
                name: 'rating',
                sort: Sort.SortWorkerRating,
                text: 'рейтинг'
            },
            {
                name: 'posts',
                sort: Sort.SortWorkerPosts,
                text: 'постов'
            },
            {
                name: 'comments',
                sort: Sort.SortWorkerComments,
                text: 'комментов'
            },
            {
                name: 'date',
                sort: Sort.SortWorkerDate,
                text: 'зарегистрировался'
            }
        ]
    }

    constructor(usersData) {
        this.users = usersData.map((item, i, arr) => {
            return new User(item);
        });

        this.filter = new Filter(this.users);
        this.filter.setFilter('');
        this.removedUser = [];
        this.isCtrl = false;
        window.addEventListener('keydown', (e)=>{
            if (e.keyCode === 17) this.isCtrl = true;
        });
        window.addEventListener('keyup', (e)=>{
            if (e.keyCode === 17) this.isCtrl = false;
        });
        this.initHtml();
        this.show();
    }

    initHtml() {
        let mainElement = document.createElement('div');
        mainElement.classList.add('main');

        let top = this.createTop();
        mainElement.appendChild(top);

        let table = this.createTable();

        mainElement.appendChild(table);
        this.mainElement = mainElement;
        document.body.appendChild(mainElement);
    }

    createTable() {
        let table = document.createElement('table');
        table.classList.add('users');
        table.addEventListener('click', (e) => {
            this.clickHandler(e);

        });
        let cols = this.createCols();
        table.appendChild(cols);

        let tableHeader = this.createHeaders();
        table.appendChild(tableHeader);

        let tBody = this.createTbody();

        table.appendChild(tBody);

        return table;
    }

    createTbody() {
        let tBody = document.createElement('tbody');
        this.dragnDrop = new DragnDrop({
            container: tBody
        });
        this.container = tBody;
        return tBody;
    }

    createHeaders() {
        let tableHeader = document.createElement('tr');

        let fragment = document.createDocumentFragment();
        this.headers.forEach((item, i, arr) => {
            let th = document.createElement('th');
            th.innerHTML = item.text;
            th.sortWorker = item.sort;
            fragment.appendChild(th);
        });
        let emptyTh = document.createElement('th');
        fragment.appendChild(emptyTh);
        tableHeader.appendChild(fragment);
        return tableHeader;
    }

    createCols() {
        let fragment = document.createDocumentFragment();
        for (let i = 0;i <= this.headers.length; i++) {
            let col = document.createElement('col');
            fragment.appendChild(col);
        }
        return fragment;
    }

    createTop() {
        let top = document.createElement('div');
        top.classList.add('main__top');

        let close = document.createElement('div');
        close.classList.add('main__clear');
        close.innerHTML = 'X';
        top.appendChild(close);

        let searchInput = document.createElement('input');
        searchInput.classList.add('main__input');
        searchInput.setAttribute('placeholder','поиск');
        searchInput.addEventListener('keyup', () => {
            this.setFilterQuery(searchInput.value);
        });

        close.addEventListener('click', () => {
            searchInput.value = '';
            this.setFilterQuery('');
        });

        top.appendChild(searchInput);
        return top;
    }

    clickHandler(e) {
        this.userDeleteHandler(e);
        this.changeSortHandler(e);
    }

    userDeleteHandler(e) {
        if (this.isCtrl === true && e.target.parentNode.userModel) {
            e.target.parentNode.remove();
            this.removedUser.push(e.target.parentNode.userModel);
        }
    }

    changeSortHandler(e) {
        if (e.target.sortWorker) {
            let index = [].indexOf.call(e.target.parentNode.children, e.target);

            this.setSortWorker(e.target);
            this.indicateColSort(index);
            this.show();
        }
    }

    setFilterQuery(string) {
        this.filter.setFilter(string);
        this.removedUser = [];
        this.show();
    }

    indicateColSort(index) {
        if (!this.colsList) {
            this.colsList = this.mainElement.getElementsByTagName('col');
        }
        if (!this.thList) {
            this.thList = this.mainElement.getElementsByTagName('th');
        }
        [].forEach.call(this.colsList, (item, i) => {
            item.classList.remove('sorted');
            if (i === index && this.sort) {
                item.classList.add('sorted');
            }
        });
        [].forEach.call(this.thList, (item, i) => {
            item.classList.remove('sorted');
            if (i === index && this.sort) {
                item.classList.add('sorted');
            }
        });
    }

    setSortWorker(elem) {
        let newSort = new elem.sortWorker;
        if (!this.sort) {

            this.sort = newSort;
        } else if (this.sort.name !== newSort.name) {

            this.sort = newSort;
        } else if (!this.sort.isNegative()) {
            this.sort.invert();
        } else {
            this.sort = undefined;
        }
    }

    show() {
        let usersList = this.filter.filter();
        this.removedUser.map((item) => {
            let index = usersList.indexOf(item);
            if (~index) {
                usersList.splice(index, 1);
            }
        });
        if (this.sort) {
            let sortFunc = this.sort.process.bind(this.sort);
            usersList.sort(sortFunc);
        }
        this.container.innerHTML = '';
        let fragment = document.createDocumentFragment();
        usersList.forEach((item, i, arr) =>{
            fragment.appendChild(item.getHtmlElement());
        });
        this.container.appendChild(fragment);
    }
}