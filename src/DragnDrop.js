import './scss/dragnDrop.scss';

export default class DragnDrop {
    constructor(options) {
        let defaultOptions = {
            dragableSelector: '.user',
            dropableSelector: '.user',
            dragBtnClassName: 'icon'
        };
        this.options = {
            ...defaultOptions,
            ...options
        };
        if (!this.options.container) {
            console.error('DragnDrop init failed. Container is empty');
            return;
        }
        this.dragObj = {};
        let iconCollection = this.options.container.querySelectorAll('.icon');
        iconCollection.forEach((item) => {
            item.addEventListener('dragstart', function (e) {
                e.preventDefault();
            });
        });

        let onMouseMove = (e) => {
            let dragObj = this.dragObj;
            if (!dragObj.elem) return;
            if (!dragObj.avatar) {
                if (!this.isMove(e)) return;

                dragObj.avatar = this.createAvatar();
                this.storeShiftData(e);
            }

            let avatar = dragObj.avatar;
            if (avatar.parentNode !== document.body) {
                document.body.appendChild(avatar);
            }
            this.moveAvatar(e);
            this.storeDroppable(e);
            this.indicateDroppable(e);
            return false;
        };

        let onMouseDown = (e) => {
            //Only left mouse click
            if (e.which !=1 ) return false;

            if (!this.isDragged(e)) return;

            let elem = e.target.closest(this.options.dragableSelector);
            if (!elem) return;

            this.dragObj.elem = elem;
            //store init state
            this.dragObj.downX = e.pageX;
            this.dragObj.downY = e.pageY;

            //move event
            document.addEventListener('mousemove', onMouseMove);
        };

        //start move event
        this.options.container.addEventListener('mousedown', onMouseDown);

        //drop event
        document.addEventListener('mouseup', (e) => {
            //check isDragndrop
            if (!this.dragObj.elem) return;

            this.storeDroppable(e);
            this.rollbackDroppable();
            this.drop(e);
            if (this.dragObj.avatar) {
                this.dragObj.avatar.classList.remove('dragged');
            }
            this.dragObj = {};
            document.removeEventListener('mousemove', onMouseMove);
        });

    }

    isMove(e) {
        let dragObj = this.dragObj;
        let moveX = e.pageX - dragObj.downX;
        let moveY = e.pageY - dragObj.downY;
        return !(Math.abs(moveX) < 3 && Math.abs(moveY) < 3)
    }

    //check is drag btn
    isDragged(e) {
        let isOk = false;
        if (e.target.classList.contains(this.options.dragBtnClassName)) {
            isOk = true;
        } else {
            let dragBtn = e.target.closest('.' + this.options.dragBtnClassName);
            if (dragBtn) {
                isOk = true;
            }
        }
        return isOk;
    }

    //store coords relative dragedBtn and name
    storeShiftData() {
        let dragObj = this.dragObj;
        let dragedBtn = dragObj.elem.getElementsByClassName(this.options.dragBtnClassName)[0];
        let coords = this.getCoords(dragedBtn);
        dragObj.shiftX = dragObj.downX - coords.left;
        dragObj.shiftY = dragObj.downY - coords.top;
        dragObj.avatar.classList.add('dragged');
        //It's added Name width to shifX
        dragObj.shiftX += dragObj.avatar.firstElementChild.offsetWidth;
    }

    //move avatar with cursor
    moveAvatar(e) {
        let dragObj = this.dragObj;
        let avatar = dragObj.avatar;
        avatar.style.left = e.pageX - dragObj.shiftX + 'px';
        avatar.style.top = e.pageY - dragObj.shiftY + 'px';
    }

    getCoords(elem) {
        let box = elem.getBoundingClientRect();
        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        }
    }

    //find elemnr for drop under cursor
    findDroppable(e) {
        //check isDragndrop
        if (!this.dragObj.avatar) return;
        let oldDisplay = this.dragObj.avatar.style.display;
        this.dragObj.avatar.style.display = 'none';
        let elem = document.elementFromPoint(e.clientX, e.clientY);
        this.dragObj.avatar.style.display = oldDisplay;
        if (elem == null) {
            return null;
        }
        return elem.closest(this.options.dropableSelector);
    }

    //store droppable element to dragObj and indicate it
    storeDroppable(e) {
        let dropable = this.findDroppable(e);
        let dragObj = this.dragObj;
        if (!dropable) {
            if (dragObj.dropable) {
                this.rollbackDroppable();
            }
            dragObj.dropable = dropable;
            return;
        }
        if (!dragObj.dropable) {
            dragObj.dropable = dropable;
        } else if(dragObj.dropable !== dropable) {
            this.rollbackDroppable();
            dragObj.dropable = dropable;
        }
        this.indicateDroppable(e);
    }

    //clear indicate from droppable element
    rollbackDroppable() {
        let droppable = this.dragObj.dropable;
        if (!droppable) return;
        droppable.classList.remove('drop');
        droppable.classList.remove('drop_after');
        droppable.classList.remove('drop_before');
    }

    indicateDroppable(e) {
        if (!this.dragObj.dropable) return;
        this.rollbackDroppable();
        let droppable = this.dragObj.dropable;
        droppable.classList.add('drop');
        if (this.isDropAfter(e)) {
            droppable.classList.add('drop_after');
        } else {
            droppable.classList.add('drop_before');
        }
    }
    //insert dragabble element after or before current dropable
    drop(e) {
        let drobaple = this.dragObj.dropable;
        if (!this.dragObj.avatar) return;
        if (!drobaple) {
            this.dragObj.avatar.rollback();
            return;
        }
        let elem = this.dragObj.avatar;
        let container = drobaple.parentNode;
        let sibling;
        if (this.isDropAfter(e)) {
            sibling = drobaple.nextSibling;
        } else {
            sibling = drobaple;
        }
        container.insertBefore(elem, sibling);
    }

    isDropAfter(e) {
        if (!this.dragObj.dropable) return;
        let dropableCoords = this.getCoords(this.dragObj.dropable);
        let height = this.dragObj.dropable.offsetHeight;
        let shifY = e.pageY - dropableCoords.top;
        return ! (height/2 > shifY);
    }

    createAvatar() {
        let avatar = this.dragObj.elem;
        let old = {
            parent: avatar.parentNode,
            nextSibling: avatar.nextSibling,
            position: avatar.position || '',
            left: avatar.left || '',
            top: avatar.top || '',
            zIndex: avatar.zIndex || ''
        };

        avatar.rollback = () => {
            old.parent.insertBefore(avatar, old.nextSibling);
            avatar.style.position = old.position;
            avatar.style.left = old.left;
            avatar.style.top = old.top;
            avatar.style.zIndex = old.zIndex;
        };

        return avatar
    }
}