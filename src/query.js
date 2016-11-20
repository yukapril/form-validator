var Query = (str, root = document) => root.querySelector(str);
var QueryAll = (str, root = document) => root.querySelectorAll(str);

var QueryFormEl = el => [].reduce.call(el.querySelectorAll('[name]'), (collection, el) => {
    let name = el.name;
    collection[name] = collection[name] || [];
    collection[name].push(el);
    return collection;
}, {});

export { Query, QueryAll, QueryFormEl };
