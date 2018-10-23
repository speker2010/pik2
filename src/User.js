import icon from './img/menu.svg';
import './scss/user.scss';

export default class User {
    constructor(userData) {
        this.data = userData;
        let data = {
            "name": "velikijslava",
            "avatar": "https://cs6.pikabu.ru/avatars/1589/m1589015-986380403.jpg",
            "rating": 56234.5,
            "stories": 44,
            "comments": 342,
            "date": "2016-05-15T01:53:46+03:00"
        };
    }

    get name() {
        return this.data.name;
    }

    get avatar() {
        return this.data.avatar;
    }

    get rating() {
        return this.data.rating;
    }

    get stories() {
        return this.data.stories;
    }

    get comments() {
        return this.data.comments;
    }

    get date() {
        return new Date(this.data.date);
    }

    get formatDate() {
        let date = this.date;
        let hours = date.getHours();
        if (hours < 10 ) hours = '0' + hours;
        let minutes = date.getMinutes();
        if (minutes < 10) minutes = '0' + minutes;
        let numberDay = date.getDate();
        if (numberDay < 10) numberDay = '0' + numberDay;
        let month = date.getMonth() + 1;
        if (month < 10) month = '0' + month;
        let year = date.getFullYear();
        return `${hours}:${minutes} ${numberDay}:${month}:${year}`;
    }

    getHtmlElement() {
       if (!this.Html) {
           this.Html = document.createElement('tr');
           this.Html.classList.add('user');
           this.Html.userModel = this;
           this.Html.innerHTML = `
                <td class="user__td"><img class="user__avatar" src="${this.avatar}">${this.name}</td>
                <td class="user__td">${this.rating}</td>
                <td class="user__td">${this.stories}</td>
                <td class="user__td">${this.comments}</td>
                <td class="user__td">${this.formatDate}</td>
                <td class="user__icon icon user__td">${icon}</td>
            `;
       }
       return this.Html;
    }
}