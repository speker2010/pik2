export default class Ajax {
    constructor(options) {
        let defaultOptions = {
            method: 'GET',
            assync: true
        };

        this.options = {
            ...defaultOptions,
            ...options
        };

        if (!this.options.url) {
            console.error('options.url is empty');
            return;
        }

        let xhr = new XMLHttpRequest();
        let headers = this.options.headers;
        xhr.open(this.options.method, this.options.url, this.options.assync);

        for (let key in headers) {
            if (headers.hasOwnProperty(key)) {
                xhr.setRequestHeader(key, headers[key]);
            }
        }

        return new Promise((resolve, reject) => {
            xhr.send();
            xhr.onreadystatechange = () => {
                if (Number(xhr.readyState) !== 4) return;

                if (Number(xhr.status) !== 200) {
                    reject(xhr);
                } else {
                    resolve(xhr);
                }
            }
        });
    }
}