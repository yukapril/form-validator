'use strict';
import { Query, QueryAll, QueryFormEl } from './query';
import { Bind } from './bind';
import { Handler } from './handler';

var _el = null,
    _elements = null,
    _rules = null,
    _options = null,
    _next = null;

class FormChecker {
    constructor(str, rules, options) {
        _el = Query(str);
        _elements = QueryFormEl(_el);
        _rules = rules;
        _options = options;

        this.el = _el;
        this.elements = _elements;
    }

    listener(next) {
        _next = next;
        return this;
    }

    init() {
        Handler.bind(this, _elements, _rules, _next, false)()();
        let handler = Handler.bind(this, _elements, _rules, _next, true)();
        Bind(_elements, handler);
        return this;
    }
}

window.FormChecker = FormChecker;
