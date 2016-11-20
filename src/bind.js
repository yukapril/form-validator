var Bind = (elements, next = new Function()) => {
    for (let key in elements) {
        elements[key].forEach(el => {
            switch (el.tagName) {
                case 'INPUT':
                    if (el.type === 'radio') {
                        el.addEventListener('click', e => next(e), false);
                    } else if (el.type === 'checkbox') {
                        el.addEventListener('click', e => next(e), false);
                    } else {
                        el.addEventListener('input', e => next(e), false);
                    }
                    break;
                case 'TEXTAREA':
                    el.addEventListener('input', e => next(e), false);
                    break;
                case 'SELECT':
                    el.addEventListener('change', e => next(e), false);
                    break;
                default:
            }
        });
    }
};

export { Bind };
