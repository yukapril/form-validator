var ret = {};

var Handler = function (elements, rules, next, cbFlag) {
    return (event) => {
        for (let key in elements) {
            if (elements.hasOwnProperty(key)) {
                var _r = rules[key],
                    isRequire = false;
                ret[key] = ret[key] || {};
                !!_r && (isRequire = !!_r.isRequire);
                ret[key].isRequire = isRequire;
                ret[key].notEmpty = false;
                ret[key].$value = '';
                ret[key].$valid = false;

                if (event && event.target.name === key) ret[key].$modify = true;
                ret[key].$modify = !!ret[key].$modify;

                elements[key].forEach(el => {
                    var value = el.value;
                    switch (el.tagName) {
                        case 'INPUT':
                            if (el.type === 'radio') {
                                ret[key].notEmpty = !!ret[key].notEmpty || el.checked;
                                ret[key].$valid = !!isRequire ? (ret[key].$valid || el.checked) : true;
                                el.checked && (ret[key].$value = value);
                            } else if (el.type === 'checkbox') {
                                ret[key].notEmpty = !!ret[key].notEmpty || el.checked;
                                ret[key].$valid = !!isRequire ? (ret[key].$valid || el.checked) : true;
                                el.checked && (ret[key].$value = ret[key].$value ? ret[key].$value + ',' + value : value);
                            } else {
                                let minLength = false,
                                    maxLength = false,
                                    exp = false,
                                    checker = false;
                                if (_r) {
                                    minLength = !!_r.minLength ? _r.minLength <= value.length : true;
                                    maxLength = !!_r.maxLength ? _r.maxLength >= value.length : true;
                                    exp = !!_r.exp ? _r.exp.test(value) : true;
                                    
                                    checker = !!_r.checker ? _r.checker(value) : true;
                                }
                                let notEmpty = value.length !== 0;
                                ret[key].notEmpty = notEmpty;
                                ret[key].minLength = minLength;
                                ret[key].maxLength = maxLength;
                                ret[key].exp = exp;
                                ret[key].checker = checker;
                                //debugger;
                                ret[key].$valid = !!isRequire ? (notEmpty && minLength && maxLength && exp && checker) :
                                    (notEmpty ? minLength && maxLength && exp && checker : true);
                                ret[key].$value = value;
                            }
                            break;
                        case 'TEXTAREA':
                            let minLength = false,
                                maxLength = false,
                                exp = false,
                                checker = false;
                            if (_r) {
                                minLength = !!_r.minLength ? _r.minLength <= value.length : true;
                                maxLength = !!_r.maxLength ? _r.maxLength >= value.length : true;
                                exp = !!_r.exp ? _r.exp.test(value) : true;
                                checker = !!_r.checker ? _r.checker(value) : true;
                            }
                            let notEmpty = value.length !== 0;
                            if (_r) {
                                minLength = !!_r.minLength ? _r.minLength <= value.length : true;
                                maxLength = !!_r.maxLength ? _r.maxLength >= value.length : true;
                                exp = !!_r.exp ? _r.exp.test(value) : true;
                                checker = !!_r.checker ? _r.checker(value) : true;
                            }
                            ret[key].notEmpty = notEmpty;
                            ret[key].minLength = minLength;
                            ret[key].maxLength = maxLength;
                            ret[key].exp = exp;
                            ret[key].checker = checker;
                            ret[key].$valid = !!isRequire ? (notEmpty && minLength && maxLength && exp && checker) :
                                (notEmpty ? minLength && maxLength && exp && checker : true);
                            ret[key].$value = value;
                            break;
                        case 'SELECT':
                            let notEmpty2 = value.length !== 0;
                            ret[key].notEmpty = notEmpty2;
                            ret[key].$valid = !!isRequire ? notEmpty2 : true;
                            ret[key].$value = value;
                            break;
                        default:
                    }
                });
            }
        }

        var flag = true,
            json = {};
        for (let key in ret) {
            if (ret.hasOwnProperty(key)) {
                if (key.indexOf('$') === 0) continue;
                json[key] = ret[key].$value;
                if (!ret[key].$valid) {
                    flag = false;
                }
            }
        }
        ret.$valid = flag;
        ret.$modify = cbFlag;
        this.$dataJSON = json;
        this.$checker = ret;
        cbFlag && next(ret);
    };
};

export {Handler};
