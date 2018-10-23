import './scss/index.scss';
import Ajax from './Ajax.js';
import Users from './Users.js';

document.body.innerHtml = '<h1>Загружаем...</h1>';

let users = new Ajax({
    url: 'https://pikabu.ru/page/interview/frontend/users.php',
    headers: {
        'X-CSRF-Token': 'interview'
    }
})
.then(
    (xhr) => {
        document.body.innerHTML = '';
        return new Users(JSON.parse(xhr.responseText));
    },
    (xhr) => {
        document.body.innerHTML = '<h1>Не удалось загрузить пользователей</h1>'
        console.error(xhr.status, xhr.statusText);
});