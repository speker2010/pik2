
class SortWorker {
    constructor() {
        this.modificator = 1;
        this.initFieldName();
    }

    get name() {
        return 'default';
    }

    invert() {
        this.modificator = -1;
    }

    initFieldName() {
        this.fieldName = 'name';
    }

    isNegative() {
        console.log(this.modificator < 0);
        return this.modificator < 0;
    }

    compare(a, b) {
        let fieldName = this.fieldName;
        return (a[fieldName] < b[fieldName]) ? -1 : 1;
    }

    process(a, b) {
        console.log(this);
        return this.modificator * this.compare(a, b);
    }
}

class SortWorkerDigits extends SortWorker {
    compare(a, b) {
        let fieldName = this.fieldName;
        console.log(a[fieldName], b[fieldName], a[fieldName] - b[fieldName]);
        return a[fieldName] - b[fieldName];
    }
}

class SortWorkerName extends SortWorker {
    get name() {
        return 'name';
    }
}

class SortWorkerDate extends SortWorker {
    get name() {
        return 'date';
    }

    initFieldName() {
        this.fieldName = 'date';
    }

    compare(a, b) {
        let fieldName = this.fieldName;
        return a[fieldName].getTime() - b[fieldName].getTime();
    }
}

class SortWorkerRating extends SortWorkerDigits {
    get name() {
        return 'rating';
    }

    initFieldName() {
        this.fieldName = 'rating';
    }
}

class SortWorkerPosts extends SortWorkerDigits {
    get name() {
        return 'stories';
    }

    initFieldName() {
        this.fieldName = 'stories';
    }
}

class SortWorkerComments extends SortWorkerDigits {
    get name() {
        return 'comments';
    }

    initFieldName() {
        this.fieldName = 'comments';
    }
}

export {
    SortWorkerName,
    SortWorkerRating,
    SortWorkerPosts,
    SortWorkerComments,
    SortWorkerDate
};